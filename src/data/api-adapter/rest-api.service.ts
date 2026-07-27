import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpResponseEntity } from './http-response.entity';

@Injectable({ providedIn: 'root' })
export class RestApiService {
  private http = inject(HttpClient);

  postRequest<T>(url: string, body: any): Observable<HttpResponseEntity<T>> {
    return this.http
      .post<HttpResponseEntity<T>>(url, body, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => error)));
  }

  getRequest<T>(url: string, params?: any): Observable<HttpResponseEntity<T>> {
    return this.http
      .get<HttpResponseEntity<T>>(url, { params })
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => error)));
  }

  putRequest<T>(url: string, body: any): Observable<HttpResponseEntity<T>> {
    return this.http
      .put<HttpResponseEntity<T>>(url, body, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => error)));
  }

  deleteRequest<T>(url: string): Observable<HttpResponseEntity<T>> {
    return this.http
      .delete<HttpResponseEntity<T>>(url)
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => error)));
  }
}
