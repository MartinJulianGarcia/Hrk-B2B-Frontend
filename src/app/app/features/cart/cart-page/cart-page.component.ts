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
    this.orders.confirmar(this.pedido.id).subscribe(p => this.pedido = p);
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
    // Por ahora redirige al catálogo, más adelante se puede crear una página de historial
    this.router.navigate(['/catalog']);
  }
}