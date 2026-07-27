import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCase } from '../../base/usecase';
import { LoginEmailDto, LoginResponse } from '../../domain/login.entity';
import { LoginRepository } from '../../repository/login.repository';

@Injectable({ providedIn: 'root' })
export class LoginEmailUseCase implements UseCase<LoginEmailDto, LoginResponse> {
  private readonly loginRepository = inject(LoginRepository);

  execute(params: LoginEmailDto): Observable<LoginResponse> {
    return this.loginRepository.loginWithEmail(params);
  }
}
