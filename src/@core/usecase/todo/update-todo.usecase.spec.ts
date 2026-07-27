import { describe, it, expect, beforeEach } from 'vitest';
import '@angular/compiler';
import { Injector, runInInjectionContext } from '@angular/core';
import { of } from 'rxjs';
import { UpdateTodoUseCase } from './update-todo.usecase';
import { TodoRepository } from '../../repository/todo.repository';
import { TodoEntity } from '../../domain/todo.entity';

/**
 * Unit Tests for UpdateTodoUseCase
 *
 * Verifies that execute() delegates to todoRepository.update correctly.
 */
describe('UpdateTodoUseCase', () => {
  let useCase: UpdateTodoUseCase;
  let mockTodoRepository: {
    getAll: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockTodoRepository = {
      getAll: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    const injector = Injector.create({
      providers: [
        { provide: TodoRepository, useValue: mockTodoRepository },
        {
          provide: UpdateTodoUseCase,
          useFactory: () => runInInjectionContext(injector, () => new UpdateTodoUseCase()),
          deps: [],
        },
      ],
    });

    useCase = injector.get(UpdateTodoUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should call todoRepository.update with id and data', () => {
    const params = { id: '1', data: { completed: true } as Partial<TodoEntity> };
    const expectedTodo: TodoEntity = {
      id: '1',
      title: 'Updated Todo',
      completed: true,
      createdAt: 1000,
    };

    mockTodoRepository.update.mockReturnValue(of(expectedTodo));

    let result: TodoEntity | undefined;
    useCase.execute(params).subscribe((res) => {
      result = res;
    });

    expect(mockTodoRepository.update).toHaveBeenCalledWith('1', { completed: true });
    expect(result).toEqual(expectedTodo);
  });

  it('should pass partial data correctly to repository', () => {
    const params = { id: '5', data: { title: 'New Title' } as Partial<TodoEntity> };
    const expectedTodo: TodoEntity = { id: '5', title: 'New Title', completed: false, createdAt: 500 };

    mockTodoRepository.update.mockReturnValue(of(expectedTodo));

    useCase.execute(params).subscribe();

    expect(mockTodoRepository.update).toHaveBeenCalledWith('5', { title: 'New Title' });
  });
});
