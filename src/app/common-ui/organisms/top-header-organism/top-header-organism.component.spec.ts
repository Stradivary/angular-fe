import '@angular/compiler';
import { describe, it, expect } from 'vitest';
import { Injector, runInInjectionContext } from '@angular/core';
import { TopHeaderOrganismComponent } from './top-header-organism.component';

describe('TopHeaderOrganismComponent', () => {
  function createComponent() {
    const injector = Injector.create({ providers: [] });
    return runInInjectionContext(injector, () => new TopHeaderOrganismComponent());
  }

  it('should be defined as a class', () => {
    expect(TopHeaderOrganismComponent).toBeDefined();
  });

  it('should be instantiable within injection context', () => {
    const component = createComponent();
    expect(component).toBeTruthy();
  });

  it('should have default title', () => {
    const component = createComponent();
    expect(component.title()).toBe('Admin Dashboard');
  });

  it('should have default user initials', () => {
    const component = createComponent();
    expect(component.userInitials()).toBe('U');
  });
});
