import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, Usuario, Cliente } from './app/core/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div *ngIf="isLoggedIn" class="app-header">
      <div class="header-content">
        <div class="user-info">
          <span class="user-name">{{ currentUser?.nombre }}</span>
          <span class="user-type">{{ currentUser?.tipo }}</span>
          <span *ngIf="selectedClient" class="selected-client">
            Cliente: {{ selectedClient.nombre }}
          </span>
        </div>
        
        <nav class="main-nav">
          <a routerLink="/catalog" routerLinkActive="active">Catálogo</a>
          <a routerLink="/cart" routerLinkActive="active">Carrito</a>
          <button (click)="logout()" class="logout-btn">Cerrar Sesión</button>
        </nav>
      </div>
    </div>
    
    <router-outlet></router-outlet>
  `,
  styles: [`
    .app-header {
      background: #667eea;
      color: white;
      padding: 15px 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .user-name {
      font-weight: 600;
      font-size: 16px;
    }

    .user-type {
      background: rgba(255,255,255,0.2);
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      text-transform: uppercase;
    }

    .selected-client {
      background: rgba(255,255,255,0.1);
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
    }

    .main-nav {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .main-nav a {
      color: white;
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 4px;
      transition: background-color 0.3s;
    }

    .main-nav a:hover,
    .main-nav a.active {
      background: rgba(255,255,255,0.2);
    }

    .logout-btn {
      background: rgba(255,255,255,0.1);
      color: white;
      border: 1px solid rgba(255,255,255,0.3);
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
    }

    .logout-btn:hover {
      background: rgba(255,255,255,0.2);
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 15px;
      }
      
      .user-info {
        flex-direction: column;
        align-items: center;
        gap: 8px;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  currentUser: Usuario | null = null;
  selectedClient: Cliente | null = null;
  isLoggedIn = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user: Usuario | null) => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
    });

    this.authService.selectedClient$.subscribe((client: Cliente | null) => {
      this.selectedClient = client;
    });
  }

  logout(): void {
    this.authService.logout();
  }
}