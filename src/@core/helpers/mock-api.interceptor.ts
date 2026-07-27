import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, delay } from 'rxjs';
import { HttpResponseEntity } from '../../data/api-adapter/http-response.entity';
import { LoginResponse } from '../domain/login.entity';
import { TodoEntity } from '../domain/todo.entity';

/**
 * Mock API interceptor untuk development tanpa backend.
 * Mengembalikan dummy data untuk endpoint login dan todo.
 *
 * Dummy user:
 *   email: admin-fe@yopmail.com
 *   password: admin-fe@Password123!
 */

// In-memory todo storage
let mockTodos: TodoEntity[] = [
  { id: '1', title: 'Belajar Angular 22', completed: false, createdAt: Date.now() - 86400000 },
  { id: '2', title: 'Setup project baru', completed: true, createdAt: Date.now() - 172800000 },
  { id: '3', title: 'Implementasi login form', completed: true, createdAt: Date.now() - 259200000 },
];

let nextId = 4;

function wrapResponse<T>(data: T): HttpResponseEntity<T> {
  return {
    code: 200,
    message: 'Success',
    timestamp: Date.now(),
    data
  };
}

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  const url = req.url;

  // --- LOGIN: POST /auth/email ---
  if (url.endsWith('/auth/email') && req.method === 'POST') {
    const body = req.body as { email?: string; password?: string };

    if (body?.email === 'admin-fe@yopmail.com' && body?.password === 'admin-fe@Password123!') {
      const response: LoginResponse = {
        id: 'user-001',
        email: 'admin-fe@yopmail.com',
        token: 'mock-jwt-token-' + Date.now(),
        roles: ['admin']
      };
      return of(new HttpResponse({
        status: 200,
        body: wrapResponse(response)
      })).pipe(delay(500));
    }

    // Login gagal
    return of(new HttpResponse({
      status: 401,
      body: { code: 401, message: 'Email atau password salah', timestamp: Date.now(), data: null }
    })).pipe(delay(500));
  }

  // --- LOGOUT: GET /auth/logout ---
  if (url.endsWith('/auth/logout') && req.method === 'GET') {
    return of(new HttpResponse({
      status: 200,
      body: wrapResponse(null)
    })).pipe(delay(300));
  }

  // --- GET TODOS: GET /todos ---
  if (url.endsWith('/todos') && req.method === 'GET') {
    return of(new HttpResponse({
      status: 200,
      body: wrapResponse([...mockTodos])
    })).pipe(delay(400));
  }

  // --- CREATE TODO: POST /todos ---
  if (url.endsWith('/todos') && req.method === 'POST') {
    const body = req.body as { title?: string };
    const newTodo: TodoEntity = {
      id: String(nextId++),
      title: body?.title || 'Untitled',
      completed: false,
      createdAt: Date.now()
    };
    mockTodos.unshift(newTodo);
    return of(new HttpResponse({
      status: 201,
      body: wrapResponse(newTodo)
    })).pipe(delay(300));
  }

  // --- UPDATE TODO: PUT /todos/:id ---
  const updateMatch = url.match(/\/todos\/([^/]+)$/);
  if (updateMatch && req.method === 'PUT') {
    const id = updateMatch[1];
    const body = req.body as Partial<TodoEntity>;
    const index = mockTodos.findIndex(t => t.id === id);
    if (index !== -1) {
      mockTodos[index] = { ...mockTodos[index], ...body };
      return of(new HttpResponse({
        status: 200,
        body: wrapResponse(mockTodos[index])
      })).pipe(delay(300));
    }
  }

  // --- DELETE TODO: DELETE /todos/:id ---
  const deleteMatch = url.match(/\/todos\/([^/]+)$/);
  if (deleteMatch && req.method === 'DELETE') {
    const id = deleteMatch[1];
    mockTodos = mockTodos.filter(t => t.id !== id);
    return of(new HttpResponse({
      status: 200,
      body: wrapResponse(null)
    })).pipe(delay(300));
  }

  // Pass through jika tidak match endpoint apapun
  return next(req);
};
