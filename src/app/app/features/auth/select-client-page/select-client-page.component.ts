import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, Cliente } from '../../../core/auth.service';

@Component({
  selector: 'app-select-client-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="select-client-container">
      <div class="select-client-card">
        <h2>Seleccionar Cliente</h2>
        <p class="subtitle">Como vendedor, selecciona el cliente para el cual realizarás el pedido</p>

        <div class="search-section">
          <input 
            type="text" 
            placeholder="Buscar cliente por nombre o email..."
            [(ngModel)]="searchTerm"
            (input)="filterClients()"
            class="search-input"
          >
        </div>

        <div *ngIf="loading" class="loading">
          Cargando clientes...
        </div>

        <div *ngIf="error" class="error-message">
          {{ error }}
        </div>

        <div *ngIf="!loading && !error" class="clients-list">
          <div 
            *ngFor="let cliente of filteredClients" 
            class="client-card"
            [class.selected]="selectedClient?.id === cliente.id"
            (click)="selectClient(cliente)"
          >
            <div class="client-info">
              <h3>{{ cliente.nombre }}</h3>
              <p class="client-email">{{ cliente.email }}</p>
              <div *ngIf="cliente.telefono" class="client-details">
                <span class="detail-item">📞 {{ cliente.telefono }}</span>
              </div>
              <div *ngIf="cliente.direccion" class="client-details">
                <span class="detail-item">📍 {{ cliente.direccion }}</span>
              </div>
            </div>
            <div class="client-status">
              <span class="status-badge" [class.active]="cliente.activo">
                {{ cliente.activo ? 'Activo' : 'Inactivo' }}
              </span>
            </div>
          </div>

          <div *ngIf="filteredClients.length === 0" class="no-results">
            <p>No se encontraron clientes que coincidan con la búsqueda</p>
          </div>
        </div>

        <div class="actions">
          <button 
            (click)="continueWithSelectedClient()" 
            [disabled]="!selectedClient"
            class="btn btn-primary"
          >
            Continuar con {{ selectedClient?.nombre || 'Cliente Seleccionado' }}
          </button>
          
          <button 
            (click)="continueAsClient()" 
            class="btn btn-secondary"
          >
            Continuar como Cliente Directo
          </button>
        </div>

        <div class="footer-actions">
          <button (click)="logout()" class="btn btn-outline">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .select-client-container {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .select-client-card {
      background: white;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 800px;
    }

    .subtitle {
      color: #666;
      margin-bottom: 30px;
      font-size: 16px;
    }

    .search-section {
      margin-bottom: 30px;
    }

    .search-input {
      width: 100%;
      padding: 15px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.3s;
    }

    .search-input:focus {
      outline: none;
      border-color: #667eea;
    }

    .clients-list {
      max-height: 400px;
      overflow-y: auto;
      border: 1px solid #e1e5e9;
      border-radius: 8px;
    }

    .client-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #e1e5e9;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .client-card:hover {
      background-color: #f8f9fa;
    }

    .client-card.selected {
      background-color: #e3f2fd;
      border-left: 4px solid #667eea;
    }

    .client-info h3 {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 18px;
    }

    .client-email {
      margin: 0 0 10px 0;
      color: #666;
      font-size: 14px;
    }

    .client-details {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
    }

    .detail-item {
      font-size: 12px;
      color: #888;
    }

    .client-status {
      display: flex;
      align-items: center;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      background-color: #f5f5f5;
      color: #666;
    }

    .status-badge.active {
      background-color: #d4edda;
      color: #155724;
    }

    .no-results {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .actions {
      margin-top: 30px;
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
    }

    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;
      flex: 1;
      min-width: 200px;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #5a6fd8;
    }

    .btn-primary:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #5a6268;
    }

    .btn-outline {
      background: transparent;
      color: #667eea;
      border: 2px solid #667eea;
    }

    .btn-outline:hover {
      background: #667eea;
      color: white;
    }

    .footer-actions {
      margin-top: 20px;
      text-align: center;
    }

    .loading {
      text-align: center;
      color: #667eea;
      padding: 40px;
    }

    .error-message {
      background: #f8d7da;
      color: #721c24;
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 20px;
      border: 1px solid #f5c6cb;
    }

    @media (max-width: 768px) {
      .actions {
        flex-direction: column;
      }
      
      .btn {
        min-width: auto;
      }
    }
  `]
})
export class SelectClientPageComponent implements OnInit {
  clientes: Cliente[] = [];
  filteredClients: Cliente[] = [];
  selectedClient: Cliente | null = null;
  searchTerm = '';
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.loading = true;
    this.error = '';

    this.authService.getClientes().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
        this.filteredClients = clientes;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar la lista de clientes';
        this.loading = false;
      }
    });
  }

  filterClients(): void {
    if (!this.searchTerm.trim()) {
      this.filteredClients = this.clientes;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredClients = this.clientes.filter(cliente =>
      cliente.nombre.toLowerCase().includes(term) ||
      cliente.email.toLowerCase().includes(term)
    );
  }

  selectClient(cliente: Cliente): void {
    this.selectedClient = cliente;
  }

  continueWithSelectedClient(): void {
    if (!this.selectedClient) return;

    this.authService.selectClient(this.selectedClient);
    this.router.navigate(['/catalog']);
  }

  continueAsClient(): void {
    this.authService.clearSelectedClient();
    this.router.navigate(['/catalog']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
