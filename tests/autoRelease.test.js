import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  AUTO_RELEASE_PRESETS,
  calculateAutoReleaseMs,
  formatAutoReleaseCountdown,
  getAutoReleasePolicyLabel,
} from '../src/utils/autoRelease.js';

describe('Auto-Release Policy & Countdown Tests', () => {
  it('should correctly calculate milliseconds for different time units', () => {
    assert.strictEqual(calculateAutoReleaseMs(1, 'minutes'), 60_000);
    assert.strictEqual(calculateAutoReleaseMs(5, 'minutes'), 300_000);
    assert.strictEqual(calculateAutoReleaseMs(1, 'hours'), 3_600_000);
    assert.strictEqual(calculateAutoReleaseMs(24, 'hours'), 86_400_000);
    assert.strictEqual(calculateAutoReleaseMs(7, 'days'), 604_800_000);
    assert.strictEqual(calculateAutoReleaseMs(2, 'weeks'), 1_209_600_000);
  });

  it('should clamp invalid or negative durations to at least 1 day fallback', () => {
    assert.strictEqual(calculateAutoReleaseMs(0, 'days'), 86_400_000);
    assert.strictEqual(calculateAutoReleaseMs(-10, 'hours'), 3_600_000);
    assert.strictEqual(calculateAutoReleaseMs('invalid', 'days'), 86_400_000);
  });

  it('should format countdown strings accurately', () => {
    assert.strictEqual(formatAutoReleaseCountdown(0), 'Completed');
    assert.strictEqual(formatAutoReleaseCountdown(-5000), 'Completed');
    assert.strictEqual(formatAutoReleaseCountdown(45_000), '45s');
    assert.strictEqual(formatAutoReleaseCountdown(125_000), '2m 5s');
    assert.strictEqual(formatAutoReleaseCountdown(7_200_000), '2h 0m');
    assert.strictEqual(formatAutoReleaseCountdown(90_000_000), '1d 1h');
  });

  it('should return human-readable policy labels', () => {
    assert.strictEqual(getAutoReleasePolicyLabel(null), '7 Days (Default)');
    assert.strictEqual(getAutoReleasePolicyLabel({ preset: '7_days' }), '7 Days (Default)');
    assert.strictEqual(getAutoReleasePolicyLabel({ preset: '14_days' }), '14 Days (2 Weeks)');
    assert.strictEqual(getAutoReleasePolicyLabel({ preset: 'custom', duration: 10, unit: 'days' }), '10 days');
  });

  it('should include 14 distinct presets in the policy catalog', () => {
    assert.strictEqual(AUTO_RELEASE_PRESETS.length, 14);
    assert.ok(AUTO_RELEASE_PRESETS.some((p) => p.id === '7_days'));
    assert.ok(AUTO_RELEASE_PRESETS.some((p) => p.id === 'custom'));
  });
});
