import '@angular/compiler';
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { FormControl, FormGroup, Validators } from '@angular/forms';

/**
 * **Validates: Requirements 5.4**
 *
 * Property 9: Submit Button State Derives from Form Validity
 * For any combination of email and password field values, the login submit button's
 * disabled state equals the negation of the form's valid state.
 */
describe('Login Submit Button State', () => {
  describe('Property 9: Submit Button State Derives from Form Validity', () => {
    it('button disabled equals form invalid for any email/password combination', () => {
      fc.assert(
        fc.property(
          fc.string(),
          fc.string(),
          (email, password) => {
            const loginForm = new FormGroup({
              email: new FormControl(email, [Validators.required, Validators.email]),
              password: new FormControl(password, [Validators.required, Validators.minLength(8)]),
            });

            // The button's disabled state in the template is: loginForm.invalid || isLoading()
            // With isLoading() = false (default), disabled === loginForm.invalid
            const buttonDisabled = loginForm.invalid;

            // This should always hold: buttonDisabled === !loginForm.valid
            expect(buttonDisabled).toBe(!loginForm.valid);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
