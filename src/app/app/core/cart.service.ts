import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface PedidoDetalleDTO {
  varianteId: number; cantidad: number; precioUnitario: number;
  sku?: string; color?: string; talle?: string;
}
export interface PedidoDTO {
  id: number; clienteId: number; fecha: string;
  estado: 'BORRADOR'|'DOCUMENTADO'|'CONFIRMADO'|'ABONADO'|'ENVIADO'|'ENTREGADO'|'CANCELADO';
  total: number;
  detalles: PedidoDetalleDTO[];
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private base = '/api/carrito';
  constructor() {}

  crear(clienteId: number): Observable<number> {
    // Mock: simular creación de carrito
    return new Observable(observer => {
      setTimeout(() => {
        const carritoId = Math.floor(Math.random() * 1000) + 1;
        observer.next(carritoId);
        observer.complete();
      }, 300);
    });
  }
  
  agregarItem(carritoId: number, varianteId: number, cantidad: number): Observable<void> {
    // Mock: simular agregado de item
    return new Observable(observer => {
      setTimeout(() => {
        console.log(`Agregando ${cantidad} unidades de variante ${varianteId} al carrito ${carritoId}`);
        observer.next();
        observer.complete();
      }, 200);
    });
  }
  
  convertirAPedido(carritoId: number): Observable<PedidoDTO> {
    // Mock: simular conversión a pedido
    return new Observable(observer => {
      setTimeout(() => {
        const mockPedido: PedidoDTO = {
          id: Math.floor(Math.random() * 1000) + 1,
          clienteId: 1,
          fecha: new Date().toISOString(),
          estado: 'BORRADOR',
          total: 0,
          detalles: []
        };
        observer.next(mockPedido);
        observer.complete();
      }, 500);
    });
  }
}