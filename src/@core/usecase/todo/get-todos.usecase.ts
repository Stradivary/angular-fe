import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCase } from '../../base/usecase';
import { TodoEntity } from '../../domain/todo.entity';
import { TodoRepository } from '../../repository/todo.repository';

@Injectable({ providedIn: 'root' })
export class GetTodosUseCase implements UseCase<void, TodoEntity[]> {
  private readonly todoRepository = inject(TodoRepository);

  execute(): Observable<TodoEntity[]> {
    return this.todoRepository.getAll();
  }
}
