import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCase } from '../../base/usecase';
import { LoginRepository } from '../../repository/login.repository';

@Injectable({ providedIn: 'root' })
export class LogoutUseCase implements UseCase<void, void> {
  private readonly loginRepository = inject(LoginRepository);

  execute(): Observable<void> {
    return this.loginRepository.logout();
  }
}
