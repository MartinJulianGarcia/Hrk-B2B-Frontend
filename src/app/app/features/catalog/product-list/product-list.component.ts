import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ProductsService, ProductoDTO } from '../../../core/products.service';
import { CartService } from '../../../core/cart.service';
import { AuthService } from '../../../core/auth.service';
import { ProductGridComponent } from '../product-grid/product-grid.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [NgFor, NgIf, ProductGridComponent, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  productos: ProductoDTO[] = [];
  clienteId?: number;
  carritoId?: number;
  loading = false; error?: string;

  constructor(
    private products: ProductsService, 
    private cart: CartService,
    private authService: AuthService
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
      next: p => { this.productos = p; this.loading = false; },
      error: _ => { this.error = 'No se pudo cargar el catálogo'; this.loading = false; }
    });
    
    this.cart.crear(this.clienteId).subscribe(id => {
      this.carritoId = id;
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('carritoId', String(id));
      }
    });
  }

  onAdd(varianteId: number, cantidad: number) {
    if (!this.carritoId) return;
    this.cart.agregarItem(this.carritoId, varianteId, cantidad).subscribe();
  }
}