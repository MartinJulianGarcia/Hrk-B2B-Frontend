import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, JsonPipe } from '@angular/common';
import { ProductsService, ProductoDTO } from '../../../core/products.service';
import { CartService } from '../../../core/cart.service';
import { AuthService } from '../../../core/auth.service';
import { ProductGridComponent } from '../product-grid/product-grid.component';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [NgFor, NgIf, ProductGridComponent, RouterLink, JsonPipe],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  productos: ProductoDTO[] = [];
  clienteId?: number;
  carritoId?: number;
  loading = false; error?: string;
  selectedFilter: 'tejido' | 'plano' | 'all' = 'all';

  constructor(
    private products: ProductsService, 
    private cart: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Determinar el cliente ID basado en el tipo de usuario
    const currentUser = this.authService.getCurrentUser();
    const selectedClient = this.authService.getSelectedClient();
    
    // Simplificado: siempre usar el ID del usuario actual
    if (currentUser) {
      this.clienteId = currentUser.id;
    }

    if (!this.clienteId) {
      this.error = 'No se pudo determinar el cliente';
      return;
    }

    this.loading = true;
    this.products.list().subscribe({
      next: p => { 
        this.productos = p; 
        this.loading = false; 
      },
      error: e => { 
        console.error('Error al cargar productos:', e);
        this.error = 'No se pudo cargar el catálogo'; 
        this.loading = false; 
      }
    });
    
    this.cart.crear(this.clienteId).subscribe(id => {
      this.carritoId = id;
      // El servicio ya maneja localStorage, no necesitamos hacerlo aquí
    });
  }

  onAdd(varianteId: number, cantidad: number) {
    if (!this.carritoId) return;
    this.cart.agregarItem(this.carritoId, varianteId, cantidad).subscribe();
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

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  goToHistory(): void {
    this.router.navigate(['/orders-history']);
  }

  cartItemCount = 0; // TODO: Implementar conteo real del carrito

  setFilter(filter: 'tejido' | 'plano' | 'all') {
    this.selectedFilter = filter;
  }

  isAdmin(): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.tipoUsuario === 'ADMIN';
  }

  goToAddProduct(): void {
    this.router.navigate(['/add-product']);
  }
}