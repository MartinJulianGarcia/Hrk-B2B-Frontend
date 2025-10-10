import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria } from './categories.enum';

export interface VarianteDTO {
  id: number; sku: string; color: string; talle: string;
  precio: number; stockDisponible: number;
}
export interface CategoriaDTO { id: number; nombre: string; }
export interface ProductoDTO {
  id: number; nombre: string; descripcion: string;
  tipo: string; imagenUrl: string; categoria: Categoria;
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