import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrdersService, ItemPedido } from './orders.service';

export interface PedidoDetalleDTO {
  varianteId: number; cantidad: number; precioUnitario: number;
  sku?: string; color?: string; talle?: string;
}

export interface CarritoItemDTO {
  id: number;
  varianteId: number;
  cantidad: number;
  precioUnitario: number;
  sku: string;
  color: string;
  talle: string;
  productoNombre: string;
  subtotal: number;
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
  private carritoItems: CarritoItemDTO[] = [];
  private carritoId?: number;
  
  constructor(private ordersService: OrdersService) {}

  crear(clienteId: number): Observable<number> {
    // Mock: simular creación de carrito
    return new Observable(observer => {
      setTimeout(() => {
        this.carritoId = Math.floor(Math.random() * 1000) + 1;
        this.carritoItems = []; // Limpiar items
        observer.next(this.carritoId);
        observer.complete();
      }, 300);
    });
  }
  
  agregarItem(carritoId: number, varianteId: number, cantidad: number): Observable<void> {
    // Mock: simular agregado de item
    return new Observable(observer => {
      setTimeout(() => {
        // Simular datos de la variante (en producción vendría del backend)
        const mockVariante = {
          id: varianteId,
          sku: `SKU-${varianteId}`,
          color: 'Negro',
          talle: 'M',
          precio: 1500,
          productoNombre: 'Producto Mock'
        };

        // Buscar si ya existe el item
        const existingItem = this.carritoItems.find(item => item.varianteId === varianteId);
        
        if (existingItem) {
          existingItem.cantidad += cantidad;
          existingItem.subtotal = existingItem.cantidad * existingItem.precioUnitario;
        } else {
          const newItem: CarritoItemDTO = {
            id: this.carritoItems.length + 1,
            varianteId: varianteId,
            cantidad: cantidad,
            precioUnitario: mockVariante.precio,
            sku: mockVariante.sku,
            color: mockVariante.color,
            talle: mockVariante.talle,
            productoNombre: mockVariante.productoNombre,
            subtotal: cantidad * mockVariante.precio
          };
          this.carritoItems.push(newItem);
        }

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
        const total = this.carritoItems.reduce((sum, item) => sum + item.subtotal, 0);
        const mockPedido: PedidoDTO = {
          id: Math.floor(Math.random() * 1000) + 1,
          clienteId: 1,
          fecha: new Date().toISOString(),
          estado: 'BORRADOR',
          total: total,
          detalles: this.carritoItems.map(item => ({
            varianteId: item.varianteId,
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario,
            sku: item.sku,
            color: item.color,
            talle: item.talle
          }))
        };
        observer.next(mockPedido);
        observer.complete();
      }, 500);
    });
  }

  // Métodos para gestionar el carrito local
  getCarritoItems(): CarritoItemDTO[] {
    return this.carritoItems;
  }

  getTotalCarrito(): number {
    return this.carritoItems.reduce((sum, item) => sum + item.subtotal, 0);
  }

  getCantidadItems(): number {
    return this.carritoItems.reduce((sum, item) => sum + item.cantidad, 0);
  }

  limpiarCarrito(): void {
    this.carritoItems = [];
  }

  // Generar pedido desde el carrito
  generarPedido(clienteId: number): Observable<number> {
    if (this.carritoItems.length === 0) {
      throw new Error('El carrito está vacío');
    }

    const items: ItemPedido[] = this.carritoItems.map(item => ({
      id: item.id,
      productoId: 0, // Se puede obtener del servicio de productos
      varianteId: item.varianteId,
      cantidad: item.cantidad,
      precioUnitario: item.precioUnitario,
      subtotal: item.subtotal
    }));

    return new Observable(observer => {
      this.ordersService.crearPedido(clienteId, items).subscribe(pedido => {
        this.limpiarCarrito(); // Limpiar carrito después de crear pedido
        observer.next(pedido.id);
        observer.complete();
      });
    });
  }
}