import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductoDTO, ProductsService } from '../../../core/products.service';
import { CartService } from '../../../core/cart.service';
import { AuthService } from '../../../core/auth.service';
import { Categoria } from '../../../core/categories.enum';

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
  itemsPerView = 5; // Mostrar 5 elementos
  showNavigation = false; // Controla si mostrar botones de navegación
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
  }

  applyFilter(): void {
    // Filtrar por categorías específicas
    this.filteredProducts = this.productos.filter(producto => {
      if (this.selectedFilter === 'tejido') {
        // Productos tejidos: remeras, buzos, sweaters
        return producto.categoria === Categoria.REMERA || 
               producto.categoria === Categoria.BUZO ||
               producto.categoria === Categoria.SWEATER;
      } else {
        // Productos planos: camperas, chalecos, pantalones, shorts
        return producto.categoria === Categoria.CAMPERA || 
               producto.categoria === Categoria.CHALECO ||
               producto.categoria === Categoria.PANTALON ||
               producto.categoria === Categoria.SHORT;
      }
    });
    
    // Lógica de distribución inteligente
    this.updateCarouselLogic();
    
    // Seleccionar el producto apropiado según la cantidad
    this.updateSelectedProduct();
  }

  updateCarouselLogic(): void {
    const productCount = this.filteredProducts.length;
    
    if (productCount <= 5) {
      // Para 5 o menos productos: mostrar todos centrados, sin navegación
      this.itemsPerView = productCount;
      this.currentSlide = 0;
      this.maxSlide = 0;
      this.showNavigation = false;
    } else {
      // Para 6+ productos: carrusel completo con navegación
      this.itemsPerView = 5;
      this.currentSlide = 0;
      this.maxSlide = productCount - 5;
      this.showNavigation = true;
    }
  }

  previousSlide(): void {
    if (this.currentSlide > 0) {
      this.currentSlide--;
      this.updateSelectedProduct();
    }
  }

  nextSlide(): void {
    if (this.currentSlide < this.maxSlide) {
      this.currentSlide++;
      this.updateSelectedProduct();
    }
  }

  updateSelectedProduct(): void {
    if (this.filteredProducts.length === 0) {
      this.selectedProduct = null;
      this.selectedQuantities = {};
      return;
    }

    if (this.filteredProducts.length <= 5) {
      // Para pocos productos: seleccionar el primero (más a la izquierda)
      this.selectedProduct = this.filteredProducts[0];
    } else {
      // Para muchos productos: seleccionar el del medio de los visibles
      const middleIndex = this.currentSlide + Math.floor(this.itemsPerView / 2);
      if (middleIndex < this.filteredProducts.length) {
        this.selectedProduct = this.filteredProducts[middleIndex];
      }
    }
    this.selectedQuantities = {}; // Limpiar cantidades al cambiar producto
  }

  selectProduct(producto: ProductoDTO): void {
    this.selectedProduct = producto;
    this.selectedQuantities = {};
    
    // Encontrar el índice del producto seleccionado y ajustar el carrusel
    const productIndex = this.filteredProducts.findIndex(p => p.id === producto.id);
    if (productIndex !== -1) {
      // Ajustar currentSlide para que el producto seleccionado esté en el medio
      const middleOffset = Math.floor(this.itemsPerView / 2);
      this.currentSlide = Math.max(0, Math.min(this.maxSlide, productIndex - middleOffset));
    }
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