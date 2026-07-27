import '@angular/compiler';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Injector, runInInjectionContext } from '@angular/core';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { TokenService } from '../../@core/helpers/token.service';
import { LogoutUseCase } from '../../@core/usecase/auth/logout.usecase';
import { GetTodosUseCase } from '../../@core/usecase/todo/get-todos.usecase';
import { CreateTodoUseCase } from '../../@core/usecase/todo/create-todo.usecase';
import { UpdateTodoUseCase } from '../../@core/usecase/todo/update-todo.usecase';
import { DeleteTodoUseCase } from '../../@core/usecase/todo/delete-todo.usecase';
import { TodoEntity } from '../../@core/domain/todo.entity';

describe('DashboardComponent', () => {
  const mockTodos: TodoEntity[] = [
    { id: '1', title: 'Todo 1', completed: false, createdAt: 1000 },
    { id: '2', title: 'Todo 2', completed: true, createdAt: 2000 },
  ];

  function createComponent(overrides: Record<string, any> = {}) {
    const mockTokenService = {
      getUserEmail: vi.fn().mockReturnValue('user@test.com'),
      removeUserData: vi.fn(),
      ...overrides['tokenService'],
    };
    const mockRouter = { navigate: vi.fn(), ...overrides['router'] };
    const mockLogoutUseCase = {
      execute: vi.fn().mockReturnValue(of(undefined)),
      ...overrides['logoutUseCase'],
    };
    const mockGetTodosUseCase = {
      execute: vi.fn().mockReturnValue(of(mockTodos)),
      ...overrides['getTodosUseCase'],
    };
    const mockCreateTodoUseCase = {
      execute: vi.fn().mockReturnValue(
        of({ id: '3', title: 'New Todo', completed: false, createdAt: 3000 })
      ),
      ...overrides['createTodoUseCase'],
    };
    const mockUpdateTodoUseCase = {
      execute: vi.fn().mockReturnValue(
        of({ id: '1', title: 'Todo 1', completed: true, createdAt: 1000 })
      ),
      ...overrides['updateTodoUseCase'],
    };
    const mockDeleteTodoUseCase = {
      execute: vi.fn().mockReturnValue(of(undefined)),
      ...overrides['deleteTodoUseCase'],
    };

    const injector = Injector.create({
      providers: [
        { provide: TokenService, useValue: mockTokenService },
        { provide: Router, useValue: mockRouter },
        { provide: LogoutUseCase, useValue: mockLogoutUseCase },
        { provide: GetTodosUseCase, useValue: mockGetTodosUseCase },
        { provide: CreateTodoUseCase, useValue: mockCreateTodoUseCase },
        { provide: UpdateTodoUseCase, useValue: mockUpdateTodoUseCase },
        { provide: DeleteTodoUseCase, useValue: mockDeleteTodoUseCase },
      ],
    });

    const component = runInInjectionContext(injector, () => new DashboardComponent());
    return {
      component,
      mockTokenService,
      mockRouter,
      mockLogoutUseCase,
      mockGetTodosUseCase,
      mockCreateTodoUseCase,
      mockUpdateTodoUseCase,
      mockDeleteTodoUseCase,
    };
  }

  it('should instantiate', () => {
    const { component } = createComponent();
    expect(component).toBeTruthy();
  });

  describe('loadTodos', () => {
    it('should call GetTodosUseCase on construction', () => {
      const { mockGetTodosUseCase } = createComponent();
      expect(mockGetTodosUseCase.execute).toHaveBeenCalled();
    });

    it('should set todos signal with loaded data', () => {
      const { component } = createComponent();
      expect(component.todos()).toEqual(mockTodos);
    });

    it('should set isLoading to false after loading completes', () => {
      const { component } = createComponent();
      expect(component.isLoading()).toBe(false);
    });

    it('should set isLoading to false on error', () => {
      const { component } = createComponent({
        getTodosUseCase: { execute: vi.fn().mockReturnValue(throwError(() => new Error('fail'))) },
      });
      expect(component.isLoading()).toBe(false);
      expect(component.todos()).toEqual([]);
    });
  });

  describe('userName', () => {
    it('should compute userName from token service', () => {
      const { component } = createComponent();
      expect(component.userName()).toBe('user@test.com');
    });

    it('should default to "User" when getUserEmail returns null', () => {
      const { component } = createComponent({
        tokenService: { getUserEmail: vi.fn().mockReturnValue(null), removeUserData: vi.fn() },
      });
      expect(component.userName()).toBe('User');
    });
  });

  describe('addTodo', () => {
    it('should call CreateTodoUseCase with title', () => {
      const { component, mockCreateTodoUseCase } = createComponent();
      component.addTodo('New Todo');
      expect(mockCreateTodoUseCase.execute).toHaveBeenCalledWith('New Todo');
    });

    it('should prepend new todo to the list', () => {
      const { component } = createComponent();
      component.addTodo('New Todo');
      const todos = component.todos();
      expect(todos[0]).toEqual({ id: '3', title: 'New Todo', completed: false, createdAt: 3000 });
      expect(todos.length).toBe(3);
    });
  });

  describe('toggleTodo', () => {
    it('should call UpdateTodoUseCase with toggled completed status', () => {
      const { component, mockUpdateTodoUseCase } = createComponent();
      // Todo '1' is completed: false, so toggle should send completed: true
      component.toggleTodo('1');
      expect(mockUpdateTodoUseCase.execute).toHaveBeenCalledWith({
        id: '1',
        data: { completed: true },
      });
    });

    it('should update the todo in the list after toggle', () => {
      const { component } = createComponent();
      component.toggleTodo('1');
      const updated = component.todos().find(t => t.id === '1');
      expect(updated?.completed).toBe(true);
    });

    it('should not call UpdateTodoUseCase if todo id is not found', () => {
      const { component, mockUpdateTodoUseCase } = createComponent();
      component.toggleTodo('non-existent');
      expect(mockUpdateTodoUseCase.execute).not.toHaveBeenCalled();
    });
  });

  describe('confirmDelete', () => {
    it('should set todoToDelete and showDeleteModal', () => {
      const { component } = createComponent();
      component.confirmDelete('2');
      expect(component.todoToDelete()).toBe('2');
      expect(component.showDeleteModal()).toBe(true);
    });
  });

  describe('deleteTodo', () => {
    it('should call DeleteTodoUseCase with the id to delete', () => {
      const { component, mockDeleteTodoUseCase } = createComponent();
      component.confirmDelete('1');
      component.deleteTodo();
      expect(mockDeleteTodoUseCase.execute).toHaveBeenCalledWith('1');
    });

    it('should remove the todo from the list', () => {
      const { component } = createComponent();
      component.confirmDelete('1');
      component.deleteTodo();
      expect(component.todos().find(t => t.id === '1')).toBeUndefined();
      expect(component.todos().length).toBe(1);
    });

    it('should close the modal after deletion', () => {
      const { component } = createComponent();
      component.confirmDelete('1');
      component.deleteTodo();
      expect(component.showDeleteModal()).toBe(false);
      expect(component.todoToDelete()).toBeNull();
    });

    it('should not call DeleteTodoUseCase if todoToDelete is null', () => {
      const { component, mockDeleteTodoUseCase } = createComponent();
      component.deleteTodo();
      expect(mockDeleteTodoUseCase.execute).not.toHaveBeenCalled();
    });
  });

  describe('cancelDelete', () => {
    it('should reset showDeleteModal and todoToDelete', () => {
      const { component } = createComponent();
      component.confirmDelete('1');
      expect(component.showDeleteModal()).toBe(true);
      component.cancelDelete();
      expect(component.showDeleteModal()).toBe(false);
      expect(component.todoToDelete()).toBeNull();
    });
  });

  describe('logout', () => {
    it('should call LogoutUseCase', () => {
      const { component, mockLogoutUseCase } = createComponent();
      component.logout();
      expect(mockLogoutUseCase.execute).toHaveBeenCalled();
    });

    it('should remove user data and navigate to /login on success', () => {
      const { component, mockTokenService, mockRouter } = createComponent();
      component.logout();
      expect(mockTokenService.removeUserData).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should remove user data and navigate to /login on error', () => {
      const mockTokenService = { getUserEmail: vi.fn().mockReturnValue('a@b.com'), removeUserData: vi.fn() };
      const mockRouter = { navigate: vi.fn() };
      const { component } = createComponent({
        tokenService: mockTokenService,
        router: mockRouter,
        logoutUseCase: { execute: vi.fn().mockReturnValue(throwError(() => new Error('logout failed'))) },
      });
      component.logout();
      expect(mockTokenService.removeUserData).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
