import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { CartService } from '../../../core/cart.service';

@Component({
  selector: 'app-info-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-page.component.html',
  styleUrls: ['./info-page.component.scss']
})
export class InfoPageComponent implements OnInit {
  cartItemCount = 0; // Contador de items en el carrito

  constructor(
    private authService: AuthService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.updateCartCount();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToCatalog(): void {
    this.router.navigate(['/catalog']);
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  goToInfo(): void {
    this.router.navigate(['/info']);
  }

  goToWhatsApp(): void {
    const phoneNumber = '5491132550195'; // Número sin + y con código de país
    const message = 'Hola! Necesito ayuda con mi pedido.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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
