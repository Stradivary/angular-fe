import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { LoginEmailDto, LoginResponse } from '../../../@core/domain/login.entity';
import { LoginRepository } from '../../../@core/repository/login.repository';
import { RestApiService } from '../../api-adapter/rest-api.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LoginAdapter extends LoginRepository {
  private apiService = inject(RestApiService);

  loginWithEmail(params: LoginEmailDto): Observable<LoginResponse> {
    return this.apiService
      .postRequest<LoginResponse>(`${environment.apiUrl}/auth/email`, params)
      .pipe(map((res) => res.data));
  }

  logout(): Observable<void> {
    return this.apiService
      .getRequest<void>(`${environment.apiUrl}/auth/logout`)
      .pipe(map(() => void 0));
  }
}
