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
  template: `
    <h2>Catálogo</h2>
    <div *ngIf="loading">Cargando…</div>
    <div *ngIf="error" style="color:#c00">{{ error }}</div>

    <div *ngFor="let p of productos" class="card" style="margin-bottom:20px;">
      <div style="display:flex; gap:16px; align-items:center;">
        <img [src]="p.imagenUrl" alt="{{p.nombre}}" width="100">
        <div>
          <h3>{{ p.nombre }}</h3>
          <div>{{ p.descripcion }}</div>
        </div>
      </div>

      <app-product-grid [producto]="p" (add)="onAdd($event.varianteId, $event.cantidad)"></app-product-grid>
    </div>

    <a routerLink="/cart">Ir al carrito / nota</a>
  `
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
    
    if (currentUser?.tipo === 'VENDEDOR' && selectedClient) {
      this.clienteId = selectedClient.id;
    } else if (currentUser?.tipo === 'CLIENTE') {
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