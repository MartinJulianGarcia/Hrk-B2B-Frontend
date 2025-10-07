import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductoDTO } from '../../../core/products.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.scss']
})
export class ProductGridComponent {
  @Input() producto!: ProductoDTO;
  @Output() add = new EventEmitter<{ varianteId: number; cantidad: number }>();

  talles(): string[] { return Array.from(new Set(this.producto.variantes.map(v => v.talle))).sort(); }
  colores(): string[] { return Array.from(new Set(this.producto.variantes.map(v => v.color))).sort(); }
  findVariante(c: string, t: string) { return this.producto.variantes.find(v => v.color === c && v.talle === t); }

  onChange(c: string, t: string, val: string) {
    const cantidad = Number(val || 0);
    if (cantidad <= 0) return;
    const v = this.findVariante(c, t); if (!v) return;
    this.add.emit({ varianteId: v.id, cantidad });
  }

  overStock(c: string, t: string, val: string): boolean {
    const v = this.findVariante(c, t);
    const cant = Number(val || 0);
    return !!v && cant > v.stockDisponible;
  }
}