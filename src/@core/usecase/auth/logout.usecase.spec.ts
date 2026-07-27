import { describe, it, expect, beforeEach } from 'vitest';
import '@angular/compiler';
import { Injector, runInInjectionContext } from '@angular/core';
import { of } from 'rxjs';
import { LogoutUseCase } from './logout.usecase';
import { LoginRepository } from '../../repository/login.repository';

/**
 * Unit Tests for LogoutUseCase
 *
 * Verifies that execute() delegates to loginRepository.logout correctly.
 */
describe('LogoutUseCase', () => {
  let useCase: LogoutUseCase;
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
          provide: LogoutUseCase,
          useFactory: () => runInInjectionContext(injector, () => new LogoutUseCase()),
          deps: [],
        },
      ],
    });

    useCase = injector.get(LogoutUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should call loginRepository.logout', () => {
    mockLoginRepository.logout.mockReturnValue(of(void 0));

    let completed = false;
    useCase.execute().subscribe({
      next: () => {
        completed = true;
      },
    });

    expect(mockLoginRepository.logout).toHaveBeenCalled();
    expect(completed).toBe(true);
  });

  it('should propagate the observable from repository', () => {
    const mockObs = of(void 0);
    mockLoginRepository.logout.mockReturnValue(mockObs);

    const result = useCase.execute();

    expect(mockLoginRepository.logout).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined();
  });
});
