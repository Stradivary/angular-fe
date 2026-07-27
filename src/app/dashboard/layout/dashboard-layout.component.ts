import { Component, inject, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TokenService } from '../../../@core/helpers/token.service';
import { LogoutUseCase } from '../../../@core/usecase/auth/logout.usecase';
import { AdminLayoutTemplateComponent } from '../../common-ui/templates/admin-layout-template/admin-layout-template.component';
import { SidebarMenuItem } from '../../common-ui/organisms/sidebar-organism/sidebar-organism.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [AdminLayoutTemplateComponent, MatIconModule, MatButtonModule],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss'
})
export class DashboardLayoutComponent {
  private tokenService = inject(TokenService);
  private router = inject(Router);
  private logoutUseCase = inject(LogoutUseCase);

  showProfileModal = signal(false);

  menuItems: SidebarMenuItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard', exact: true },
    { label: 'Todolist', icon: 'checklist', route: '/dashboard/todolist' },
  ];

  userName = computed(() => this.tokenService.getUserEmail() ?? 'User');

  userInitials = computed(() => {
    const name = this.userName();
    if (!name) return 'U';
    return name.substring(0, 2).toUpperCase();
  });

  openProfile(): void {
    this.showProfileModal.set(true);
  }

  closeProfile(): void {
    this.showProfileModal.set(false);
  }

  logout(): void {
    this.logoutUseCase.execute().subscribe({
      next: () => {
        this.tokenService.removeUserData();
        this.router.navigate(['/login']);
      },
      error: () => {
        this.tokenService.removeUserData();
        this.router.navigate(['/login']);
      }
    });
  }
}
