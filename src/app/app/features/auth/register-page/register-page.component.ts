import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, RegisterRequest } from '../../../core/auth.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent {
  userData: RegisterRequest = {
    nombre: '',
    email: '',
    password: '',
    tipo: 'CLIENTE',
    telefono: '',
    direccion: '',
    cuit: undefined
  };
  cuitFormatted = '';
  password2 = '';
  loading = false;
  error = '';
  passwordsMatch = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onPasswordChange(): void {
    this.passwordsMatch = this.userData.password === this.password2 && 
                         this.userData.password.length >= 6 && 
                         this.password2.length >= 6;
  }

  onCuitChange(event: any): void {
    let value = event.target.value;
    
    // Remover todos los caracteres que no sean números
    value = value.replace(/\D/g, '');
    
    // Limitar a 11 dígitos
    if (value.length > 11) {
      value = value.substring(0, 11);
    }
    
    // Formatear con guiones: XX-XXXXXXXX-X
    if (value.length > 0) {
      let formatted = '';
      
      // Primeros 2 dígitos
      if (value.length >= 1) {
        formatted += value.substring(0, Math.min(2, value.length));
      }
      
      // Agregar primer guión después de 2 dígitos
      if (value.length > 2) {
        formatted += '-';
        // Agregar los siguientes 8 dígitos
        formatted += value.substring(2, Math.min(10, value.length));
      }
      
      // Agregar segundo guión después de 10 dígitos
      if (value.length > 10) {
        formatted += '-';
        // Agregar el último dígito
        formatted += value.substring(10, Math.min(11, value.length));
      }
      
      this.cuitFormatted = formatted;
    } else {
      this.cuitFormatted = '';
    }
    
    // Convertir a número para enviar al backend (solo números)
    const cuitNumbers = value.replace(/\D/g, '');
    this.userData.cuit = cuitNumbers ? parseInt(cuitNumbers) : undefined;
  }

  onSubmit(): void {
    if (this.loading) return;

    // Verificar que las contraseñas coincidan
    if (this.userData.password !== this.password2) {
      this.error = 'Las contraseñas no coinciden';
      this.showErrorMessage('Las contraseñas no coinciden. Por favor, verifica que ambas contraseñas sean iguales.');
      return;
    }

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
            this.showErrorMessage('Usuario creado pero error al iniciar sesión');
            this.clearForm();
            console.log('Auto-login error:', err);
          }
        });
      },
      error: (err) => {
        this.loading = false;
        this.error = err.message || 'Error al registrar usuario';
        this.showErrorMessage('Error al registrar usuario. Por favor, verifica los datos ingresados.');
        this.clearForm();
        console.log('Register error:', err);
      }
    });
  }

  showErrorMessage(message: string): void {
    alert(message);
  }

  clearForm(): void {
    this.userData = {
      nombre: '',
      email: '',
      password: '',
      tipo: 'CLIENTE',
      telefono: '',
      direccion: '',
      cuit: undefined
    };
    this.cuitFormatted = '';
    this.password2 = '';
    this.passwordsMatch = false;
  }
}
