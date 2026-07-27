import * as fc from 'fast-check';

describe('fast-check sanity', () => {
  it('should work with jest', () => {
    fc.assert(
      fc.property(fc.integer(), (n) => {
        return n + 0 === n;
      })
    );
  });
});
