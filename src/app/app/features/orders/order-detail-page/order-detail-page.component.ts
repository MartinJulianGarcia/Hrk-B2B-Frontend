import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { OrdersService, Pedido, EstadoPedido, TipoPedido } from '../../../core/orders.service';
import { AuthService } from '../../../core/auth.service';
import { CartService } from '../../../core/cart.service';

@Component({
  selector: 'app-order-detail-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-detail-page.component.html',
  styleUrls: ['./order-detail-page.component.scss']
})
export class OrderDetailPageComponent implements OnInit {
  pedido?: Pedido;
  pedidoId?: number;
  loading = false;
  error?: string;
  cartItemCount = 0;
  
  // Estados disponibles para cambiar (basados en los del backend)
  estadosDisponibles: { value: EstadoPedido; label: string }[] = [
    { value: EstadoPedido.PENDIENTE, label: 'Pendiente' },
    { value: EstadoPedido.ENTREGADO, label: 'Entregado' }
  ];
  
  nuevoEstado?: EstadoPedido;
  cambiandoEstado = false;

  constructor(
    private ordersService: OrdersService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Obtener el ID del pedido desde la ruta
    this.route.params.subscribe(params => {
      this.pedidoId = +params['id'];
      console.log('🔵 [ORDER DETAIL] Pedido ID:', this.pedidoId);
      this.loadPedido();
    });
    
    this.updateCartCount();
  }

  loadPedido(): void {
    if (!this.pedidoId) {
      this.error = 'ID de pedido no válido';
      return;
    }

    this.loading = true;
    this.error = undefined;

    // Por ahora, vamos a buscar el pedido en el historial del cliente
    // Más adelante podríamos crear un endpoint específico para obtener un pedido por ID
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.id) {
      this.error = 'No se pudo identificar al cliente';
      this.loading = false;
      return;
    }

    this.ordersService.getHistorialPorCliente(currentUser.id).subscribe({
      next: pedidos => {
        console.log('🔵 [ORDER DETAIL] Pedidos cargados:', pedidos);
        this.pedido = pedidos.find(p => p.id === this.pedidoId);
        
        if (!this.pedido) {
          this.error = 'Pedido no encontrado';
        } else {
          this.nuevoEstado = this.pedido.estado;
          console.log('🔵 [ORDER DETAIL] Pedido encontrado:', this.pedido);
          console.log('🔵 [ORDER DETAIL] Usuario del pedido:', this.pedido.usuario);
        }
        this.loading = false;
      },
      error: error => {
        console.error('🔴 [ORDER DETAIL] Error al cargar pedidos:', error);
        this.error = 'Error al cargar los detalles del pedido';
        this.loading = false;
      }
    });
  }

  cambiarEstado(): void {
    if (!this.pedido || !this.nuevoEstado || this.nuevoEstado === this.pedido.estado) {
      return;
    }

    this.cambiandoEstado = true;
    console.log('🔵 [ORDER DETAIL] Cambiando estado del pedido', this.pedido.id, 'a:', this.nuevoEstado);

    // Llamar al backend para cambiar el estado
    this.ordersService.cambiarEstadoPedido(this.pedido.id, this.nuevoEstado).subscribe({
      next: (response) => {
        console.log('🔵 [ORDER DETAIL] Estado actualizado exitosamente:', response);
        
        // Actualizar el pedido local con la respuesta del backend
        if (response) {
          this.pedido!.estado = this.nuevoEstado!;
        }
        
        this.cambiandoEstado = false;
        alert(`✅ Estado del pedido #${this.pedido?.id} actualizado exitosamente a: ${this.nuevoEstado}`);
      },
      error: (error) => {
        console.error('🔴 [ORDER DETAIL] Error al cambiar estado:', error);
        this.cambiandoEstado = false;
        
        let errorMessage = 'Error al cambiar el estado del pedido.';
        if (error.status === 500) {
          errorMessage = 'Error interno del servidor. Por favor, inténtalo de nuevo más tarde.';
        } else if (error.status === 404) {
          errorMessage = 'Pedido no encontrado.';
        }
        
        alert(`❌ ${errorMessage}`);
      }
    });
  }

  formatearFecha(fecha: Date): string {
    if (!fecha) return '';
    const dateObj = fecha instanceof Date ? fecha : new Date(fecha);
    return dateObj.toLocaleDateString('es-ES') + ' ' + dateObj.toLocaleTimeString('es-ES');
  }

  formatearMonto(monto: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(monto);
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
