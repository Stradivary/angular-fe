import '@angular/compiler';
import { describe, it, expect } from 'vitest';
import { Injector, runInInjectionContext } from '@angular/core';
import { AdminLayoutTemplateComponent } from './admin-layout-template.component';

describe('AdminLayoutTemplateComponent', () => {
  function createComponent() {
    const injector = Injector.create({ providers: [] });
    return runInInjectionContext(injector, () => new AdminLayoutTemplateComponent());
  }

  it('should be defined as a class', () => {
    expect(AdminLayoutTemplateComponent).toBeDefined();
  });

  it('should be instantiable within injection context', () => {
    const component = createComponent();
    expect(component).toBeTruthy();
  });

  it('should have default brand name', () => {
    const component = createComponent();
    expect(component.brandName()).toBe('Angular FE');
  });

  it('should have default page title', () => {
    const component = createComponent();
    expect(component.pageTitle()).toBe('Admin Dashboard');
  });

  it('should have default user initials', () => {
    const component = createComponent();
    expect(component.userInitials()).toBe('U');
  });
});
