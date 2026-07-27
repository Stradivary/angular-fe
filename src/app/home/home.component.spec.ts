import '@angular/compiler';
import { describe, it, expect } from 'vitest';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  it('should be defined as a class', () => {
    expect(HomeComponent).toBeDefined();
  });

  it('should be instantiable', () => {
    const component = new HomeComponent();
    expect(component).toBeTruthy();
  });
});
