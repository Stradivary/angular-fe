import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-top-header-organism',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './top-header-organism.component.html',
  styleUrl: './top-header-organism.component.scss'
})
export class TopHeaderOrganismComponent {
  title = input<string>('Admin Dashboard');
  userInitials = input<string>('U');
  onLogout = output<void>();
  onProfile = output<void>();
}
