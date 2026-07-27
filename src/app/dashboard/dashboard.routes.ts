import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './layout/dashboard-layout.component';
import { DashboardWelcomeComponent } from './welcome/dashboard-welcome.component';
import { TodolistPageComponent } from './todolist/todolist-page.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: '', component: DashboardWelcomeComponent },
      { path: 'todolist', component: TodolistPageComponent },
    ]
  }
];
