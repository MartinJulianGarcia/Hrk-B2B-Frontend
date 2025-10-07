import { Routes } from '@angular/router';
import { ProductListComponent } from './app/features/catalog/product-list/product-list.component';
import { CartPageComponent } from './app/features/cart/cart-page/cart-page.component';
import { LoginPageComponent } from './app/features/auth/login-page/login-page.component';
import { RegisterPageComponent } from './app/features/auth/register-page/register-page.component';
import { SelectClientPageComponent } from './app/features/auth/select-client-page/select-client-page.component';
import { HomePageComponent } from './app/features/home/home-page/home-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'select-client', component: SelectClientPageComponent },
  { path: 'catalog', component: HomePageComponent },
  { path: 'cart', component: CartPageComponent }
];
