import { describe, it, expect, beforeEach } from 'vitest';
import '@angular/compiler';
import { Injector, runInInjectionContext } from '@angular/core';
import { of } from 'rxjs';
import { LoginAdapter } from './login.adapter';
import { RestApiService } from '../../api-adapter/rest-api.service';
import { LoginEmailDto, LoginResponse } from '../../../@core/domain/login.entity';
import { HttpResponseEntity } from '../../api-adapter/http-response.entity';

/**
 * Unit Tests for LoginAdapter
 *
 * Verifies that loginWithEmail and logout correctly delegate to RestApiService
 * and map the response.
 */
describe('LoginAdapter', () => {
  let adapter: LoginAdapter;
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
          provide: LoginAdapter,
          useFactory: () => runInInjectionContext(injector, () => new LoginAdapter()),
          deps: [],
        },
      ],
    });

    adapter = injector.get(LoginAdapter);
  });

  it('should be created', () => {
    expect(adapter).toBeTruthy();
  });

  describe('loginWithEmail', () => {
    it('should call postRequest with correct URL and params, and map response.data', () => {
      const params: LoginEmailDto = { email: 'test@example.com', password: 'pass123' };
      const apiResponse: HttpResponseEntity<LoginResponse> = {
        code: 200,
        message: 'Success',
        timestamp: Date.now(),
        data: { id: 'u1', email: 'test@example.com', token: 'tok', roles: ['user'] },
      };

      mockApiService.postRequest.mockReturnValue(of(apiResponse));

      let result: LoginResponse | undefined;
      adapter.loginWithEmail(params).subscribe((res) => {
        result = res;
      });

      expect(mockApiService.postRequest).toHaveBeenCalledWith(
        expect.stringContaining('/auth/email'),
        params
      );
      expect(result).toEqual(apiResponse.data);
    });
  });

  describe('logout', () => {
    it('should call getRequest with correct URL and return void', () => {
      const apiResponse: HttpResponseEntity<void> = {
        code: 200,
        message: 'Success',
        timestamp: Date.now(),
        data: undefined as any,
      };

      mockApiService.getRequest.mockReturnValue(of(apiResponse));

      let completed = false;
      adapter.logout().subscribe({
        next: () => {
          completed = true;
        },
      });

      expect(mockApiService.getRequest).toHaveBeenCalledWith(
        expect.stringContaining('/auth/logout')
      );
      expect(completed).toBe(true);
    });
  });
});
