import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

export interface SidebarMenuItem {
  label: string;
  icon: string;
  route: string;
  exact?: boolean;
}

@Component({
  selector: 'app-sidebar-organism',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './sidebar-organism.component.html',
  styleUrl: './sidebar-organism.component.scss'
})
export class SidebarOrganismComponent {
  brandName = input<string>('Angular FE');
  brandIcon = input<string>('code');
  menuItems = input<SidebarMenuItem[]>([]);
}
