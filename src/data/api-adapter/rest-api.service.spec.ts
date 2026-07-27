import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import '@angular/compiler';
import { Injector } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { RestApiService } from './rest-api.service';

/**
 * Property-Based Test for RestApiService
 * **Validates: Requirements 3.3**
 *
 * Property 7: RestApiService Error Propagation
 * For any HttpErrorResponse received during an HTTP call, RestApiService methods
 * propagate the error as an Observable error (throwError) without swallowing or
 * transforming it.
 */
describe('RestApiService', () => {
  describe('Property 7: Error Propagation', () => {
    /**
     * Creates a RestApiService instance with a mock HttpClient that throws
     * the given HttpErrorResponse for the specified HTTP method.
     */
    function createServiceWithError(
      method: 'post' | 'get' | 'put' | 'delete',
      error: HttpErrorResponse
    ): RestApiService {
      const mockHttpClient: Partial<HttpClient> = {
        post: () => throwError(() => error) as any,
        get: () => throwError(() => error) as any,
        put: () => throwError(() => error) as any,
        delete: () => throwError(() => error) as any,
      };

      const injector = Injector.create({
        providers: [
          { provide: HttpClient, useValue: mockHttpClient },
          { provide: RestApiService, useClass: RestApiService, deps: [] },
        ],
      });

      return injector.get(RestApiService);
    }

    it('for any HttpErrorResponse, postRequest propagates error without transformation', () => {
      fc.assert(
        fc.property(
          fc.record({
            status: fc.integer({ min: 400, max: 599 }),
            statusText: fc.string({ minLength: 1, maxLength: 50 }),
            url: fc.webUrl(),
          }),
          (errorProps) => {
            const originalError = new HttpErrorResponse({
              status: errorProps.status,
              statusText: errorProps.statusText,
              url: errorProps.url,
            });

            const service = createServiceWithError('post', originalError);

            let receivedError: any;
            service.postRequest('/test', { data: 'test' }).subscribe({
              error: (err) => {
                receivedError = err;
              },
            });

            expect(receivedError).toBe(originalError);
            expect(receivedError.status).toBe(errorProps.status);
            expect(receivedError.statusText).toBe(errorProps.statusText);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('for any HttpErrorResponse, getRequest propagates error without transformation', () => {
      fc.assert(
        fc.property(
          fc.record({
            status: fc.integer({ min: 400, max: 599 }),
            statusText: fc.string({ minLength: 1, maxLength: 50 }),
            url: fc.webUrl(),
          }),
          (errorProps) => {
            const originalError = new HttpErrorResponse({
              status: errorProps.status,
              statusText: errorProps.statusText,
              url: errorProps.url,
            });

            const service = createServiceWithError('get', originalError);

            let receivedError: any;
            service.getRequest('/test').subscribe({
              error: (err) => {
                receivedError = err;
              },
            });

            expect(receivedError).toBe(originalError);
            expect(receivedError.status).toBe(errorProps.status);
            expect(receivedError.statusText).toBe(errorProps.statusText);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('for any HttpErrorResponse, putRequest propagates error without transformation', () => {
      fc.assert(
        fc.property(
          fc.record({
            status: fc.integer({ min: 400, max: 599 }),
            statusText: fc.string({ minLength: 1, maxLength: 50 }),
            url: fc.webUrl(),
          }),
          (errorProps) => {
            const originalError = new HttpErrorResponse({
              status: errorProps.status,
              statusText: errorProps.statusText,
              url: errorProps.url,
            });

            const service = createServiceWithError('put', originalError);

            let receivedError: any;
            service.putRequest('/test', { data: 'test' }).subscribe({
              error: (err) => {
                receivedError = err;
              },
            });

            expect(receivedError).toBe(originalError);
            expect(receivedError.status).toBe(errorProps.status);
            expect(receivedError.statusText).toBe(errorProps.statusText);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('for any HttpErrorResponse, deleteRequest propagates error without transformation', () => {
      fc.assert(
        fc.property(
          fc.record({
            status: fc.integer({ min: 400, max: 599 }),
            statusText: fc.string({ minLength: 1, maxLength: 50 }),
            url: fc.webUrl(),
          }),
          (errorProps) => {
            const originalError = new HttpErrorResponse({
              status: errorProps.status,
              statusText: errorProps.statusText,
              url: errorProps.url,
            });

            const service = createServiceWithError('delete', originalError);

            let receivedError: any;
            service.deleteRequest('/test').subscribe({
              error: (err) => {
                receivedError = err;
              },
            });

            expect(receivedError).toBe(originalError);
            expect(receivedError.status).toBe(errorProps.status);
            expect(receivedError.statusText).toBe(errorProps.statusText);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
