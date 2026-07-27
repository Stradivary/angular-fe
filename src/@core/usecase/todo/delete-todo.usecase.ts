import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCase } from '../../base/usecase';
import { TodoRepository } from '../../repository/todo.repository';

@Injectable({ providedIn: 'root' })
export class DeleteTodoUseCase implements UseCase<string, void> {
  private readonly todoRepository = inject(TodoRepository);

  execute(id: string): Observable<void> {
    return this.todoRepository.delete(id);
  }
}
