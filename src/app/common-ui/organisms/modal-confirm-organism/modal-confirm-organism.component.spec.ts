import '@angular/compiler';
import { describe, it, expect } from 'vitest';
import { Injector, runInInjectionContext } from '@angular/core';
import { ModalConfirmOrganismComponent } from './modal-confirm-organism.component';

describe('ModalConfirmOrganismComponent', () => {
  function createComponent() {
    const injector = Injector.create({ providers: [] });
    return runInInjectionContext(injector, () => new ModalConfirmOrganismComponent());
  }

  it('should be defined as a class', () => {
    expect(ModalConfirmOrganismComponent).toBeDefined();
  });

  it('should be instantiable within injection context', () => {
    const component = createComponent();
    expect(component).toBeTruthy();
  });

  it('should have default visible as false', () => {
    const component = createComponent();
    expect(component.visible()).toBe(false);
  });
});
