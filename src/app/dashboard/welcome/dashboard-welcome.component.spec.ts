import '@angular/compiler';
import { describe, it, expect } from 'vitest';
import { DashboardWelcomeComponent } from './dashboard-welcome.component';

describe('DashboardWelcomeComponent', () => {
  it('should be defined as a class', () => {
    expect(DashboardWelcomeComponent).toBeDefined();
  });

  it('should be instantiable', () => {
    const component = new DashboardWelcomeComponent();
    expect(component).toBeTruthy();
  });
});
