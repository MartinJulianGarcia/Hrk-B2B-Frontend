import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService, PedidoDTO, CarritoItemDTO } from '../../../core/cart.service';
import { OrdersService } from '../../../core/orders.service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe, RouterLink],
  template: `
    <div class="cart-container">
      <h2>Carrito de Compras</h2>
      
      <!-- Items del carrito -->
      <div *ngIf="carritoItems.length > 0; else emptyCart" class="cart-items">
        <div class="cart-header">
          <h3>Items en el carrito ({{ cantidadItems }})</h3>
        </div>
        
        <div class="items-list">
          <div *ngFor="let item of carritoItems" class="cart-item">
            <div class="item-info">
              <h4>{{ item.productoNombre }}</h4>
              <p>{{ item.color }} - Talle {{ item.talle }}</p>
              <p>SKU: {{ item.sku }}</p>
            </div>
            <div class="item-quantity">
              <span>Cantidad: {{ item.cantidad }}</span>
            </div>
            <div class="item-price">
              <span class="unit-price">{{ item.precioUnitario | currency:'ARS' }} c/u</span>
              <span class="subtotal">{{ item.subtotal | currency:'ARS' }}</span>
            </div>
          </div>
        </div>
        
        <div class="cart-total">
          <div class="total-line">
            <span>Total: {{ totalCarrito | currency:'ARS' }}</span>
          </div>
        </div>
        
        <div class="cart-actions">
          <button (click)="convertir()" class="btn-primary">
            Generar Nota de Pedido
          </button>
        </div>
      </div>
      
      <!-- Carrito vacío -->
      <ng-template #emptyCart>
        <div class="empty-cart">
          <h3>Tu carrito está vacío</h3>
          <p>Agrega productos desde el catálogo</p>
          <a routerLink="/catalog" class="btn-primary">Ir al Catálogo</a>
        </div>
      </ng-template>

      <!-- Pedido generado -->
      <div *ngIf="pedido as ped" class="pedido-section">
        <h3>Pedido #{{ ped.id }} ({{ ped.estado }})</h3>
        <table class="pedido-table">
          <thead>
            <tr><th>Variante</th><th>Cant</th><th>P.Unit</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let d of ped.detalles">
              <td>{{ d.sku || d.varianteId }}</td>
              <td>{{ d.cantidad }}</td>
              <td>{{ d.precioUnitario | currency:'ARS' }}</td>
            </tr>
          </tbody>
        </table>
        <div class="pedido-total">Total: {{ ped.total | currency:'ARS' }}</div>
        <button (click)="confirmar()"
                [disabled]="ped.estado!=='DOCUMENTADO' && ped.estado!=='BORRADOR'"
                class="btn-confirm">
          Confirmar pedido
        </button>
      </div>
    </div>
  `,
  styles: [`
    .cart-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .cart-items {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
    }

    .cart-header h3 {
      margin: 0 0 20px 0;
      color: #333;
    }

    .items-list {
      margin-bottom: 20px;
    }

    .cart-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      border-bottom: 1px solid #e1e5e9;
    }

    .cart-item:last-child {
      border-bottom: none;
    }

    .item-info h4 {
      margin: 0 0 5px 0;
      color: #333;
    }

    .item-info p {
      margin: 2px 0;
      color: #666;
      font-size: 14px;
    }

    .item-quantity {
      font-weight: 500;
      color: #667eea;
    }

    .item-price {
      text-align: right;
    }

    .unit-price {
      display: block;
      font-size: 12px;
      color: #666;
    }

    .subtotal {
      font-weight: 600;
      color: #333;
      font-size: 16px;
    }

    .cart-total {
      border-top: 2px solid #e1e5e9;
      padding-top: 15px;
    }

    .total-line {
      text-align: right;
      font-size: 20px;
      font-weight: 600;
      color: #333;
    }

    .cart-actions {
      margin-top: 20px;
      text-align: center;
    }

    .btn-primary {
      background: #667eea;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-primary:hover {
      background: #5a6fd8;
      transform: translateY(-2px);
    }

    .empty-cart {
      text-align: center;
      padding: 60px 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .empty-cart h3 {
      color: #333;
      margin-bottom: 10px;
    }

    .empty-cart p {
      color: #666;
      margin-bottom: 20px;
    }

    .pedido-section {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 20px;
      margin-top: 20px;
    }

    .pedido-table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }

    .pedido-table th,
    .pedido-table td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #e1e5e9;
    }

    .pedido-table th {
      background: #f8f9fa;
      font-weight: 600;
    }

    .pedido-total {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin: 15px 0;
    }

    .btn-confirm {
      background: #28a745;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
    }

    .btn-confirm:hover:not(:disabled) {
      background: #218838;
    }

    .btn-confirm:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  `]
})
export class CartPageComponent implements OnInit {
  carritoId?: number;
  pedido?: PedidoDTO;
  carritoItems: CarritoItemDTO[] = [];
  totalCarrito = 0;
  cantidadItems = 0;

  constructor(private cart: CartService, private orders: OrdersService) {}

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
}