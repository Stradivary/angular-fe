import '@angular/compiler';
import { describe, it, expect, vi } from 'vitest';
import { Injector, runInInjectionContext } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { DashboardLayoutComponent } from './dashboard-layout.component';
import { TokenService } from '../../../@core/helpers/token.service';
import { LogoutUseCase } from '../../../@core/usecase/auth/logout.usecase';

describe('DashboardLayoutComponent', () => {
  function createComponent() {
    const mockTokenService = {
      getUserEmail: vi.fn().mockReturnValue('admin@test.com'),
      removeUserData: vi.fn(),
    };
    const mockRouter = { navigate: vi.fn() };
    const mockLogoutUseCase = { execute: vi.fn().mockReturnValue(of(undefined)) };

    const injector = Injector.create({
      providers: [
        { provide: TokenService, useValue: mockTokenService },
        { provide: Router, useValue: mockRouter },
        { provide: LogoutUseCase, useValue: mockLogoutUseCase },
      ],
    });

    const component = runInInjectionContext(injector, () => new DashboardLayoutComponent());
    return { component, mockTokenService, mockRouter, mockLogoutUseCase };
  }

  it('should instantiate', () => {
    const { component } = createComponent();
    expect(component).toBeTruthy();
  });

  it('should compute userName from token service', () => {
    const { component } = createComponent();
    expect(component.userName()).toBe('admin@test.com');
  });

  it('should compute userInitials from userName', () => {
    const { component } = createComponent();
    expect(component.userInitials()).toBe('AD');
  });

  it('should toggle profile modal', () => {
    const { component } = createComponent();
    expect(component.showProfileModal()).toBe(false);
    component.openProfile();
    expect(component.showProfileModal()).toBe(true);
    component.closeProfile();
    expect(component.showProfileModal()).toBe(false);
  });

  it('should have menu items defined', () => {
    const { component } = createComponent();
    expect(component.menuItems.length).toBe(2);
  });

  it('should navigate to login on logout', () => {
    const { component, mockRouter, mockTokenService } = createComponent();
    component.logout();
    expect(mockTokenService.removeUserData).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});
