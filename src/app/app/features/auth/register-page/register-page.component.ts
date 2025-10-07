import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, RegisterRequest } from '../../../core/auth.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="register-container">
      <div class="register-card">
        <h2>Registrarse</h2>
        <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
          <div class="form-group">
            <label for="nombre">Nombre Completo:</label>
            <input 
              type="text" 
              id="nombre" 
              name="nombre" 
              [(ngModel)]="userData.nombre" 
              required 
              minlength="2"
              #nombre="ngModel"
              class="form-control"
            >
            <div *ngIf="nombre.invalid && nombre.touched" class="error">
              Nombre es requerido (mínimo 2 caracteres)
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email:</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              [(ngModel)]="userData.email" 
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
              [(ngModel)]="userData.password" 
              required 
              minlength="6"
              #password="ngModel"
              class="form-control"
            >
            <div *ngIf="password.invalid && password.touched" class="error">
              Contraseña es requerida (mínimo 6 caracteres)
            </div>
          </div>

          <div class="form-group">
            <label for="tipo">Tipo de Usuario:</label>
            <select 
              id="tipo" 
              name="tipo" 
              [(ngModel)]="userData.tipo" 
              required
              #tipo="ngModel"
              class="form-control"
            >
              <option value="">Seleccionar tipo</option>
              <option value="VENDEDOR">Vendedor</option>
              <option value="CLIENTE">Cliente</option>
            </select>
            <div *ngIf="tipo.invalid && tipo.touched" class="error">
              Tipo de usuario es requerido
            </div>
          </div>

          <!-- Campos adicionales para clientes -->
          <div *ngIf="userData.tipo === 'CLIENTE'" class="additional-fields">
            <div class="form-group">
              <label for="telefono">Teléfono (opcional):</label>
              <input 
                type="tel" 
                id="telefono" 
                name="telefono" 
                [(ngModel)]="userData.telefono" 
                class="form-control"
              >
            </div>

            <div class="form-group">
              <label for="direccion">Dirección (opcional):</label>
              <textarea 
                id="direccion" 
                name="direccion" 
                [(ngModel)]="userData.direccion" 
                class="form-control"
                rows="3"
              ></textarea>
            </div>
          </div>

          <div *ngIf="error" class="error-message">
            {{ error }}
          </div>

          <div *ngIf="loading" class="loading">
            Registrando usuario...
          </div>

          <button 
            type="submit" 
            [disabled]="registerForm.invalid || loading"
            class="btn btn-primary"
          >
            Registrarse
          </button>
        </form>

        <div class="register-footer">
          <p>¿Ya tienes cuenta? <a routerLink="/login">Inicia sesión aquí</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .register-card {
      background: white;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 500px;
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
      box-sizing: border-box;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
    }

    .additional-fields {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 5px;
      margin: 20px 0;
      border-left: 4px solid #667eea;
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

    .register-footer {
      margin-top: 30px;
      text-align: center;
    }

    .register-footer a {
      color: #667eea;
      text-decoration: none;
    }

    .register-footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterPageComponent {
  userData: RegisterRequest = {
    nombre: '',
    email: '',
    password: '',
    tipo: 'CLIENTE',
    telefono: '',
    direccion: ''
  };
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

    this.authService.register(this.userData).subscribe({
      next: (user) => {
        this.loading = false;
        // Auto-login después del registro
        this.authService.login({
          email: this.userData.email,
          password: this.userData.password
        }).subscribe({
          next: (loggedUser) => {
            if (loggedUser.tipo === 'VENDEDOR') {
              this.router.navigate(['/select-client']);
            } else {
              this.router.navigate(['/catalog']);
            }
          },
          error: (err) => {
            this.error = 'Usuario creado pero error al iniciar sesión';
          }
        });
      },
      error: (err) => {
        this.loading = false;
        this.error = err.message || 'Error al registrar usuario';
      }
    });
  }
}
