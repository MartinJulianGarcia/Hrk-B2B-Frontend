import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { CartService, PedidoDTO } from '../../../core/cart.service';
import { OrdersService } from '../../../core/orders.service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe],
  template: `
    <h2>Nota / Carrito</h2>
    <button (click)="convertir()">Generar nota de pedido</button>

    <div *ngIf="pedido as ped" style="margin-top:16px;">
      <h3>Pedido #{{ ped.id }} ({{ ped.estado }})</h3>
      <table>
        <tr><th>Variante</th><th>Cant</th><th>P.Unit</th></tr>
        <tr *ngFor="let d of ped.detalles">
          <td>{{ d.sku || d.varianteId }}</td>
          <td>{{ d.cantidad }}</td>
          <td>{{ d.precioUnitario | currency:'ARS' }}</td>
        </tr>
      </table>
      <div>Total: {{ ped.total | currency:'ARS' }}</div>
      <button (click)="confirmar()"
              [disabled]="ped.estado!=='DOCUMENTADO' && ped.estado!=='BORRADOR'">
        Confirmar pedido
      </button>
    </div>
  `
})
export class CartPageComponent implements OnInit {
  carritoId?: number;
  pedido?: PedidoDTO;

  constructor(private cart: CartService, private orders: OrdersService) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const id = localStorage.getItem('carritoId');
      if (id) this.carritoId = Number(id);
    }
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