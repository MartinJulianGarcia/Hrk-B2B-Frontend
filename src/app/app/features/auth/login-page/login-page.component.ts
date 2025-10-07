import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, LoginRequest } from '../../../core/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Iniciar Sesión</h2>
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label for="email">Email:</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              [(ngModel)]="credentials.email" 
              required 
              email
              #email="ngModel"
              class="form-control"
            >
            <div *ngIf="email.invalid && email.touched" class="error">
              Email es requerido y debe ser válido
            </div>
          </div>

          <div class="form-group">
            <label for="password">Contraseña:</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              [(ngModel)]="credentials.password" 
              required
              #password="ngModel"
              class="form-control"
            >
            <div *ngIf="password.invalid && password.touched" class="error">
              Contraseña es requerida
            </div>
          </div>

          <div *ngIf="error" class="error-message">
            {{ error }}
          </div>

          <div *ngIf="loading" class="loading">
            Iniciando sesión...
          </div>

          <button 
            type="submit" 
            [disabled]="loginForm.invalid || loading"
            class="btn btn-primary"
          >
            Iniciar Sesión
          </button>
        </form>

        <div class="demo-section">
          <div class="demo-divider">
            <span>O</span>
          </div>
          
          <button 
            (click)="accesoDemo()" 
            [disabled]="loading"
            class="btn btn-demo"
          >
            🚀 Acceso Demo (Sin Login)
          </button>
          
          <p class="demo-description">
            Accede directamente para probar la aplicación
          </p>
        </div>

        <div class="login-footer">
          <p>¿No tienes cuenta? <a routerLink="/register">Regístrate aquí</a></p>
          <div class="demo-credentials">
            <h4>Credenciales de Demo:</h4>
            <p><strong>Vendedor:</strong> vendedor&#64;empresa.com / 123456</p>
            <p><strong>Cliente:</strong> cliente&#64;empresa.com / 123456</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .login-card {
      background: white;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
      color: #333;
    }

    .form-control {
      width: 100%;
      padding: 12px;
      border: 2px solid #e1e5e9;
      border-radius: 5px;
      font-size: 16px;
      transition: border-color 0.3s;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
    }

    .btn {
      width: 100%;
      padding: 12px;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.3s;
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

    .error {
      color: #e74c3c;
      font-size: 14px;
      margin-top: 5px;
    }

    .error-message {
      background: #f8d7da;
      color: #721c24;
      padding: 10px;
      border-radius: 5px;
      margin-bottom: 20px;
      border: 1px solid #f5c6cb;
    }

    .loading {
      text-align: center;
      color: #667eea;
      margin-bottom: 20px;
    }

    .login-footer {
      margin-top: 30px;
      text-align: center;
    }

    .login-footer a {
      color: #667eea;
      text-decoration: none;
    }

    .login-footer a:hover {
      text-decoration: underline;
    }

    .demo-section {
      margin: 30px 0;
      text-align: center;
    }

    .demo-divider {
      position: relative;
      margin: 20px 0;
      text-align: center;
    }

    .demo-divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: #e1e5e9;
    }

    .demo-divider span {
      background: white;
      padding: 0 15px;
      color: #666;
      font-size: 14px;
    }

    .btn-demo {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 15px 30px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    .btn-demo:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }

    .btn-demo:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .demo-description {
      margin-top: 10px;
      color: #666;
      font-size: 14px;
    }

    .demo-credentials {
      margin-top: 20px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 5px;
      border-left: 4px solid #667eea;
    }

    .demo-credentials h4 {
      margin: 0 0 10px 0;
      color: #333;
      font-size: 14px;
    }

    .demo-credentials p {
      margin: 5px 0;
      font-size: 12px;
      color: #666;
    }
  `]
})
export class LoginPageComponent {
  credentials: LoginRequest = { email: '', password: '' };
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.loading) return;

    this.loading = true;
    this.error = '';

    this.authService.login(this.credentials).subscribe({
      next: (user) => {
        this.loading = false;
        if (user.tipo === 'VENDEDOR') {
          this.router.navigate(['/select-client']);
        } else {
          this.router.navigate(['/catalog']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.message || 'Error al iniciar sesión';
      }
    });
  }

  accesoDemo(): void {
    if (this.loading) return;

    this.loading = true;
    
    // Simular delay para UX
    setTimeout(() => {
      this.authService.accesoDemo();
      this.loading = false;
      this.router.navigate(['/catalog']);
    }, 500);
  }
}
