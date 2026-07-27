import '@angular/compiler';
import { describe, it, expect } from 'vitest';
import { NotFoundComponent } from './not-found.component';

describe('NotFoundComponent', () => {
  it('should be defined as a class', () => {
    expect(NotFoundComponent).toBeDefined();
  });

  it('should be instantiable', () => {
    const component = new NotFoundComponent();
    expect(component).toBeTruthy();
  });
});
