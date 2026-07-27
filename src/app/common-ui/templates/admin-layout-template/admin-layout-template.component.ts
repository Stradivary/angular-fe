import { Component, input, output } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarOrganismComponent, SidebarMenuItem } from '../../organisms/sidebar-organism/sidebar-organism.component';
import { TopHeaderOrganismComponent } from '../../organisms/top-header-organism/top-header-organism.component';

@Component({
  selector: 'app-admin-layout-template',
  standalone: true,
  imports: [RouterOutlet, SidebarOrganismComponent, TopHeaderOrganismComponent],
  templateUrl: './admin-layout-template.component.html',
  styleUrl: './admin-layout-template.component.scss'
})
export class AdminLayoutTemplateComponent {
  brandName = input<string>('Angular FE');
  brandIcon = input<string>('code');
  menuItems = input<SidebarMenuItem[]>([]);
  pageTitle = input<string>('Admin Dashboard');
  userInitials = input<string>('U');
  onLogout = output<void>();
  onProfile = output<void>();
}
