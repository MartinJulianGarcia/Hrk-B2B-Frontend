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
        nombre: 'Remera Básica',
        descripcion: 'Remera de algodón 100%',
        tipo: 'ROPA',
        imagenUrl: 'https://via.placeholder.com/300x300?text=Remera',
        categoria: { id: 1, nombre: 'Ropa' },
        variantes: [
          { id: 1, sku: 'REM-S-M', color: 'Blanco', talle: 'S', precio: 1500, stockDisponible: 50 },
          { id: 2, sku: 'REM-M-M', color: 'Blanco', talle: 'M', precio: 1500, stockDisponible: 30 },
          { id: 3, sku: 'REM-L-M', color: 'Blanco', talle: 'L', precio: 1500, stockDisponible: 25 },
          { id: 4, sku: 'REM-S-A', color: 'Azul', talle: 'S', precio: 1500, stockDisponible: 40 },
          { id: 5, sku: 'REM-M-A', color: 'Azul', talle: 'M', precio: 1500, stockDisponible: 35 },
          { id: 6, sku: 'REM-L-A', color: 'Azul', talle: 'L', precio: 1500, stockDisponible: 20 }
        ]
      },
      {
        id: 2,
        nombre: 'Jean Clásico',
        descripcion: 'Jean de mezclilla clásico',
        tipo: 'ROPA',
        imagenUrl: 'https://via.placeholder.com/300x300?text=Jean',
        categoria: { id: 1, nombre: 'Ropa' },
        variantes: [
          { id: 7, sku: 'JEA-30-A', color: 'Azul', talle: '30', precio: 3500, stockDisponible: 15 },
          { id: 8, sku: 'JEA-32-A', color: 'Azul', talle: '32', precio: 3500, stockDisponible: 20 },
          { id: 9, sku: 'JEA-34-A', color: 'Azul', talle: '34', precio: 3500, stockDisponible: 18 },
          { id: 10, sku: 'JEA-30-N', color: 'Negro', talle: '30', precio: 3500, stockDisponible: 12 },
          { id: 11, sku: 'JEA-32-N', color: 'Negro', talle: '32', precio: 3500, stockDisponible: 16 },
          { id: 12, sku: 'JEA-34-N', color: 'Negro', talle: '34', precio: 3500, stockDisponible: 14 }
        ]
      },
      {
        id: 3,
        nombre: 'Zapatillas Deportivas',
        descripcion: 'Zapatillas para uso deportivo',
        tipo: 'CALZADO',
        imagenUrl: 'https://via.placeholder.com/300x300?text=Zapatillas',
        categoria: { id: 2, nombre: 'Calzado' },
        variantes: [
          { id: 13, sku: 'ZAP-38-B', color: 'Blanco', talle: '38', precio: 8000, stockDisponible: 8 },
          { id: 14, sku: 'ZAP-40-B', color: 'Blanco', talle: '40', precio: 8000, stockDisponible: 10 },
          { id: 15, sku: 'ZAP-42-B', color: 'Blanco', talle: '42', precio: 8000, stockDisponible: 12 },
          { id: 16, sku: 'ZAP-38-N', color: 'Negro', talle: '38', precio: 8000, stockDisponible: 6 },
          { id: 17, sku: 'ZAP-40-N', color: 'Negro', talle: '40', precio: 8000, stockDisponible: 9 },
          { id: 18, sku: 'ZAP-42-N', color: 'Negro', talle: '42', precio: 8000, stockDisponible: 11 }
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