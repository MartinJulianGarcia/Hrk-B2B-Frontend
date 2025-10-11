import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CartService, PedidoDTO, CarritoItemDTO } from '../../../core/cart.service';
import { OrdersService } from '../../../core/orders.service';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe, RouterLink],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss']
})
export class CartPageComponent implements OnInit {
  carritoId?: number;
  pedido?: PedidoDTO;
  carritoItems: CarritoItemDTO[] = [];
  totalCarrito = 0;
  cantidadItems = 0;
  cartItemCount = 0; // Contador de items en el carrito

  constructor(
    private cart: CartService, 
    private orders: OrdersService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const id = localStorage.getItem('carritoId');
      if (id) this.carritoId = Number(id);
    }
    this.loadCarritoItems();
    this.updateCartCount();
  }

  loadCarritoItems(): void {
    this.carritoItems = this.cart.getCarritoItems();
    this.totalCarrito = this.cart.getTotalCarrito();
    this.cantidadItems = this.cart.getCantidadItems();
  }

  convertir() {
    if (!this.carritoId) return;
    this.cart.convertirAPedido(this.carritoId).subscribe(p => this.pedido = p);
  }

  confirmar() {
    if (!this.pedido) return;
    // TODO: Implementar confirmación de pedido cuando se agregue al backend
    console.log('Confirmar pedido:', this.pedido.id);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
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

  generarPedido(): void {
    if (this.carritoItems.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    // Obtener cliente ID
    const currentUser = this.authService.getCurrentUser();
    const selectedClient = this.authService.getSelectedClient();
    const clienteId = currentUser?.id; // Simplificado: siempre usar el ID del usuario actual
    
    if (!clienteId) {
      alert('Error: No se pudo identificar al cliente');
      return;
    }

    // Generar pedido
    this.cart.generarPedido(clienteId).subscribe(pedidoId => {
      alert(`Pedido generado exitosamente. Número de pedido: ${pedidoId}`);
      this.loadCarritoItems(); // Recargar items (debería estar vacío ahora)
      this.router.navigate(['/orders-history']);
    }, error => {
      alert('Error al generar el pedido: ' + error.message);
    });
  }

  updateCartCount(): void {
    this.cartItemCount = this.cart.getCantidadItems();
  }
}