import { describe, it, expect, beforeEach } from 'vitest';
import '@angular/compiler';
import { Injector, runInInjectionContext } from '@angular/core';
import { of } from 'rxjs';
import { CreateTodoUseCase } from './create-todo.usecase';
import { TodoRepository } from '../../repository/todo.repository';
import { TodoEntity } from '../../domain/todo.entity';

/**
 * Unit Tests for CreateTodoUseCase
 *
 * Verifies that execute() delegates to todoRepository.create correctly.
 */
describe('CreateTodoUseCase', () => {
  let useCase: CreateTodoUseCase;
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
          provide: CreateTodoUseCase,
          useFactory: () => runInInjectionContext(injector, () => new CreateTodoUseCase()),
          deps: [],
        },
      ],
    });

    useCase = injector.get(CreateTodoUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should call todoRepository.create with the given title', () => {
    const title = 'New Todo';
    const expectedTodo: TodoEntity = {
      id: '1',
      title,
      completed: false,
      createdAt: Date.now(),
    };

    mockTodoRepository.create.mockReturnValue(of(expectedTodo));

    let result: TodoEntity | undefined;
    useCase.execute(title).subscribe((res) => {
      result = res;
    });

    expect(mockTodoRepository.create).toHaveBeenCalledWith(title);
    expect(result).toEqual(expectedTodo);
  });

  it('should propagate the observable from repository', () => {
    const mockTodo: TodoEntity = { id: '2', title: 'Test', completed: false, createdAt: 123 };
    mockTodoRepository.create.mockReturnValue(of(mockTodo));

    const result = useCase.execute('Test');

    expect(mockTodoRepository.create).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined();
  });
});
