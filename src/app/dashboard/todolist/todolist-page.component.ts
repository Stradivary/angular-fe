import { Component, inject, signal, computed } from '@angular/core';
import { GetTodosUseCase } from '../../../@core/usecase/todo/get-todos.usecase';
import { CreateTodoUseCase } from '../../../@core/usecase/todo/create-todo.usecase';
import { UpdateTodoUseCase } from '../../../@core/usecase/todo/update-todo.usecase';
import { DeleteTodoUseCase } from '../../../@core/usecase/todo/delete-todo.usecase';
import { TodoEntity } from '../../../@core/domain/todo.entity';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TodoFormMoleculeComponent } from '../../common-ui/molecules/todo-form-molecule/todo-form-molecule.component';

@Component({
  selector: 'app-todolist-page',
  standalone: true,
  imports: [
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TodoFormMoleculeComponent,
  ],
  templateUrl: './todolist-page.component.html',
  styleUrl: './todolist-page.component.scss'
})
export class TodolistPageComponent {
  private getTodosUseCase = inject(GetTodosUseCase);
  private createTodoUseCase = inject(CreateTodoUseCase);
  private updateTodoUseCase = inject(UpdateTodoUseCase);
  private deleteTodoUseCase = inject(DeleteTodoUseCase);

  todos = signal<TodoEntity[]>([]);
  isLoading = signal(false);
  showDeleteModal = signal(false);
  todoToDelete = signal<string | null>(null);

  displayedColumns = ['no', 'title', 'status', 'action'];

  constructor() {
    this.loadTodos();
  }

  private loadTodos(): void {
    this.isLoading.set(true);
    this.getTodosUseCase.execute().subscribe({
      next: (data) => {
        this.todos.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  addTodo(title: string): void {
    this.createTodoUseCase.execute(title).subscribe({
      next: (todo) => {
        this.todos.update(list => [todo, ...list]);
      }
    });
  }

  toggleTodo(id: string): void {
    const todo = this.todos().find(t => t.id === id);
    if (todo) {
      this.updateTodoUseCase.execute({ id, data: { completed: !todo.completed } }).subscribe({
        next: (updated) => {
          this.todos.update(list => list.map(t => t.id === id ? updated : t));
        }
      });
    }
  }

  confirmDelete(id: string): void {
    this.todoToDelete.set(id);
    this.showDeleteModal.set(true);
  }

  deleteTodo(): void {
    const id = this.todoToDelete();
    if (id) {
      this.deleteTodoUseCase.execute(id).subscribe({
        next: () => {
          this.todos.update(list => list.filter(t => t.id !== id));
          this.showDeleteModal.set(false);
          this.todoToDelete.set(null);
        }
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteModal.set(false);
    this.todoToDelete.set(null);
  }
}
