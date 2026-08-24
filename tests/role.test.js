import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateAgreementRole } from '../src/utils/role.js';

describe('Role Evaluation & Multi-Wallet Security Tests', () => {
  const mockAgreement = {
    id: 'AGR-999',
    landlordWallet: 'GB7XLANDLORD1234567890ABCDEF',
    tenantWallet: 'GDKXTENANT1234567890ABCDEF',
  };

  it('should evaluate landlord role correctly case-insensitively', () => {
    const result = evaluateAgreementRole('gb7xlandlord1234567890abcdef', mockAgreement);
    assert.strictEqual(result.role, 'landlord');
    assert.strictEqual(result.isLandlord, true);
    assert.strictEqual(result.isTenant, false);
    assert.strictEqual(result.isUnauthorized, false);
  });

  it('should evaluate tenant role correctly case-insensitively', () => {
    const result = evaluateAgreementRole('GDKXTENANT1234567890ABCDEF', mockAgreement);
    assert.strictEqual(result.role, 'tenant');
    assert.strictEqual(result.isTenant, true);
    assert.strictEqual(result.isLandlord, false);
    assert.strictEqual(result.isUnauthorized, false);
  });

  it('should return unauthorized for unassociated third-party wallet', () => {
    const result = evaluateAgreementRole('GUNKNOWNWALLET9999999999', mockAgreement);
    assert.strictEqual(result.role, 'unauthorized');
    assert.strictEqual(result.isUnauthorized, true);
    assert.strictEqual(result.isLandlord, false);
    assert.strictEqual(result.isTenant, false);
  });

  it('should return guest mode when no wallet is connected', () => {
    const result = evaluateAgreementRole('', mockAgreement);
    assert.strictEqual(result.role, 'guest');
    assert.strictEqual(result.isLandlord, false);
    assert.strictEqual(result.isTenant, false);
    assert.strictEqual(result.isUnauthorized, false);
  });
});
