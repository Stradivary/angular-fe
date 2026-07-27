import '@angular/compiler';
import { describe, it, expect } from 'vitest';
import { Injector, runInInjectionContext } from '@angular/core';
import { SidebarOrganismComponent } from './sidebar-organism.component';

describe('SidebarOrganismComponent', () => {
  function createComponent() {
    const injector = Injector.create({ providers: [] });
    return runInInjectionContext(injector, () => new SidebarOrganismComponent());
  }

  it('should be defined as a class', () => {
    expect(SidebarOrganismComponent).toBeDefined();
  });

  it('should be instantiable within injection context', () => {
    const component = createComponent();
    expect(component).toBeTruthy();
  });

  it('should have default brand name', () => {
    const component = createComponent();
    expect(component.brandName()).toBe('Angular FE');
  });

  it('should have default brand icon', () => {
    const component = createComponent();
    expect(component.brandIcon()).toBe('code');
  });

  it('should have empty menu items by default', () => {
    const component = createComponent();
    expect(component.menuItems()).toEqual([]);
  });
});
