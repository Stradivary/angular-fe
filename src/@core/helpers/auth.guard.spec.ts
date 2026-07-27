import '@angular/compiler';
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { Injector, runInInjectionContext } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { TokenService } from './token.service';
import { authGuard } from './auth.guard';

/**
 * Property-Based Test for AuthGuard
 * **Validates: Requirements 4.7, 4.8, 9.5**
 *
 * Property 5: AuthGuard Navigation Control
 * For any route and login state, authGuard returns true iff isLoggedIn() is true,
 * else returns a UrlTree redirecting to /login with the target URL as returnUrl.
 */
describe('AuthGuard', () => {
  describe('Property 5: AuthGuard Navigation Control', () => {
    it('guard returns true iff isLoggedIn() is true, else returns UrlTree to /login with returnUrl', () => {
      fc.assert(
        fc.property(
          fc.boolean(),
          fc.webUrl(),
          (isLoggedIn, targetUrl) => {
            const fakeUrlTree = { toString: () => '/login' } as unknown as UrlTree;

            const mockTokenService = {
              isLoggedIn: () => isLoggedIn,
            };

            const mockRouter = {
              createUrlTree: vi.fn().mockReturnValue(fakeUrlTree),
            };

            const injector = Injector.create({
              providers: [
                { provide: TokenService, useValue: mockTokenService },
                { provide: Router, useValue: mockRouter },
              ],
            });

            const mockRoute = {} as any;
            const mockState = { url: targetUrl } as any;

            const result = runInInjectionContext(injector, () =>
              authGuard(mockRoute, mockState)
            );

            if (isLoggedIn) {
              expect(result).toBe(true);
            } else {
              expect(result).toBe(fakeUrlTree);
              expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/login'], {
                queryParams: { returnUrl: targetUrl },
              });
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
