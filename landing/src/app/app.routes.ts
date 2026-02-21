import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./landing/landing.component').then((m) => m.LandingComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'registracija',
    loadComponent: () =>
      import('./registracija/registracija.component').then((m) => m.RegistracijaComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./dashboard/dashboard-home/dashboard-home.component').then(
            (m) => m.DashboardHomeComponent,
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
