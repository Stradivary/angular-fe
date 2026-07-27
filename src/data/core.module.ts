import { Provider } from '@angular/core';
import { LoginRepository } from '../@core/repository/login.repository';
import { TodoRepository } from '../@core/repository/todo.repository';
import { LoginAdapter } from './repository/login/login.adapter';
import { TodoAdapter } from './repository/todo/todo.adapter';

export const coreProviders: Provider[] = [
  { provide: LoginRepository, useClass: LoginAdapter },
  { provide: TodoRepository, useClass: TodoAdapter },
];
