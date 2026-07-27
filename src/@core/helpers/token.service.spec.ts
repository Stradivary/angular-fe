import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { Injector, runInInjectionContext } from '@angular/core';
import { EncryptionService } from './encryption.service';
import { TokenService } from './token.service';

/**
 * Property-Based Tests for TokenService
 * **Validates: Requirements 4.1, 4.2, 4.4, 4.5, 4.6**
 *
 * Property 2: TokenService Storage Round-Trip
 * Property 3: removeUserData Completeness
 * Property 4: isLoggedIn Derives from Token Presence
 *
 * Strategy: We use Angular's Injector.create() to provide a minimal DI context
 * so that inject() works correctly inside TokenService. We mock localStorage
 * with an in-memory Map.
 */

function createLocalStorageMock(): Storage {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => { store.set(key, value); },
    removeItem: (key: string) => { store.delete(key); },
    clear: () => { store.clear(); },
    get length() { return store.size; },
    key: (index: number) => [...store.keys()][index] ?? null,
  } as Storage;
}

describe('TokenService', () => {
  let mockStorage: Storage;
  let injector: Injector;

  beforeEach(() => {
    mockStorage = createLocalStorageMock();
    Object.defineProperty(globalThis, 'localStorage', {
      value: mockStorage,
      writable: true,
      configurable: true,
    });

    injector = Injector.create({
      providers: [
        { provide: EncryptionService, useFactory: () => new EncryptionService() },
        { provide: TokenService, useFactory: () => runInInjectionContext(injector, () => new TokenService()) },
      ],
    });
  });

  afterEach(() => {
    mockStorage.clear();
  });

  function getTokenService(): TokenService {
    return injector.get(TokenService);
  }

  describe('Property 2: TokenService Storage Round-Trip', () => {
    it('saveUserData then getToken/getUserEmail returns original values', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.string({ minLength: 1 }),
            email: fc.emailAddress(),
            role: fc.string({ minLength: 1 }),
            token: fc.string({ minLength: 1 }),
          }),
          ({ id, email, role, token }) => {
            mockStorage.clear();
            const tokenService = getTokenService();

            tokenService.saveUserData(id, email, role, token);

            expect(tokenService.getToken()).toBe(token);
            expect(tokenService.getUserEmail()).toBe(email);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 3: removeUserData Completeness', () => {
    it('after removeUserData, all getters return undefined', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.string({ minLength: 1 }),
            email: fc.emailAddress(),
            role: fc.string({ minLength: 1 }),
            token: fc.string({ minLength: 1 }),
          }),
          ({ id, email, role, token }) => {
            mockStorage.clear();
            const tokenService = getTokenService();

            // First save data
            tokenService.saveUserData(id, email, role, token);

            // Then remove it
            tokenService.removeUserData();

            // All getters should return undefined
            expect(tokenService.getToken()).toBeUndefined();
            expect(tokenService.getUserEmail()).toBeUndefined();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 4: isLoggedIn Derives from Token Presence', () => {
    it('isLoggedIn() === !!getToken() always holds', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.string({ minLength: 1 }),
            email: fc.emailAddress(),
            role: fc.string({ minLength: 1 }),
            token: fc.string({ minLength: 1 }),
          }),
          fc.boolean(),
          ({ id, email, role, token }, shouldHaveData) => {
            mockStorage.clear();
            const tokenService = getTokenService();

            if (shouldHaveData) {
              tokenService.saveUserData(id, email, role, token);
            }

            // The invariant: isLoggedIn() === !!getToken()
            expect(tokenService.isLoggedIn()).toBe(!!tokenService.getToken());
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
