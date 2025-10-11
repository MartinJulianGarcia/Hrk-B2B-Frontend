import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export enum EstadoPedido {
  PENDIENTE = 'Pendiente',
  ENTREGADO = 'Entregado'
}

export enum TipoPedido {
  PEDIDO = 'Pedido',
  DEVOLUCION = 'Devolución'
}

export enum TipoDevolucion {
  SALVABLE = 'Salvable',
  FALLADO = 'Fallado'
}

export interface ItemPedido {
  id: number;
  productoId: number;
  varianteId: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Pedido {
  id: number;
  clienteId: number;
  fecha: Date;
  montoTotal: number;
  estado: EstadoPedido;
  tipo: TipoPedido;
  items: ItemPedido[];
  tipoDevolucion?: TipoDevolucion; // Solo para devoluciones
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private pedidos: Pedido[] = [];
  private nextId = 1;

  constructor() {
    // Datos mock para desarrollo
    this.initializeMockData();
  }

  private initializeMockData(): void {
    const today = new Date();
    this.pedidos = [
      {
        id: 1,
        clienteId: 1,
        fecha: new Date(2024, 3, 24), // 24/04/2024
        montoTotal: 56760,
        estado: EstadoPedido.PENDIENTE,
        tipo: TipoPedido.PEDIDO,
        items: []
      },
      {
        id: 2,
        clienteId: 1,
        fecha: new Date(2024, 3, 15), // 15/04/2024
        montoTotal: 83250,
        estado: EstadoPedido.PENDIENTE,
        tipo: TipoPedido.PEDIDO,
        items: []
      },
      {
        id: 3,
        clienteId: 1,
        fecha: new Date(2024, 3, 2), // 02/04/2024
        montoTotal: 31400,
        estado: EstadoPedido.ENTREGADO,
        tipo: TipoPedido.PEDIDO,
        items: []
      },
      {
        id: 4,
        clienteId: 1,
        fecha: new Date(2024, 2, 20), // 20/03/2024
        montoTotal: 67975,
        estado: EstadoPedido.ENTREGADO,
        tipo: TipoPedido.PEDIDO,
        items: []
      },
      {
        id: 5,
        clienteId: 1,
        fecha: new Date(2024, 2, 5), // 05/03/2024
        montoTotal: 94140,
        estado: EstadoPedido.ENTREGADO,
        tipo: TipoPedido.PEDIDO,
        items: []
      },
      {
        id: 6,
        clienteId: 1,
        fecha: new Date(2024, 1, 18), // 18/02/2024
        montoTotal: 79800,
        estado: EstadoPedido.ENTREGADO,
        tipo: TipoPedido.DEVOLUCION,
        tipoDevolucion: TipoDevolucion.SALVABLE,
        items: []
      }
    ];
    this.nextId = 7;
  }

  // Crear un nuevo pedido desde el carrito
  crearPedido(clienteId: number, items: ItemPedido[]): Observable<Pedido> {
    const montoTotal = items.reduce((total, item) => total + item.subtotal, 0);
    
    const nuevoPedido: Pedido = {
      id: this.nextId++,
      clienteId: clienteId,
      fecha: new Date(),
      montoTotal: montoTotal,
      estado: EstadoPedido.PENDIENTE,
      tipo: TipoPedido.PEDIDO,
      items: items
    };

    this.pedidos.unshift(nuevoPedido); // Agregar al principio
    return of(nuevoPedido);
  }

  // Obtener historial de pedidos por cliente
  getHistorialPorCliente(clienteId: number): Observable<Pedido[]> {
    const pedidosCliente = this.pedidos.filter(p => p.clienteId === clienteId);
    return of(pedidosCliente);
  }

  // Crear devolución
  crearDevolucion(clienteId: number, pedidoOriginalId: number, tipoDevolucion: TipoDevolucion): Observable<Pedido> {
    const pedidoOriginal = this.pedidos.find(p => p.id === pedidoOriginalId);
    if (!pedidoOriginal) {
      throw new Error('Pedido original no encontrado');
    }

    const nuevaDevolucion: Pedido = {
      id: this.nextId++,
      clienteId: clienteId,
      fecha: new Date(),
      montoTotal: pedidoOriginal.montoTotal,
      estado: EstadoPedido.ENTREGADO, // Las devoluciones empiezan como entregadas
      tipo: TipoPedido.DEVOLUCION,
      tipoDevolucion: tipoDevolucion,
      items: []
    };

    this.pedidos.unshift(nuevaDevolucion);
    return of(nuevaDevolucion);
  }

  // Actualizar estado de un pedido
  actualizarEstado(pedidoId: number, nuevoEstado: EstadoPedido): Observable<Pedido> {
    const pedido = this.pedidos.find(p => p.id === pedidoId);
    if (!pedido) {
      throw new Error('Pedido no encontrado');
    }

    pedido.estado = nuevoEstado;
    return of(pedido);
  }

  // Obtener todos los pedidos (para administración)
  getAllPedidos(): Observable<Pedido[]> {
    return of([...this.pedidos]);
  }
}