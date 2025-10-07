import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface VarianteDTO {
  id: number; sku: string; color: string; talle: string;
  precio: number; stockDisponible: number;
}
export interface CategoriaDTO { id: number; nombre: string; }
export interface ProductoDTO {
  id: number; nombre: string; descripcion: string;
  tipo: string; imagenUrl: string; categoria?: CategoriaDTO;
  variantes: VarianteDTO[];
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private base = '/api/productos';
  constructor() {}
  
  list(): Observable<ProductoDTO[]> {
    // Mock data para desarrollo
    const mockProducts: ProductoDTO[] = [
      {
        id: 1,
        nombre: 'Remera Básica Tejida',
        descripcion: 'Remera de algodón 100% tejida',
        tipo: 'ROPA',
        imagenUrl: 'https://via.placeholder.com/300x300?text=Remera',
        categoria: { id: 1, nombre: 'Ropa' },
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
        imagenUrl: 'https://via.placeholder.com/300x300?text=Hoodie',
        categoria: { id: 1, nombre: 'Ropa' },
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
        imagenUrl: 'https://via.placeholder.com/300x300?text=Campera',
        categoria: { id: 1, nombre: 'Ropa' },
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
        imagenUrl: 'https://via.placeholder.com/300x300?text=Chaleco',
        categoria: { id: 1, nombre: 'Ropa' },
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
        nombre: 'Zapatillas Deportivas',
        descripcion: 'Zapatillas para uso deportivo',
        tipo: 'CALZADO',
        imagenUrl: 'https://via.placeholder.com/300x300?text=Zapatillas',
        categoria: { id: 2, nombre: 'Calzado' },
        variantes: [
          { id: 25, sku: 'ZAP-38-B', color: 'Blanco', talle: '38', precio: 8000, stockDisponible: 8 },
          { id: 26, sku: 'ZAP-40-B', color: 'Blanco', talle: '40', precio: 8000, stockDisponible: 10 },
          { id: 27, sku: 'ZAP-42-B', color: 'Blanco', talle: '42', precio: 8000, stockDisponible: 12 },
          { id: 28, sku: 'ZAP-38-N', color: 'Negro', talle: '38', precio: 8000, stockDisponible: 6 },
          { id: 29, sku: 'ZAP-40-N', color: 'Negro', talle: '40', precio: 8000, stockDisponible: 9 },
          { id: 30, sku: 'ZAP-42-N', color: 'Negro', talle: '42', precio: 8000, stockDisponible: 11 }
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