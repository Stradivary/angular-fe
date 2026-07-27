import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-modal-confirm-organism',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './modal-confirm-organism.component.html',
  styleUrl: './modal-confirm-organism.component.scss'
})
export class ModalConfirmOrganismComponent {
  title = input.required<string>();
  message = input.required<string>();
  visible = input<boolean>(false);
  onConfirm = output<void>();
  onCancel = output<void>();
}
