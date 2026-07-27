import { Component, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-todo-form-molecule',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './todo-form-molecule.component.html',
  styleUrl: './todo-form-molecule.component.scss'
})
export class TodoFormMoleculeComponent {
  title = signal('');
  onSubmit = output<string>();

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.title.set(target.value);
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    this.submitForm();
  }

  submitForm(): void {
    const trimmed = this.title().trim();
    if (trimmed && trimmed.length <= 200) {
      this.onSubmit.emit(trimmed);
      this.title.set('');
    }
  }
}
