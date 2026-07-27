import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCase } from '../../base/usecase';
import { TodoEntity } from '../../domain/todo.entity';
import { TodoRepository } from '../../repository/todo.repository';

@Injectable({ providedIn: 'root' })
export class CreateTodoUseCase implements UseCase<string, TodoEntity> {
  private readonly todoRepository = inject(TodoRepository);

  execute(title: string): Observable<TodoEntity> {
    return this.todoRepository.create(title);
  }
}
