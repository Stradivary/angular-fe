import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../@core/helpers/token.service';
import { LogoutUseCase } from '../../@core/usecase/auth/logout.usecase';
import { GetTodosUseCase } from '../../@core/usecase/todo/get-todos.usecase';
import { CreateTodoUseCase } from '../../@core/usecase/todo/create-todo.usecase';
import { UpdateTodoUseCase } from '../../@core/usecase/todo/update-todo.usecase';
import { DeleteTodoUseCase } from '../../@core/usecase/todo/delete-todo.usecase';
import { TodoEntity } from '../../@core/domain/todo.entity';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TodoItemMoleculeComponent } from '../common-ui/molecules/todo-item-molecule/todo-item-molecule.component';
import { TodoFormMoleculeComponent } from '../common-ui/molecules/todo-form-molecule/todo-form-molecule.component';
import { ModalConfirmOrganismComponent } from '../common-ui/organisms/modal-confirm-organism/modal-confirm-organism.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TodoItemMoleculeComponent,
    TodoFormMoleculeComponent,
    ModalConfirmOrganismComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private tokenService = inject(TokenService);
  private router = inject(Router);
  private logoutUseCase = inject(LogoutUseCase);
  private getTodosUseCase = inject(GetTodosUseCase);
  private createTodoUseCase = inject(CreateTodoUseCase);
  private updateTodoUseCase = inject(UpdateTodoUseCase);
  private deleteTodoUseCase = inject(DeleteTodoUseCase);

  todos = signal<TodoEntity[]>([]);
  isLoading = signal(false);
  showDeleteModal = signal(false);
  todoToDelete = signal<string | null>(null);
  userName = computed(() => this.tokenService.getUserEmail() ?? 'User');

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
