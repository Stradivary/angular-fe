import { Observable } from 'rxjs';
import { LoginEmailDto, LoginResponse } from '../domain/login.entity';

export abstract class LoginRepository {
  abstract loginWithEmail(params: LoginEmailDto): Observable<LoginResponse>;
  abstract logout(): Observable<void>;
}
