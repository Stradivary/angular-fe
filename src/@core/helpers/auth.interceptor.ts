import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError, timer } from 'rxjs';
import { TokenService } from './token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  // 1. Add Accept: application/json to all requests
  let modifiedReq = req.clone({
    setHeaders: { 'Accept': 'application/json' }
  });

  // 2. If no Content-Type header present: add cache-control headers
  if (!req.headers.has('Content-Type')) {
    modifiedReq = modifiedReq.clone({
      setHeaders: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  }

  // 3. Handle error responses
  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        tokenService.removeUserData();
        router.navigate(['/login']);
      }

      if (error.status === 403 && error.error?.message?.toLowerCase().includes('invalid csrf')) {
        return timer(1000).pipe(switchMap(() => next(modifiedReq)));
      }

      return throwError(() => error);
    })
  );
};
