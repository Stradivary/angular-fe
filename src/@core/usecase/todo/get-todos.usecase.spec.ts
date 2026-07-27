import { describe, it, expect, beforeEach } from 'vitest';
import '@angular/compiler';
import { Injector, runInInjectionContext } from '@angular/core';
import { of } from 'rxjs';
import { GetTodosUseCase } from './get-todos.usecase';
import { TodoRepository } from '../../repository/todo.repository';
import { TodoEntity } from '../../domain/todo.entity';

/**
 * Unit Tests for GetTodosUseCase
 *
 * Verifies that execute() delegates to todoRepository.getAll correctly.
 */
describe('GetTodosUseCase', () => {
  let useCase: GetTodosUseCase;
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
          provide: GetTodosUseCase,
          useFactory: () => runInInjectionContext(injector, () => new GetTodosUseCase()),
          deps: [],
        },
      ],
    });

    useCase = injector.get(GetTodosUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should call todoRepository.getAll and return todos', () => {
    const expectedTodos: TodoEntity[] = [
      { id: '1', title: 'Todo 1', completed: false, createdAt: 1000 },
      { id: '2', title: 'Todo 2', completed: true, createdAt: 2000 },
    ];

    mockTodoRepository.getAll.mockReturnValue(of(expectedTodos));

    let result: TodoEntity[] | undefined;
    useCase.execute().subscribe((res) => {
      result = res;
    });

    expect(mockTodoRepository.getAll).toHaveBeenCalled();
    expect(result).toEqual(expectedTodos);
  });

  it('should return empty array when repository returns empty', () => {
    mockTodoRepository.getAll.mockReturnValue(of([]));

    let result: TodoEntity[] | undefined;
    useCase.execute().subscribe((res) => {
      result = res;
    });

    expect(result).toEqual([]);
  });
});
