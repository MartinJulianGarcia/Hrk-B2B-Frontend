import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { CartService } from '../../../core/cart.service';
import { ProductsService } from '../../../core/products.service';

export interface ProductFormData {
  nombre: string;
  tipo: string;
  categoria: 'TEJIDO' | 'PLANO' | null;
  sku: string;
  colores: string[];
  talles: string[];
  precio: number | null;
  stock: number | null;
  descripcion?: string;
  imagen?: File;
}

@Component({
  selector: 'app-add-product-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product-page.component.html',
  styleUrls: ['./add-product-page.component.scss']
})
export class AddProductPageComponent implements OnInit {
  productData: ProductFormData = {
    nombre: '',
    tipo: '',
    categoria: null,
    sku: '',
    colores: [],
    talles: [],
    precio: null,
    stock: null,
    descripcion: ''
  };

  tipoProductos: string[] = [
    'REMERA',
    'MUSCULOSA',
    'PANTALON',
    'SHORT',
    'BLUSA',
    'MONO',
    'VESTIDO',
    'TOP',
    'CARDIGAN',
    'RUANA',
    'SWEATER',
    'BUFANDA',
    'GORRO',
    'MITONES',
    'TAPADO',
    'CAPA',
    'SACO',
    'BUZO',
    'CAMPERA',
    'CHALECO'
  ];

  // Categorías de talles (solo se puede seleccionar UNA categoría)
  categoriasTalles = [
    {
      id: 'letras',
      nombre: 'Talles de Letras',
      opciones: ['U', 'S/M', 'S/M/L', 'XS/S/M/L', 'S/M/L/XL', 'XS/S/M/L/XL']
    },
    {
      id: 'numericos',
      nombre: 'Talles Numéricos',
      opciones: ['40/42', '40/42/44', '38/40/42/44', '36/38/40/42', '36/38/40/42/44']
    }
  ];

  categoriaTalleSeleccionada: string | null = 'letras'; // Por defecto "Talles de Letras"

  opcionesColores: string[] = [
    'Blanco',
    'Negro',
    'Azul',
    'Rojo',
    'Verde',
    'Amarillo',
    'Naranja',
    'Rosa',
    'Violeta',
    'Marrón',
    'Gris',
    'Beige',
    'Celeste',
    'Turquesa',
    'Coral',
    'Bordeaux',
    'Navy',
    'Khaki',
    'Camel',
    'Crudo'
  ];

  loading = false;
  error = '';
  success = '';
  cartItemCount = 0;
  formSubmitted = false; // Control para mostrar errores solo después de intentar enviar

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private productsService: ProductsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verificar que el usuario sea ADMIN
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/catalog']);
      return;
    }

    this.updateCartCount();
  }

  onSubmit(): void {
    if (this.loading) return;

    this.formSubmitted = true; // Marcar que se intentó enviar el formulario
    this.loading = true;
    this.error = '';
    this.success = '';

    // Validar datos
    if (!this.validateForm()) {
      this.loading = false;
      return;
    }

    // Llamada real al backend para crear producto
    console.log('🔵 [FRONTEND] Datos del producto a crear:', this.productData);
    console.log('🔵 [FRONTEND] Tipo:', this.productData.tipo);
    console.log('🔵 [FRONTEND] Categoría:', this.productData.categoria);
    console.log('🔵 [FRONTEND] Colores:', this.productData.colores);
    console.log('🔵 [FRONTEND] Talles:', this.productData.talles);
    console.log('🔵 [FRONTEND] Precio:', this.productData.precio);
    console.log('🔵 [FRONTEND] Stock:', this.productData.stock);
    
    this.productsService.createProduct(this.productData).subscribe({
      next: (response) => {
        this.loading = false;
        this.success = 'Producto creado exitosamente';
        console.log('Producto creado:', response);
        
        // Limpiar formulario
        this.resetForm();
        
        // Redirigir al catálogo después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/catalog']);
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        console.error('🔴 [FRONTEND] Error al crear producto:', error);
        
        let errorMessage = 'Error al crear el producto. Inténtalo de nuevo.';
        if (error.status === 400) {
          errorMessage = 'Error 400: Datos inválidos. Revisa que todos los campos estén completos.';
        } else if (error.status === 500) {
          errorMessage = 'Error del servidor. Inténtalo más tarde.';
        }
        
        this.error = errorMessage;
      }
    });
  }

  private validateForm(): boolean {
    if (!this.productData.nombre.trim()) {
      this.error = 'El nombre del producto es obligatorio';
      return false;
    }

    if (!this.productData.tipo) {
      this.error = 'Debes seleccionar un tipo de producto';
      return false;
    }

    if (!this.productData.categoria) {
      this.error = 'Debes seleccionar una categoría';
      return false;
    }

    if (!this.productData.sku.trim()) {
      this.error = 'El SKU es obligatorio';
      return false;
    }

    if (this.productData.colores.length === 0) {
      this.error = 'Debes seleccionar al menos un color';
      return false;
    }

    if (this.productData.talles.length === 0) {
      this.error = 'Debes seleccionar al menos un talle';
      return false;
    }

    if (!this.productData.precio || this.productData.precio <= 0) {
      this.error = 'El precio debe ser mayor a 0';
      return false;
    }

    if (this.productData.stock === null || this.productData.stock < 0) {
      this.error = 'El stock debe ser mayor o igual a 0';
      return false;
    }

    return true;
  }

  private resetForm(): void {
    this.productData = {
      nombre: '',
      tipo: '',
      categoria: null,
      sku: '',
      colores: [],
      talles: [],
      precio: null,
      stock: null,
      descripcion: ''
    };
    this.categoriaTalleSeleccionada = 'letras'; // Mantener "Talles de Letras" por defecto
    this.formSubmitted = false; // Limpiar el estado de envío
  }

  // Métodos para manejar selección múltiple
  selectTalleCategory(categoriaId: string): void {
    // Limpiar talles seleccionados al cambiar categoría
    this.productData.talles = [];
    this.categoriaTalleSeleccionada = categoriaId;
  }

  getTallesDisponibles(): string[] {
    if (!this.categoriaTalleSeleccionada) return [];
    
    const categoria = this.categoriasTalles.find(c => c.id === this.categoriaTalleSeleccionada);
    return categoria ? categoria.opciones : [];
  }

  toggleTalle(talle: string): void {
    // Solo se puede seleccionar UN talle específico a la vez
    if (this.productData.talles.includes(talle)) {
      // Si ya está seleccionado, deseleccionarlo
      this.productData.talles = [];
    } else {
      // Si no está seleccionado, seleccionarlo (y deseleccionar cualquier otro)
      this.productData.talles = [talle];
    }
  }

  toggleColor(color: string): void {
    const index = this.productData.colores.indexOf(color);
    if (index > -1) {
      this.productData.colores.splice(index, 1);
    } else {
      this.productData.colores.push(color);
    }
  }

  isTalleSelected(talle: string): boolean {
    // Solo puede haber un talle seleccionado
    return this.productData.talles.length === 1 && this.productData.talles[0] === talle;
  }

  isColorSelected(color: string): boolean {
    return this.productData.colores.includes(color);
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.productData.imagen = file;
    }
  }

  onTipoChange(): void {
    // No sugerir automáticamente, el usuario debe elegir manualmente
    // Esto permite total flexibilidad para todos los tipos de producto
  }

  getColorValue(color: string): string {
    const colorMap: { [key: string]: string } = {
      'Blanco': '#ffffff',
      'Negro': '#000000',
      'Azul': '#007bff',
      'Rojo': '#dc3545',
      'Verde': '#28a745',
      'Amarillo': '#ffc107',
      'Naranja': '#fd7e14',
      'Rosa': '#e83e8c',
      'Violeta': '#6f42c1',
      'Marrón': '#795548',
      'Gris': '#6c757d',
      'Beige': '#f5f5dc',
      'Celeste': '#17a2b8',
      'Turquesa': '#20c997',
      'Coral': '#ff7f50',
      'Bordeaux': '#722f37',
      'Navy': '#001f3f',
      'Khaki': '#f0e68c',
      'Camel': '#c19a6b',
      'Crudo': '#f4f1e8'
    };
    return colorMap[color] || '#cccccc';
  }

  // Métodos de navegación
  goToCatalog(): void {
    this.router.navigate(['/catalog']);
  }

  goToInfo(): void {
    this.router.navigate(['/info']);
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  goToHistory(): void {
    this.router.navigate(['/orders-history']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  updateCartCount(): void {
    this.cartItemCount = this.cartService.getCantidadItems();
  }
}