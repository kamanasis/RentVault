import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { 
  trackEvent, 
  sanitizeAnalyticsProperties, 
  getRecentEvents, 
  getEventCounts, 
  getAnalyticsSummary, 
  clearAnalytics 
} from '../src/services/analytics.js';

describe('Product Analytics & Privacy Rules Tests', () => {
  beforeEach(() => {
    clearAnalytics();
  });

  it('should track application lifecycle events correctly', () => {
    const res1 = trackEvent('wallet_connected', { walletId: 'freighter', network: 'TESTNET' });
    const res2 = trackEvent('agreement_created', { agreementId: 'RV-TEST-001', depositAmount: 1200 });
    const res3 = trackEvent('deposit_confirmed', { agreementId: 'RV-TEST-001', amount: 1200 });

    assert.strictEqual(res1, true);
    assert.strictEqual(res2, true);
    assert.strictEqual(res3, true);

    const summary = getAnalyticsSummary();
    assert.strictEqual(summary.totalEvents, 3);
    assert.strictEqual(summary.walletConnects, 1);
    assert.strictEqual(summary.agreementsCreated, 1);
    assert.strictEqual(summary.depositsConfirmed, 1);
  });

  it('should strictly redact Stellar secret keys (S...) from analytics payload', () => {
    const secretKey = 'SAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'; // 56 chars starts with S
    const rawProps = {
      agreementId: 'RV-TEST-999',
      userNote: `Wallet secret key was ${secretKey} here`,
      safeAddress: 'GB7X42F098A190B38812TESTNETRENTVAULTKEY99',
    };

    const sanitized = sanitizeAnalyticsProperties(rawProps);
    assert.strictEqual(sanitized.userNote.includes(secretKey), false);
    assert.ok(sanitized.userNote.includes('[REDACTED_SECRET_KEY]'));
    assert.strictEqual(sanitized.safeAddress, 'GB7X42F098A190B38812TESTNETRENTVAULTKEY99');
  });

  it('should drop keys with sensitive names like secret, seed, password', () => {
    const rawProps = {
      publicKey: 'GB7X123',
      privateKey: 'secret_value',
      seedPhrase: 'twelve random words',
      userPassword: 'password123',
    };

    const sanitized = sanitizeAnalyticsProperties(rawProps);
    assert.strictEqual(sanitized.publicKey, 'GB7X123');
    assert.strictEqual(sanitized.privateKey, undefined);
    assert.strictEqual(sanitized.seedPhrase, undefined);
    assert.strictEqual(sanitized.userPassword, undefined);
  });

  it('should isolate failures and never throw on malformed inputs', () => {
    assert.strictEqual(trackEvent(null), false);
    assert.strictEqual(trackEvent(undefined), false);
    assert.strictEqual(trackEvent(123), false);
    assert.strictEqual(trackEvent('', {}), false);

    // Valid call after invalid calls
    assert.strictEqual(trackEvent('app_opened'), true);
  });
});
