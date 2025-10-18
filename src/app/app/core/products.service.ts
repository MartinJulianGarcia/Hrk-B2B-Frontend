import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { Categoria } from './categories.enum';

export interface VarianteDTO {
  id: number; 
  sku: string; 
  color: string; 
  talle: string;
  precio: number; 
  stockDisponible: number;
}

export interface CategoriaDTO { 
  id: number; 
  nombre: string; 
}

// Interfaz que coincide con ProductoResponseDTO del backend
export interface ProductoDTO {
  id: number; 
  nombre: string; 
  descripcion: string;
  tipo: string; 
  imagenUrl: string; 
  categoria: string; // Backend devuelve string del enum
  variantes: VarianteDTO[];
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  // URL base para el backend - cambiar según el entorno
  private readonly BASE_URL = 'http://localhost:8081';  // Desarrollo
  // Para producción cambiar a: 'https://api.tuapp.com'
  
  private readonly API_URL = `${this.BASE_URL}/api`;
  
  constructor(private http: HttpClient) {}

  // Helper para normalizar URLs de imágenes
  private normalizeImageUrl(imageUrl: string): string {
    console.log('🔍 [FRONTEND] Normalizando URL:', imageUrl);
    
    // Si la URL ya es completa, la devolvemos tal como está
    if (imageUrl.startsWith('http')) {
      console.log('🔍 [FRONTEND] URL completa detectada:', imageUrl);
      return imageUrl;
    }
    
    // Si es una imagen por defecto del frontend
    if (imageUrl.startsWith('/images/categories/')) {
      console.log('🔍 [FRONTEND] Imagen por defecto del frontend:', imageUrl);
      return imageUrl;
    }
    
    // Si es una imagen subida al backend, primero probar con proxy
    if (imageUrl.startsWith('/uploads/') || imageUrl.startsWith('uploads/')) {
      const normalizedUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
      console.log('🔍 [FRONTEND] Imagen subida normalizada (proxy):', normalizedUrl);
      // TEMPORAL: Si el proxy no funciona, usar URL directa
      // const directUrl = `http://localhost:8081${normalizedUrl}`;
      // console.log('🔍 [FRONTEND] Intentando URL directa como fallback:', directUrl);
      return normalizedUrl;
    }
    
    // Si es solo el nombre del archivo (sin path), construir la ruta completa
    if (!imageUrl.includes('/') && imageUrl.length > 0 && !imageUrl.includes('.')) {
      // Es probable que sea solo el filename sin extensión o path
      const normalizedUrl = `/uploads/${imageUrl}`;
      console.log('🔍 [FRONTEND] Solo nombre de archivo, construyendo ruta:', normalizedUrl);
      return normalizedUrl;
    }
    
    // Si tiene extensión pero no path, es probable que sea el filename directo del backend
    if (!imageUrl.includes('/') && imageUrl.includes('.') && imageUrl.length > 0) {
      const normalizedUrl = `/uploads/${imageUrl}`;
      console.log('🔍 [FRONTEND] Filename directo del backend, usando proxy path:', normalizedUrl);
      return normalizedUrl;
    }
    
    // Por defecto, devolver tal como está
    console.log('🔍 [FRONTEND] URL sin cambios:', imageUrl);
    return imageUrl;
  }

  // Método para subir imagen
  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    
    // URL para subir imágenes - usar BASE_URL para consistencia
    const uploadUrl = `${this.BASE_URL}/uploads`;
    
    console.log('🔵 [FRONTEND] Subiendo imagen:', file.name, 'Tamaño:', file.size);
    console.log('🔵 [FRONTEND] URL de subida (directa al backend):', uploadUrl);
    
    return this.http.post<string>(uploadUrl, formData, {
      headers: {
        // No especificar Content-Type para que Angular lo maneje automáticamente con multipart/form-data
      },
      responseType: 'text' as 'json'
    }).pipe(
      tap(response => {
        console.log('🔵 [FRONTEND] ✅ Respuesta recibida del servidor:');
        console.log('🔵 [FRONTEND] Tipo:', typeof response);
        console.log('🔵 [FRONTEND] Longitud:', response ? response.length : 0);
        console.log('🔵 [FRONTEND] Primeros 100 caracteres:', response ? response.substring(0, 100) : 'null');
        
        // Verificar si la respuesta parece ser HTML (significa que algo está mal)
        if (typeof response === 'string' && response.trim().startsWith('<!DOCTYPE')) {
          console.error('🔴 [FRONTEND] ❌ La respuesta parece ser HTML en lugar del filename esperado');
          console.error('🔴 [FRONTEND] Esto indica que el endpoint /uploads no está funcionando correctamente');
          console.error('🔴 [FRONTEND] El proxy podría no estar redirigiendo correctamente a http://localhost:8081');
          throw new Error('El servidor devolvió HTML en lugar del filename del archivo');
        }
        
        // Verificar si es una respuesta válida (debería ser solo el filename)
        if (typeof response === 'string' && response.length > 0 && !response.includes('<') && !response.includes('/>')) {
          console.log('🔵 [FRONTEND] ✅ Respuesta válida recibida:', response);
        } else {
          console.error('🔴 [FRONTEND] ❌ Respuesta inválida:', response);
          throw new Error('Respuesta del servidor no es válida');
        }
      }),
      catchError(error => {
        console.error('🔴 [FRONTEND] ❌ Error al subir imagen:');
        console.error('🔴 [FRONTEND] Status:', error.status);
        console.error('🔴 [FRONTEND] StatusText:', error.statusText);
        console.error('🔴 [FRONTEND] URL:', error.url);
        console.error('🔴 [FRONTEND] Error completo:', error);
        
        // Verificar si es un error de CORS o proxy
        if (error.status === 0 || error.status === 404) {
          console.error('🔴 [FRONTEND] Posible problema de proxy o CORS');
          throw new Error('No se puede conectar con el servidor de archivos. Verificar configuración del proxy.');
        }
        
        throw error;
      })
    );
  }
  
  list(): Observable<ProductoDTO[]> {
    console.log('🔵 [FRONTEND] Obteniendo productos desde la API...');
    return this.http.get<ProductoDTO[]>(`${this.API_URL}/productos`).pipe(
      tap(products => {
        console.log('🔵 [FRONTEND] Productos recibidos:', products.length, 'productos');
        
        // Normalizar URLs de imágenes de todos los productos
        products.forEach((product, index) => {
          const originalUrl = product.imagenUrl;
          product.imagenUrl = this.normalizeImageUrl(product.imagenUrl);
          console.log(`🔵 [FRONTEND] Producto ${index + 1}: ${product.nombre}`);
          console.log(`  - URL original: ${originalUrl}`);
          console.log(`  - URL normalizada: ${product.imagenUrl}`);
        });
      }),
      catchError(error => {
        console.error('🔴 [FRONTEND] Error al obtener productos:', error);
        // Fallback a mock data si hay error
        console.log('🟡 [FRONTEND] Usando datos mock como fallback');
    return this.getMockProducts();
      })
    );
  }

  createProduct(productData: any): Observable<any> {
    console.log('🔵 [FRONTEND] Datos enviados:', productData);
    console.log('🔵 [FRONTEND] 🔍 DETALLES DE LA IMAGEN RECIBIDA:', {
      imagen: productData.imagen,
      tipo: typeof productData.imagen,
      esFile: productData.imagen instanceof File,
      nombre: productData.imagen?.name,
      tamaño: productData.imagen?.size,
      constructor: productData.imagen?.constructor?.name
    });
    
    // Validar que los campos requeridos no sean null o undefined
    if (!productData.tipo || !productData.categoria) {
      console.error('🔴 [FRONTEND] Error: Tipo o categoría vacíos', {
        tipo: productData.tipo,
        categoria: productData.categoria
      });
      throw new Error('Tipo y categoría son obligatorios');
    }
    
    // Preparar request básico
    const requestBase: any = {
      nombre: productData.nombre,
      tipo: productData.tipo,
      categoria: productData.categoria,
      sku: productData.sku,
      colores: productData.colores || [],
      talles: productData.talles || [],
      precio: productData.precio,
      stock: productData.stock,
      descripcion: productData.descripcion || ''
    };

    // Verificar si hay imagen
    console.log('🔵 [FRONTEND] Verificando imagen:', {
      imagen: productData.imagen,
      esFile: productData.imagen instanceof File,
      nombre: productData.imagen?.name
    });

    // Si hay imagen, subirla primero
    if (productData.imagen && productData.imagen instanceof File) {
      console.log('🔵 [FRONTEND] Subiendo imagen personalizada:', productData.imagen.name);
      
      return this.uploadImage(productData.imagen).pipe(
        switchMap((imageUrl: string) => {
          console.log('🔵 [FRONTEND] 🎉 ENTRANDO AL switchMap - Imagen subida exitosamente, URL:', imageUrl);
          console.log('🔵 [FRONTEND] Tipo de imageUrl recibido:', typeof imageUrl);
          console.log('🔵 [FRONTEND] Contenido completo de imageUrl:', JSON.stringify(imageUrl));
          
          // Verificar si la respuesta es HTML (significa que algo está mal)
          if (typeof imageUrl === 'string' && (imageUrl.includes('<!DOCTYPE html>') || imageUrl.includes('<!DOCTYPE'))) {
            console.error('🔴 [FRONTEND] ❌ El backend devolvió HTML en lugar del filename. El endpoint /uploads no funciona correctamente.');
            console.error('🔴 [FRONTEND] Continuando sin imagen personalizada...');
            // En lugar de throw, continuamos sin imagen personalizada
            console.log('🟡 [FRONTEND] Creando producto sin imagen personalizada debido a error en upload');
            return this.http.post(`${this.API_URL}/productos`, requestBase);
          }
          
          // Normalizar la URL de la imagen
          const normalizedUrl = this.normalizeImageUrl(imageUrl);
          console.log('🔵 [FRONTEND] URL normalizada:', normalizedUrl);
          
          // Agregar URL de imagen al request
          const request = { ...requestBase, imagenUrl: normalizedUrl };
          console.log('🔵 [FRONTEND] 📤 Request CON imagen al backend:', request);
          console.log('🔵 [FRONTEND] ✅ imagenUrl que se envía al backend:', request.imagenUrl);
          
    return this.http.post(`${this.API_URL}/productos`, request);
        }),
        catchError(error => {
          console.error('🔴 [FRONTEND] Error en subida de imagen:', error);
          console.error('🔴 [FRONTEND] Detalles del error:', {
            status: error.status,
            statusText: error.statusText,
            error: error.error,
            message: error.message
          });
          
          // Si falla la subida, crear producto sin imagen personalizada (fallback)
          console.log('🟡 [FRONTEND] Fallback: creando producto sin imagen personalizada debido a error en upload');
          console.log('🔵 [FRONTEND] Request sin imagen:', requestBase);
          
          // Mostrar mensaje específico al usuario sobre el problema de imagen
          if (error.message && error.message.includes('HTML')) {
            console.log('🟡 [FRONTEND] El problema es que el endpoint /uploads está devolviendo HTML en lugar de procesar el archivo');
            console.log('🟡 [FRONTEND] Esto generalmente se debe a problemas de configuración del proxy o CORS en el backend');
          }
          
          return this.http.post(`${this.API_URL}/productos`, requestBase);
        })
      );
    } else {
      // No hay imagen personalizada
      console.log('🔵 [FRONTEND] No hay imagen personalizada, el backend usará imagen por defecto');
      console.log('🔵 [FRONTEND] Request sin imagen:', requestBase);
      return this.http.post(`${this.API_URL}/productos`, requestBase);
    }
  }

  private getMockProducts(): Observable<ProductoDTO[]> {
    // Mock data para desarrollo
    const mockProducts: ProductoDTO[] = [
      {
        id: 1,
        nombre: 'Remera Básica Tejida',
        descripcion: 'Remera de algodón 100% tejida',
        tipo: 'ROPA',
        imagenUrl: '/images/categories/remera.jpg',
        categoria: Categoria.REMERA,
        variantes: [
          { id: 1, sku: 'REM-S-B', color: 'Blanco', talle: 'S', precio: 1500, stockDisponible: 50 },
          { id: 2, sku: 'REM-M-B', color: 'Blanco', talle: 'M', precio: 1500, stockDisponible: 30 },
          { id: 3, sku: 'REM-L-B', color: 'Blanco', talle: 'L', precio: 1500, stockDisponible: 25 },
          { id: 4, sku: 'REM-S-A', color: 'Azul', talle: 'S', precio: 1500, stockDisponible: 40 },
          { id: 5, sku: 'REM-M-A', color: 'Azul', talle: 'M', precio: 1500, stockDisponible: 35 },
          { id: 6, sku: 'REM-L-A', color: 'Azul', talle: 'L', precio: 1500, stockDisponible: 20 }
        ]
      },
      {
        id: 2,
        nombre: 'Hoodie Sirio Tinto',
        descripcion: 'Hoodie con capucha y bolsillo delantero',
        tipo: 'ROPA',
        imagenUrl: '/images/categories/buzo.jpg',
        categoria: Categoria.BUZO,
        variantes: [
          { id: 7, sku: 'HOO-S-N', color: 'Negro', talle: 'S', precio: 3500, stockDisponible: 15 },
          { id: 8, sku: 'HOO-M-N', color: 'Negro', talle: 'M', precio: 3500, stockDisponible: 20 },
          { id: 9, sku: 'HOO-L-N', color: 'Negro', talle: 'L', precio: 3500, stockDisponible: 18 },
          { id: 10, sku: 'HOO-S-M', color: 'Marrón', talle: 'S', precio: 3500, stockDisponible: 12 },
          { id: 11, sku: 'HOO-M-M', color: 'Marrón', talle: 'M', precio: 3500, stockDisponible: 16 },
          { id: 12, sku: 'HOO-L-M', color: 'Marrón', talle: 'L', precio: 3500, stockDisponible: 14 }
        ]
      },
      {
        id: 3,
        nombre: 'Campera Sherpa Teddy',
        descripcion: 'Campera de sherpa con cierre',
        tipo: 'ROPA',
        imagenUrl: '/images/categories/campera.jpg',
        categoria: Categoria.CAMPERA,
        variantes: [
          { id: 13, sku: 'CAM-S-N', color: 'Negro', talle: 'S', precio: 4500, stockDisponible: 8 },
          { id: 14, sku: 'CAM-M-N', color: 'Negro', talle: 'M', precio: 4500, stockDisponible: 10 },
          { id: 15, sku: 'CAM-L-N', color: 'Negro', talle: 'L', precio: 4500, stockDisponible: 12 },
          { id: 16, sku: 'CAM-S-M', color: 'Marrón', talle: 'S', precio: 4500, stockDisponible: 6 },
          { id: 17, sku: 'CAM-M-M', color: 'Marrón', talle: 'M', precio: 4500, stockDisponible: 9 },
          { id: 18, sku: 'CAM-L-M', color: 'Marrón', talle: 'L', precio: 4500, stockDisponible: 11 }
        ]
      },
      {
        id: 4,
        nombre: 'Chaleco Wendbarr Reversible',
        descripcion: 'Chaleco reversible sin mangas',
        tipo: 'ROPA',
        imagenUrl: '/images/categories/blazer.jpg',
        categoria: Categoria.CHALECO,
        variantes: [
          { id: 19, sku: 'CHA-S-N', color: 'Negro', talle: 'S', precio: 2800, stockDisponible: 15 },
          { id: 20, sku: 'CHA-M-N', color: 'Negro', talle: 'M', precio: 2800, stockDisponible: 18 },
          { id: 21, sku: 'CHA-L-N', color: 'Negro', talle: 'L', precio: 2800, stockDisponible: 12 },
          { id: 22, sku: 'CHA-S-K', color: 'Khaki', talle: 'S', precio: 2800, stockDisponible: 10 },
          { id: 23, sku: 'CHA-M-K', color: 'Khaki', talle: 'M', precio: 2800, stockDisponible: 14 },
          { id: 24, sku: 'CHA-L-K', color: 'Khaki', talle: 'L', precio: 2800, stockDisponible: 8 }
        ]
      },
      {
        id: 5,
        nombre: 'Pantalón Cargo Verde',
        descripcion: 'Pantalón cargo con bolsillos laterales',
        tipo: 'ROPA',
        imagenUrl: '/images/categories/pantalon.jpg',
        categoria: Categoria.PANTALON,
        variantes: [
          { id: 25, sku: 'PAN-S-V', color: 'Verde', talle: 'S', precio: 3200, stockDisponible: 8 },
          { id: 26, sku: 'PAN-M-V', color: 'Verde', talle: 'M', precio: 3200, stockDisponible: 10 },
          { id: 27, sku: 'PAN-L-V', color: 'Verde', talle: 'L', precio: 3200, stockDisponible: 12 },
          { id: 28, sku: 'PAN-S-K', color: 'Khaki', talle: 'S', precio: 3200, stockDisponible: 6 },
          { id: 29, sku: 'PAN-M-K', color: 'Khaki', talle: 'M', precio: 3200, stockDisponible: 9 },
          { id: 30, sku: 'PAN-L-K', color: 'Khaki', talle: 'L', precio: 3200, stockDisponible: 11 }
        ]
      },
      {
        id: 6,
        nombre: 'Short Deportivo Negro',
        descripcion: 'Short cómodo para deporte',
        tipo: 'ROPA',
        imagenUrl: '/images/categories/short.jpg',
        categoria: Categoria.SHORT,
        variantes: [
          { id: 31, sku: 'SHO-S-N', color: 'Negro', talle: 'S', precio: 1800, stockDisponible: 15 },
          { id: 32, sku: 'SHO-M-N', color: 'Negro', talle: 'M', precio: 1800, stockDisponible: 18 },
          { id: 33, sku: 'SHO-L-N', color: 'Negro', talle: 'L', precio: 1800, stockDisponible: 12 },
          { id: 34, sku: 'SHO-S-A', color: 'Azul', talle: 'S', precio: 1800, stockDisponible: 10 },
          { id: 35, sku: 'SHO-M-A', color: 'Azul', talle: 'M', precio: 1800, stockDisponible: 14 },
          { id: 36, sku: 'SHO-L-A', color: 'Azul', talle: 'L', precio: 1800, stockDisponible: 8 }
        ]
      },
      {
        id: 7,
        nombre: 'Sweater de Lana',
        descripcion: 'Sweater cálido de lana natural',
        tipo: 'ROPA',
        imagenUrl: '/images/categories/sweater.jpg',
        categoria: Categoria.SWEATER,
        variantes: [
          { id: 37, sku: 'SWE-S-G', color: 'Gris', talle: 'S', precio: 4200, stockDisponible: 5 },
          { id: 38, sku: 'SWE-M-G', color: 'Gris', talle: 'M', precio: 4200, stockDisponible: 7 },
          { id: 39, sku: 'SWE-L-G', color: 'Gris', talle: 'L', precio: 4200, stockDisponible: 6 },
          { id: 40, sku: 'SWE-S-B', color: 'Beige', talle: 'S', precio: 4200, stockDisponible: 4 },
          { id: 41, sku: 'SWE-M-B', color: 'Beige', talle: 'M', precio: 4200, stockDisponible: 8 },
          { id: 42, sku: 'SWE-L-B', color: 'Beige', talle: 'L', precio: 4200, stockDisponible: 5 }
        ]
      }
    ];

    return new Observable(observer => {
      setTimeout(() => {
        observer.next(mockProducts);
        observer.complete();
      }, 500); // Simular delay de red
    });
  }
}