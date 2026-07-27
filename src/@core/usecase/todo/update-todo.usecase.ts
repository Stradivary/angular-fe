import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCase } from '../../base/usecase';
import { TodoEntity } from '../../domain/todo.entity';
import { TodoRepository } from '../../repository/todo.repository';

@Injectable({ providedIn: 'root' })
export class UpdateTodoUseCase implements UseCase<{ id: string; data: Partial<TodoEntity> }, TodoEntity> {
  private readonly todoRepository = inject(TodoRepository);

  execute(params: { id: string; data: Partial<TodoEntity> }): Observable<TodoEntity> {
    return this.todoRepository.update(params.id, params.data);
  }
}
