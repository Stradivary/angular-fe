import { describe, it, expect, beforeEach } from 'vitest';
import '@angular/compiler';
import { Injector, runInInjectionContext } from '@angular/core';
import { of } from 'rxjs';
import { DeleteTodoUseCase } from './delete-todo.usecase';
import { TodoRepository } from '../../repository/todo.repository';

/**
 * Unit Tests for DeleteTodoUseCase
 *
 * Verifies that execute() delegates to todoRepository.delete correctly.
 */
describe('DeleteTodoUseCase', () => {
  let useCase: DeleteTodoUseCase;
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
          provide: DeleteTodoUseCase,
          useFactory: () => runInInjectionContext(injector, () => new DeleteTodoUseCase()),
          deps: [],
        },
      ],
    });

    useCase = injector.get(DeleteTodoUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should call todoRepository.delete with the given id', () => {
    const id = 'todo-123';
    mockTodoRepository.delete.mockReturnValue(of(void 0));

    let completed = false;
    useCase.execute(id).subscribe({
      next: () => {
        completed = true;
      },
    });

    expect(mockTodoRepository.delete).toHaveBeenCalledWith(id);
    expect(completed).toBe(true);
  });

  it('should propagate the observable from repository', () => {
    mockTodoRepository.delete.mockReturnValue(of(void 0));

    const result = useCase.execute('any-id');

    expect(mockTodoRepository.delete).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined();
  });
});
