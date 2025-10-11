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
  clienteId: number = 1; // Por ahora hardcodeado, se puede obtener del AuthService
  cartItemCount = 0; // Contador de items en el carrito

  constructor(
    private ordersService: OrdersService,
    private authService: AuthService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadPedidos();
    this.updateCartCount();
  }

  loadPedidos(): void {
    this.ordersService.getHistorialPorCliente(this.clienteId).subscribe(pedidos => {
      this.pedidos = pedidos;
      this.aplicarFiltro();
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
    return fecha.toLocaleDateString('es-ES');
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
}
