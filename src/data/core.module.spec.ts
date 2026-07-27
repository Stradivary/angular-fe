import { describe, it, expect } from 'vitest';
import '@angular/compiler';
import { coreProviders } from './core.module';
import { LoginRepository } from '../@core/repository/login.repository';
import { TodoRepository } from '../@core/repository/todo.repository';

describe('coreProviders', () => {
  it('should be defined', () => {
    expect(coreProviders).toBeDefined();
  });

  it('should have correct number of providers', () => {
    expect(coreProviders.length).toBe(2);
  });

  it('should provide LoginRepository', () => {
    const loginProvider = coreProviders.find(
      (p: any) => p.provide === LoginRepository
    );
    expect(loginProvider).toBeTruthy();
  });

  it('should provide TodoRepository', () => {
    const todoProvider = coreProviders.find(
      (p: any) => p.provide === TodoRepository
    );
    expect(todoProvider).toBeTruthy();
  });
});
