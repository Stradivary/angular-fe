import '@angular/compiler';
import { describe, it, expect, vi } from 'vitest';
import { Injector, runInInjectionContext } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { LoginEmailUseCase } from '../../@core/usecase/auth/login-email.usecase';
import { TokenService } from '../../@core/helpers/token.service';

describe('LoginComponent', () => {
  function createComponent(overrides: any = {}) {
    const mockLoginEmailUseCase = {
      execute: overrides.loginExecute ?? vi.fn().mockReturnValue(
        of({ id: '1', email: 'test@test.com', token: 'abc', roles: ['admin'] })
      ),
    };

    const mockTokenService = {
      saveUserData: vi.fn(),
      removeUserData: vi.fn(),
      getUserEmail: vi.fn().mockReturnValue('test@test.com'),
      getToken: vi.fn(),
      isLoggedIn: vi.fn().mockReturnValue(false),
    };

    const mockRouter = {
      navigate: vi.fn(),
    };

    const mockActivatedRoute = {
      snapshot: { queryParams: overrides.queryParams ?? {} },
    };

    const injector = Injector.create({
      providers: [
        { provide: LoginEmailUseCase, useValue: mockLoginEmailUseCase },
        { provide: TokenService, useValue: mockTokenService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    });

    const component = runInInjectionContext(injector, () => new LoginComponent());
    return { component, mockLoginEmailUseCase, mockTokenService, mockRouter };
  }

  it('should instantiate', () => {
    const { component } = createComponent();
    expect(component).toBeTruthy();
  });

  it('should have an invalid form initially', () => {
    const { component } = createComponent();
    expect(component.loginForm.invalid).toBe(true);
  });

  it('should not call login when form is invalid', () => {
    const { component, mockLoginEmailUseCase } = createComponent();
    component.onSubmit();
    expect(mockLoginEmailUseCase.execute).not.toHaveBeenCalled();
  });

  it('should call login use case when form is valid', () => {
    const { component, mockLoginEmailUseCase } = createComponent();
    component.loginForm.setValue({ email: 'test@test.com', password: 'password123' });
    component.onSubmit();
    expect(mockLoginEmailUseCase.execute).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password123',
    });
  });

  it('should set error message on login failure', () => {
    const loginExecute = vi.fn().mockReturnValue(
      throwError(() => ({ error: { message: 'Invalid credentials' } }))
    );
    const { component } = createComponent({ loginExecute });
    component.loginForm.setValue({ email: 'test@test.com', password: 'password123' });
    component.onSubmit();
    expect(component.errorMessage()).toBe('Invalid credentials');
  });

  it('should navigate to dashboard on successful login', () => {
    const { component, mockRouter, mockTokenService } = createComponent();
    component.loginForm.setValue({ email: 'test@test.com', password: 'password123' });
    component.onSubmit();
    expect(mockTokenService.saveUserData).toHaveBeenCalledWith('1', 'test@test.com', 'admin', 'abc');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });
});
