import { Component, input, output } from '@angular/core';
import { TodoEntity } from '../../../../@core/domain/todo.entity';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-todo-item-molecule',
  standalone: true,
  imports: [MatCheckboxModule, MatIconModule, MatButtonModule],
  templateUrl: './todo-item-molecule.component.html',
  styleUrl: './todo-item-molecule.component.scss'
})
export class TodoItemMoleculeComponent {
  todo = input.required<TodoEntity>();
  onToggle = output<string>();
  onDelete = output<string>();
}
