import { Component, signal, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginEmailUseCase } from '../../@core/usecase/auth/login-email.usecase';
import { TokenService } from '../../@core/helpers/token.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private loginEmailUseCase = inject(LoginEmailUseCase);
  private tokenService = inject(TokenService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  isLoading = signal(false);
  errorMessage = signal('');
  hidePassword = signal(true);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  onSubmit(): void {
    if (this.loginForm.invalid || this.isLoading()) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    const { email, password } = this.loginForm.value;
    this.loginEmailUseCase.execute({ email: email!, password: password! }).subscribe({
      next: (response) => {
        this.tokenService.saveUserData(response.id, response.email, response.roles[0] || '', response.token);
        const returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/dashboard';
        this.router.navigate([returnUrl]);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Login gagal. Silakan coba lagi.');
        this.isLoading.set(false);
      }
    });
  }
}
