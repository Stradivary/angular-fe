import '@angular/compiler';
import { describe, it, expect } from 'vitest';
import { Injector, runInInjectionContext } from '@angular/core';
import { TodoItemMoleculeComponent } from './todo-item-molecule.component';

describe('TodoItemMoleculeComponent', () => {
  function createComponent() {
    const injector = Injector.create({ providers: [] });
    return runInInjectionContext(injector, () => new TodoItemMoleculeComponent());
  }

  it('should be defined as a class', () => {
    expect(TodoItemMoleculeComponent).toBeDefined();
  });

  it('should be instantiable within injection context', () => {
    const component = createComponent();
    expect(component).toBeTruthy();
  });
});
