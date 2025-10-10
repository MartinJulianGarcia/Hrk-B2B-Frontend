import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductoDTO, ProductsService } from '../../../core/products.service';
import { CartService } from '../../../core/cart.service';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  productos: ProductoDTO[] = [];
  filteredProducts: ProductoDTO[] = [];
  selectedProduct: ProductoDTO | null = null;
  selectedFilter: 'tejido' | 'plano' = 'tejido';
  currentSlide = 0;
  maxSlide = 0;
  selectedQuantities: { [key: string]: number } = {};

  constructor(
    private productsService: ProductsService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productsService.list().subscribe(products => {
      this.productos = products;
      this.applyFilter();
    });
  }

  setFilter(filter: 'tejido' | 'plano'): void {
    this.selectedFilter = filter;
    this.applyFilter();
    this.currentSlide = 0;
  }

  applyFilter(): void {
    // Simular filtro por tipo de material
    this.filteredProducts = this.productos.filter(producto => {
      if (this.selectedFilter === 'tejido') {
        return producto.tipo === 'ROPA' && producto.nombre.toLowerCase().includes('remera');
      } else {
        return producto.tipo === 'ROPA' && !producto.nombre.toLowerCase().includes('remera');
      }
    });
    
    this.maxSlide = Math.max(0, this.filteredProducts.length - 3);
  }

  previousSlide(): void {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    }
  }

  nextSlide(): void {
    if (this.currentSlide < this.maxSlide) {
      this.currentSlide++;
    }
  }

  selectProduct(producto: ProductoDTO): void {
    this.selectedProduct = producto;
    this.selectedQuantities = {};
  }

  getTalles(): string[] {
    if (!this.selectedProduct) return [];
    return Array.from(new Set(this.selectedProduct.variantes.map(v => v.talle))).sort();
  }

  getColores(): string[] {
    if (!this.selectedProduct) return [];
    return Array.from(new Set(this.selectedProduct.variantes.map(v => v.color))).sort();
  }

  getQuantity(color: string, talle: string): number {
    const key = `${color}-${talle}`;
    return this.selectedQuantities[key] || 0;
  }

  updateQuantity(color: string, talle: string, event: any): void {
    const key = `${color}-${talle}`;
    const quantity = parseInt(event.target.value) || 0;
    this.selectedQuantities[key] = quantity;
  }

  getStock(color: string, talle: string): number {
    if (!this.selectedProduct) return 0;
    const variante = this.selectedProduct.variantes.find(v => v.color === color && v.talle === talle);
    return variante?.stockDisponible || 0;
  }

  getMinPrice(producto: ProductoDTO): number {
    return Math.min(...producto.variantes.map(v => v.precio));
  }

  getMaxPrice(producto: ProductoDTO): number {
    return Math.max(...producto.variantes.map(v => v.precio));
  }

  hasSelectedItems(): boolean {
    return Object.values(this.selectedQuantities).some(qty => qty > 0);
  }

  addToCart(): void {
    if (!this.selectedProduct || !this.hasSelectedItems()) return;

    // Obtener cliente ID
    const currentUser = this.authService.getCurrentUser();
    const selectedClient = this.authService.getSelectedClient();
    const clienteId = currentUser?.tipo === 'VENDEDOR' && selectedClient ? selectedClient.id : currentUser?.id;
    
    if (!clienteId) return;

    // Crear carrito si no existe
    this.cartService.crear(clienteId).subscribe(carritoId => {
      // Agregar items seleccionados
      Object.entries(this.selectedQuantities).forEach(([key, quantity]) => {
        if (quantity > 0) {
          const [color, talle] = key.split('-');
          const variante = this.selectedProduct!.variantes.find(v => v.color === color && v.talle === talle);
          if (variante) {
            this.cartService.agregarItem(carritoId, variante.id, quantity).subscribe(() => {
              // Mostrar mensaje de éxito
              alert(`Se agregaron ${quantity} unidades al carrito`);
            });
          }
        }
      });
      
      // Limpiar selección
      this.selectedQuantities = {};
    });
  }

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
    // Por ahora redirige al catálogo, más adelante se puede crear una página de historial
    this.router.navigate(['/catalog']);
  }
}