import { describe, it, expect, beforeEach } from 'vitest';
import '@angular/compiler';
import { Injector, runInInjectionContext } from '@angular/core';
import { of } from 'rxjs';
import { LoginEmailUseCase } from './login-email.usecase';
import { LoginRepository } from '../../repository/login.repository';
import { LoginEmailDto, LoginResponse } from '../../domain/login.entity';

/**
 * Unit Tests for LoginEmailUseCase
 *
 * Verifies that execute() delegates to loginRepository.loginWithEmail correctly.
 */
describe('LoginEmailUseCase', () => {
  let useCase: LoginEmailUseCase;
  let mockLoginRepository: { loginWithEmail: ReturnType<typeof vi.fn>; logout: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockLoginRepository = {
      loginWithEmail: vi.fn(),
      logout: vi.fn(),
    };

    const injector = Injector.create({
      providers: [
        { provide: LoginRepository, useValue: mockLoginRepository },
        {
          provide: LoginEmailUseCase,
          useFactory: () => runInInjectionContext(injector, () => new LoginEmailUseCase()),
          deps: [],
        },
      ],
    });

    useCase = injector.get(LoginEmailUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should call loginRepository.loginWithEmail with provided params', () => {
    const params: LoginEmailDto = { email: 'test@example.com', password: 'password123' };
    const expectedResponse: LoginResponse = {
      id: 'user-1',
      email: 'test@example.com',
      token: 'mock-token',
      roles: ['user'],
    };

    mockLoginRepository.loginWithEmail.mockReturnValue(of(expectedResponse));

    let result: LoginResponse | undefined;
    useCase.execute(params).subscribe((res) => {
      result = res;
    });

    expect(mockLoginRepository.loginWithEmail).toHaveBeenCalledWith(params);
    expect(result).toEqual(expectedResponse);
  });

  it('should propagate the observable from repository', () => {
    const params: LoginEmailDto = { email: 'a@b.com', password: 'pass' };
    const mockObs = of({ id: '1', email: 'a@b.com', token: 'tk', roles: ['admin'] } as LoginResponse);
    mockLoginRepository.loginWithEmail.mockReturnValue(mockObs);

    const result = useCase.execute(params);

    expect(mockLoginRepository.loginWithEmail).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined();
  });
});
