import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  tipo: 'VENDEDOR' | 'CLIENTE';
  activo: boolean;
}

export interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
  activo: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
  tipo: 'VENDEDOR' | 'CLIENTE';
  telefono?: string;
  direccion?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  private selectedClientSubject = new BehaviorSubject<Cliente | null>(null);
  
  public currentUser$ = this.currentUserSubject.asObservable();
  public selectedClient$ = this.selectedClientSubject.asObservable();

  constructor() {
    // Verificar si hay usuario logueado en localStorage (solo en el cliente)
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        this.currentUserSubject.next(JSON.parse(savedUser));
      }
    }
  }

  // Mock data para desarrollo
  private mockUsers: Usuario[] = [
    { id: 1, nombre: 'Juan Vendedor', email: 'vendedor@empresa.com', tipo: 'VENDEDOR', activo: true },
    { id: 2, nombre: 'María Vendedora', email: 'maria@empresa.com', tipo: 'VENDEDOR', activo: true }
  ];

  private mockClients: Cliente[] = [
    { id: 1, nombre: 'Distribuidora Norte', email: 'norte@dist.com', telefono: '011-1234-5678', direccion: 'Av. Corrientes 1234', activo: true },
    { id: 2, nombre: 'Mayorista Sur', email: 'sur@mayorista.com', telefono: '011-8765-4321', direccion: 'Av. Santa Fe 5678', activo: true },
    { id: 3, nombre: 'Comercial Este', email: 'este@comercial.com', telefono: '011-5555-1234', direccion: 'Av. Rivadavia 9999', activo: true }
  ];

  login(credentials: LoginRequest): Observable<Usuario> {
    // Mock login - en producción sería una llamada HTTP real
    const user = this.mockUsers.find(u => u.email === credentials.email);
    
    if (user && credentials.password === '123456') { // Password mock
      this.currentUserSubject.next(user);
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
      return of(user);
    }
    
    throw new Error('Credenciales inválidas');
  }

  register(userData: RegisterRequest): Observable<Usuario> {
    // Mock register - en producción sería una llamada HTTP real
    const newUser: Usuario = {
      id: this.mockUsers.length + 1,
      nombre: userData.nombre,
      email: userData.email,
      tipo: userData.tipo,
      activo: true
    };
    
    this.mockUsers.push(newUser);
    return of(newUser);
  }

  logout(): void {
    this.currentUserSubject.next(null);
    this.selectedClientSubject.next(null);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('selectedClient');
    }
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  isVendedor(): boolean {
    return this.currentUserSubject.value?.tipo === 'VENDEDOR';
  }

  // Métodos para selección de cliente (solo para vendedores)
  getClientes(): Observable<Cliente[]> {
    return of(this.mockClients);
  }

  selectClient(cliente: Cliente): void {
    this.selectedClientSubject.next(cliente);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('selectedClient', JSON.stringify(cliente));
    }
  }

  getSelectedClient(): Cliente | null {
    return this.selectedClientSubject.value;
  }

  clearSelectedClient(): void {
    this.selectedClientSubject.next(null);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('selectedClient');
    }
  }

  // Método para acceso demo sin autenticación
  accesoDemo(): void {
    const demoUser: Usuario = {
      id: 999,
      nombre: 'Usuario Demo',
      email: 'demo@empresa.com',
      tipo: 'CLIENTE',
      activo: true
    };

    this.currentUserSubject.next(demoUser);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('currentUser', JSON.stringify(demoUser));
    }
  }
}
