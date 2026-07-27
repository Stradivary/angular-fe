import { Observable } from 'rxjs';
import { TodoEntity } from '../domain/todo.entity';

export abstract class TodoRepository {
  abstract getAll(): Observable<TodoEntity[]>;
  abstract create(title: string): Observable<TodoEntity>;
  abstract update(id: string, data: Partial<TodoEntity>): Observable<TodoEntity>;
  abstract delete(id: string): Observable<void>;
}
