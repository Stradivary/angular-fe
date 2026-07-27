import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { TodoEntity } from '../../../@core/domain/todo.entity';
import { TodoRepository } from '../../../@core/repository/todo.repository';
import { RestApiService } from '../../api-adapter/rest-api.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TodoAdapter extends TodoRepository {
  private apiService = inject(RestApiService);

  getAll(): Observable<TodoEntity[]> {
    return this.apiService
      .getRequest<TodoEntity[]>(`${environment.apiUrl}/todos`)
      .pipe(map((res) => res.data));
  }

  create(title: string): Observable<TodoEntity> {
    return this.apiService
      .postRequest<TodoEntity>(`${environment.apiUrl}/todos`, { title })
      .pipe(map((res) => res.data));
  }

  update(id: string, data: Partial<TodoEntity>): Observable<TodoEntity> {
    return this.apiService
      .putRequest<TodoEntity>(`${environment.apiUrl}/todos/${id}`, data)
      .pipe(map((res) => res.data));
  }

  delete(id: string): Observable<void> {
    return this.apiService
      .deleteRequest<void>(`${environment.apiUrl}/todos/${id}`)
      .pipe(map(() => void 0));
  }
}
