import { describe, it, expect, beforeEach } from 'vitest';
import '@angular/compiler';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import { mockApiInterceptor } from './mock-api.interceptor';
import { firstValueFrom } from 'rxjs';

/**
 * Unit Tests for MockApiInterceptor
 *
 * Tests login success/failure, logout, and CRUD operations on todos.
 */
describe('MockApiInterceptor', () => {
  const nextHandler = vi.fn();

  beforeEach(() => {
    nextHandler.mockClear();
  });

  describe('Login - POST /auth/email', () => {
    it('should return 200 with token for valid credentials', async () => {
      const req = new HttpRequest('POST', 'http://localhost:3000/api/auth/email', {
        email: 'admin-fe@yopmail.com',
        password: 'admin-fe@Password123!',
      });

      const response = await firstValueFrom(mockApiInterceptor(req, nextHandler));

      expect(response).toBeInstanceOf(HttpResponse);
      const httpResponse = response as HttpResponse<any>;
      expect(httpResponse.status).toBe(200);
      expect(httpResponse.body.data.email).toBe('admin-fe@yopmail.com');
      expect(httpResponse.body.data.token).toBeDefined();
      expect(httpResponse.body.data.roles).toContain('admin');
    });

    it('should return 401 for invalid credentials', async () => {
      const req = new HttpRequest('POST', 'http://localhost:3000/api/auth/email', {
        email: 'wrong@email.com',
        password: 'wrongpassword',
      });

      const response = await firstValueFrom(mockApiInterceptor(req, nextHandler));

      const httpResponse = response as HttpResponse<any>;
      expect(httpResponse.status).toBe(401);
      expect(httpResponse.body.code).toBe(401);
      expect(httpResponse.body.data).toBeNull();
    });
  });

  describe('Logout - GET /auth/logout', () => {
    it('should return 200 with null data', async () => {
      const req = new HttpRequest('GET', 'http://localhost:3000/api/auth/logout');

      const response = await firstValueFrom(mockApiInterceptor(req, nextHandler));

      const httpResponse = response as HttpResponse<any>;
      expect(httpResponse.status).toBe(200);
      expect(httpResponse.body.data).toBeNull();
    });
  });

  describe('GET /todos', () => {
    it('should return a list of todos', async () => {
      const req = new HttpRequest('GET', 'http://localhost:3000/api/todos');

      const response = await firstValueFrom(mockApiInterceptor(req, nextHandler));

      const httpResponse = response as HttpResponse<any>;
      expect(httpResponse.status).toBe(200);
      expect(Array.isArray(httpResponse.body.data)).toBe(true);
    });
  });

  describe('POST /todos', () => {
    it('should create a new todo and return it', async () => {
      const req = new HttpRequest('POST', 'http://localhost:3000/api/todos', {
        title: 'New test todo',
      });

      const response = await firstValueFrom(mockApiInterceptor(req, nextHandler));

      const httpResponse = response as HttpResponse<any>;
      expect(httpResponse.status).toBe(201);
      expect(httpResponse.body.data.title).toBe('New test todo');
      expect(httpResponse.body.data.completed).toBe(false);
      expect(httpResponse.body.data.id).toBeDefined();
    });
  });

  describe('PUT /todos/:id', () => {
    it('should update an existing todo', async () => {
      const req = new HttpRequest('PUT', 'http://localhost:3000/api/todos/1', {
        completed: true,
      });

      const response = await firstValueFrom(mockApiInterceptor(req, nextHandler));

      const httpResponse = response as HttpResponse<any>;
      expect(httpResponse.status).toBe(200);
      expect(httpResponse.body.data.id).toBe('1');
      expect(httpResponse.body.data.completed).toBe(true);
    });
  });

  describe('DELETE /todos/:id', () => {
    it('should delete a todo and return null data', async () => {
      const req = new HttpRequest('DELETE', 'http://localhost:3000/api/todos/2');

      const response = await firstValueFrom(mockApiInterceptor(req, nextHandler));

      const httpResponse = response as HttpResponse<any>;
      expect(httpResponse.status).toBe(200);
      expect(httpResponse.body.data).toBeNull();
    });
  });

  describe('Passthrough', () => {
    it('should call next() for unmatched URLs', () => {
      const req = new HttpRequest('GET', 'http://localhost:3000/api/unknown');
      nextHandler.mockReturnValue({ subscribe: () => {} });

      mockApiInterceptor(req, nextHandler);

      expect(nextHandler).toHaveBeenCalled();
    });
  });
});
