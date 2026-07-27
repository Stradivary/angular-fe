import '@angular/compiler';
import { describe, it, expect, vi } from 'vitest';
import { Injector, runInInjectionContext } from '@angular/core';
import { TodoFormMoleculeComponent } from './todo-form-molecule.component';

describe('TodoFormMoleculeComponent', () => {
  function createComponent() {
    const injector = Injector.create({ providers: [] });
    return runInInjectionContext(injector, () => new TodoFormMoleculeComponent());
  }

  it('should instantiate', () => {
    const component = createComponent();
    expect(component).toBeTruthy();
  });

  it('should update title on input', () => {
    const component = createComponent();
    const event = { target: { value: 'Hello World' } } as unknown as Event;
    component.onInput(event);
    expect(component.title()).toBe('Hello World');
  });

  it('should emit onSubmit and clear title when submitting valid input', () => {
    const component = createComponent();
    const emitSpy = vi.spyOn(component.onSubmit, 'emit');
    component.title.set('New Task');
    component.submitForm();
    expect(emitSpy).toHaveBeenCalledWith('New Task');
    expect(component.title()).toBe('');
  });

  it('should not emit onSubmit when title is empty', () => {
    const component = createComponent();
    const emitSpy = vi.spyOn(component.onSubmit, 'emit');
    component.title.set('   ');
    component.submitForm();
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should not emit onSubmit when title exceeds 200 characters', () => {
    const component = createComponent();
    const emitSpy = vi.spyOn(component.onSubmit, 'emit');
    component.title.set('a'.repeat(201));
    component.submitForm();
    expect(emitSpy).not.toHaveBeenCalled();
  });
});
