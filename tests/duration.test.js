import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateLeaseDuration } from '../src/utils/duration.js';

describe('Lease Duration Formatting Tests', () => {
  it('should return N/A for missing start or end dates', () => {
    assert.strictEqual(calculateLeaseDuration('', '2026-08-01'), 'N/A');
    assert.strictEqual(calculateLeaseDuration('2026-08-01', null), 'N/A');
  });

  it('should handle invalid ranges when end date is before start date', () => {
    assert.strictEqual(calculateLeaseDuration('2026-08-10', '2026-08-01'), 'Invalid Range');
  });

  it('should format single day and multi-day spans', () => {
    assert.strictEqual(calculateLeaseDuration('2026-08-01', '2026-08-01'), 'Same Day');
    assert.strictEqual(calculateLeaseDuration('2026-08-01', '2026-08-04'), '3 Days');
  });

  it('should format months and year duration correctly', () => {
    const res6M = calculateLeaseDuration('2026-01-01', '2026-07-01');
    assert.ok(res6M.includes('6 Months'));

    const res1Y = calculateLeaseDuration('2026-01-01', '2027-01-01');
    assert.ok(res1Y.includes('1 Year'));
  });
});
