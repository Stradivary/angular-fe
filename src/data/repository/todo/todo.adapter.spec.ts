import { describe, it, expect, beforeEach } from 'vitest';
import '@angular/compiler';
import { Injector, runInInjectionContext } from '@angular/core';
import { of } from 'rxjs';
import { TodoAdapter } from './todo.adapter';
import { RestApiService } from '../../api-adapter/rest-api.service';
import { TodoEntity } from '../../../@core/domain/todo.entity';
import { HttpResponseEntity } from '../../api-adapter/http-response.entity';

/**
 * Unit Tests for TodoAdapter
 *
 * Verifies that getAll, create, update, delete correctly
 * delegate to RestApiService and map the response.
 */
describe('TodoAdapter', () => {
  let adapter: TodoAdapter;
  let mockApiService: {
    postRequest: ReturnType<typeof vi.fn>;
    getRequest: ReturnType<typeof vi.fn>;
    putRequest: ReturnType<typeof vi.fn>;
    deleteRequest: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockApiService = {
      postRequest: vi.fn(),
      getRequest: vi.fn(),
      putRequest: vi.fn(),
      deleteRequest: vi.fn(),
    };

    const injector = Injector.create({
      providers: [
        { provide: RestApiService, useValue: mockApiService },
        {
          provide: TodoAdapter,
          useFactory: () =>
            runInInjectionContext(injector, () => new TodoAdapter()),
          deps: [],
        },
      ],
    });

    adapter = injector.get(TodoAdapter);
  });

  it('should be created', () => {
    expect(adapter).toBeTruthy();
  });

  describe('getAll', () => {
    it('should call getRequest and map response.data', () => {
      const todos: TodoEntity[] = [
        { id: '1', title: 'Todo 1', completed: false, createdAt: 1000 },
      ];
      const apiResponse: HttpResponseEntity<TodoEntity[]> = {
        code: 200,
        message: 'Success',
        timestamp: Date.now(),
        data: todos,
      };

      mockApiService.getRequest.mockReturnValue(of(apiResponse));

      let result: TodoEntity[] | undefined;
      adapter.getAll().subscribe((res) => {
        result = res;
      });

      expect(mockApiService.getRequest).toHaveBeenCalledWith(
        expect.stringContaining('/todos')
      );
      expect(result).toEqual(todos);
    });
  });

  describe('create', () => {
    it('should call postRequest with title and map response.data', () => {
      const newTodo: TodoEntity = {
        id: '2',
        title: 'New Todo',
        completed: false,
        createdAt: 2000,
      };
      const apiResponse: HttpResponseEntity<TodoEntity> = {
        code: 201,
        message: 'Created',
        timestamp: Date.now(),
        data: newTodo,
      };

      mockApiService.postRequest.mockReturnValue(of(apiResponse));

      let result: TodoEntity | undefined;
      adapter.create('New Todo').subscribe((res) => {
        result = res;
      });

      expect(mockApiService.postRequest).toHaveBeenCalledWith(
        expect.stringContaining('/todos'),
        { title: 'New Todo' }
      );
      expect(result).toEqual(newTodo);
    });
  });

  describe('update', () => {
    it('should call putRequest with id and data, and map response.data', () => {
      const updatedTodo: TodoEntity = {
        id: '1',
        title: 'Updated',
        completed: true,
        createdAt: 1000,
      };
      const apiResponse: HttpResponseEntity<TodoEntity> = {
        code: 200,
        message: 'Success',
        timestamp: Date.now(),
        data: updatedTodo,
      };

      mockApiService.putRequest.mockReturnValue(of(apiResponse));

      let result: TodoEntity | undefined;
      adapter.update('1', { completed: true }).subscribe((res) => {
        result = res;
      });

      expect(mockApiService.putRequest).toHaveBeenCalledWith(
        expect.stringContaining('/todos/1'),
        { completed: true }
      );
      expect(result).toEqual(updatedTodo);
    });
  });

  describe('delete', () => {
    it('should call deleteRequest with id and return void', () => {
      const apiResponse: HttpResponseEntity<void> = {
        code: 200,
        message: 'Success',
        timestamp: Date.now(),
        data: undefined as any,
      };

      mockApiService.deleteRequest.mockReturnValue(of(apiResponse));

      let completed = false;
      adapter.delete('1').subscribe({
        next: () => {
          completed = true;
        },
      });

      expect(mockApiService.deleteRequest).toHaveBeenCalledWith(
        expect.stringContaining('/todos/1')
      );
      expect(completed).toBe(true);
    });
  });
});
