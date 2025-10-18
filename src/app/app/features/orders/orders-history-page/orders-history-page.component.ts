import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrdersService, Pedido, EstadoPedido, TipoPedido } from '../../../core/orders.service';
import { AuthService } from '../../../core/auth.service';
import { CartService } from '../../../core/cart.service';

@Component({
  selector: 'app-orders-history-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders-history-page.component.html',
  styleUrls: ['./orders-history-page.component.scss']
})
export class OrdersHistoryPageComponent implements OnInit {
  pedidos: Pedido[] = [];
  pedidosFiltrados: Pedido[] = [];
  filtroFecha: string = '';
  clienteId?: number;
  cartItemCount = 0; // Contador de items en el carrito
  loading = false;
  error?: string;

  constructor(
    private ordersService: OrdersService,
    private authService: AuthService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Obtener el clienteId del usuario actual
    const currentUser = this.authService.getCurrentUser();
    console.log('🔵 [ORDERS HISTORY] Usuario actual:', currentUser);
    this.clienteId = currentUser?.id;
    console.log('🔵 [ORDERS HISTORY] Cliente ID obtenido:', this.clienteId);

    if (!this.clienteId) {
      this.error = 'No se pudo identificar al cliente';
      console.error('🔴 [ORDERS HISTORY] Error: No se pudo obtener cliente ID');
      return;
    }

    this.loadPedidos();
    this.updateCartCount();
  }

  loadPedidos(): void {
    if (!this.clienteId) {
      this.error = 'No se pudo identificar al cliente';
      return;
    }

    this.loading = true;
    this.error = undefined;

    this.ordersService.getHistorialPorCliente(this.clienteId!).subscribe({
      next: pedidos => {
        this.pedidos = pedidos;
        this.aplicarFiltro();
        this.loading = false;
        console.log('🔵 [ORDERS HISTORY] Pedidos cargados:', pedidos.length);
      },
      error: error => {
        console.error('Error al cargar pedidos:', error);
        this.error = 'Error al cargar el historial de pedidos';
        this.loading = false;
        this.pedidos = [];
        this.pedidosFiltrados = [];
      }
    });
  }

  aplicarFiltro(): void {
    this.pedidosFiltrados = this.pedidos.filter(pedido => {
      if (!this.filtroFecha) return true;
      
      const fechaPedido = pedido.fecha.toLocaleDateString('es-ES');
      const fechaFiltro = new Date(this.filtroFecha).toLocaleDateString('es-ES');
      
      return fechaPedido === fechaFiltro;
    });
  }

  onFechaChange(): void {
    this.aplicarFiltro();
  }

  getEstadoClass(estado: EstadoPedido): string {
    switch (estado) {
      case EstadoPedido.PENDIENTE:
        return 'estado-pendiente';
      case EstadoPedido.ENTREGADO:
        return 'estado-entregado';
      default:
        return '';
    }
  }

  getTipoClass(tipo: TipoPedido): string {
    switch (tipo) {
      case TipoPedido.PEDIDO:
        return 'tipo-pedido';
      case TipoPedido.DEVOLUCION:
        return 'tipo-devolucion';
      default:
        return '';
    }
  }

  formatearFecha(fecha: Date): string {
    if (!fecha) return '';
    const dateObj = fecha instanceof Date ? fecha : new Date(fecha);
    return dateObj.toLocaleDateString('es-ES');
  }

  formatearMonto(monto: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(monto);
  }

  generarNotaDevolucion(): void {
    alert('Función disponible próximamente');
  }

  // Métodos de navegación
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  goToCatalog(): void {
    this.router.navigate(['/catalog']);
  }

  goToInfo(): void {
    this.router.navigate(['/info']);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  goToHistory(): void {
    this.router.navigate(['/orders-history']);
  }

  updateCartCount(): void {
    this.cartItemCount = this.cartService.getCantidadItems();
  }

  verDetallePedido(pedidoId: number): void {
    console.log('🔵 [ORDERS HISTORY] Navegando a detalle del pedido:', pedidoId);
    this.router.navigate(['/order-detail', pedidoId]);
  }
}
