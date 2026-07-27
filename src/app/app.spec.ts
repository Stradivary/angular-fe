import '@angular/compiler';
import { describe, it, expect, vi } from 'vitest';
import { Injector, runInInjectionContext } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { App } from './app';

describe('App', () => {
  function createComponent(initialUrl = '/') {
    const events$ = new Subject<any>();
    const mockRouter = {
      events: events$.asObservable(),
      url: initialUrl,
    };

    const injector = Injector.create({
      providers: [{ provide: Router, useValue: mockRouter }],
    });

    const component = runInInjectionContext(injector, () => new App());
    return { component, events$, mockRouter };
  }

  it('should instantiate', () => {
    const { component } = createComponent();
    expect(component).toBeTruthy();
  });

  it('should compute showHeader as true when initial URL is /', () => {
    const { component } = createComponent('/');
    expect(component.showHeader()).toBe(true);
  });

  it('should compute showHeader as true when initial URL is /login', () => {
    const { component } = createComponent('/login');
    expect(component.showHeader()).toBe(true);
  });

  it('should compute showHeader as false when initial URL starts with /dashboard', () => {
    const { component } = createComponent('/dashboard');
    expect(component.showHeader()).toBe(false);
  });

  it('should compute showHeader as false for nested dashboard routes', () => {
    const { component } = createComponent('/dashboard/todos');
    expect(component.showHeader()).toBe(false);
  });

  it('should update showHeader to false after NavigationEnd to /dashboard', () => {
    const { component, events$ } = createComponent('/');
    expect(component.showHeader()).toBe(true);

    events$.next(new NavigationEnd(1, '/dashboard', '/dashboard'));
    expect(component.showHeader()).toBe(false);
  });

  it('should update showHeader to true after NavigationEnd to /', () => {
    const { component, events$ } = createComponent('/dashboard');
    expect(component.showHeader()).toBe(false);

    events$.next(new NavigationEnd(2, '/', '/'));
    expect(component.showHeader()).toBe(true);
  });

  it('should update showHeader to true after NavigationEnd to /login', () => {
    const { component, events$ } = createComponent('/dashboard');
    expect(component.showHeader()).toBe(false);

    events$.next(new NavigationEnd(3, '/login', '/login'));
    expect(component.showHeader()).toBe(true);
  });

  it('should ignore non-NavigationEnd events', () => {
    const { component, events$ } = createComponent('/');
    expect(component.showHeader()).toBe(true);

    // Emit a non-NavigationEnd event — should not change anything
    events$.next({ id: 1, url: '/dashboard' });
    expect(component.showHeader()).toBe(true);
  });

  it('should use urlAfterRedirects from NavigationEnd', () => {
    const { component, events$ } = createComponent('/');
    // url differs from urlAfterRedirects — component should use urlAfterRedirects
    events$.next(new NavigationEnd(4, '/old', '/dashboard/redirected'));
    expect(component.showHeader()).toBe(false);
  });
});
