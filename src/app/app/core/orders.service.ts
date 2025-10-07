import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PedidoDTO } from './cart.service';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private base = '/api/pedidos';
  constructor() {}
  
  confirmar(pedidoId: number): Observable<PedidoDTO> {
    // Mock: simular confirmación de pedido
    return new Observable(observer => {
      setTimeout(() => {
        const mockPedido: PedidoDTO = {
          id: pedidoId,
          clienteId: 1,
          fecha: new Date().toISOString(),
          estado: 'CONFIRMADO',
          total: 0,
          detalles: []
        };
        observer.next(mockPedido);
        observer.complete();
      }, 500);
    });
  }
  
  cancelar(pedidoId: number): Observable<PedidoDTO> {
    // Mock: simular cancelación de pedido
    return new Observable(observer => {
      setTimeout(() => {
        const mockPedido: PedidoDTO = {
          id: pedidoId,
          clienteId: 1,
          fecha: new Date().toISOString(),
          estado: 'CANCELADO',
          total: 0,
          detalles: []
        };
        observer.next(mockPedido);
        observer.complete();
      }, 500);
    });
  }
}