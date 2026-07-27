import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { EncryptionService } from './encryption.service';

/**
 * Property-Based Test for EncryptionService
 * **Validates: Requirements 4.9**
 *
 * Property 1: Encryption Round-Trip
 * For any JSON-serializable value, encrypt then decrypt produces the original value.
 *
 * Note: Since EncryptionService uses JSON.stringify/JSON.parse internally, the round-trip
 * property holds for values that survive JSON serialization. We compare using JSON.stringify
 * to account for JSON-level equivalence (e.g., -0 becomes 0 in JSON).
 */
describe('EncryptionService', () => {
  describe('Property 1: Encryption Round-Trip', () => {
    const service = new EncryptionService();

    it('for any JSON-serializable value, encrypt then decrypt produces original value', () => {
      fc.assert(
        fc.property(fc.jsonValue(), (value) => {
          const encrypted = service.encryptData(value);
          const decrypted = service.decryptData(encrypted);

          // Compare via JSON.stringify to ensure JSON-level equivalence
          // (handles edge cases like -0 which JSON serializes as 0)
          expect(JSON.stringify(decrypted)).toBe(JSON.stringify(value));
        }),
        { numRuns: 100 }
      );
    });
  });
});
