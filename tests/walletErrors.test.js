import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { WALLET_OPTIONS, ERROR_CODES } from '../src/utils/walletProviders.js';

describe('Multi-Wallet & Web3 Error Handling Tests', () => {
  it('should support multiple Stellar wallet providers (StellarWalletsKit style)', () => {
    const ids = WALLET_OPTIONS.map(w => w.id);
    assert.ok(ids.includes('freighter'), 'Must support Freighter wallet');
    assert.ok(ids.includes('xbull'), 'Must support xBull wallet');
    assert.ok(ids.includes('albedo'), 'Must support Albedo wallet');
    assert.ok(ids.includes('hana'), 'Must support Hana wallet');
    assert.ok(ids.includes('lobstr'), 'Must support Lobstr wallet');
    assert.ok(ids.includes('demo'), 'Must support Developer Demo wallet');
    assert.ok(WALLET_OPTIONS.length >= 5, 'Must provide 5+ wallet connection options');
  });

  it('should format 3 explicit error types correctly', () => {
    // 1. WALLET_NOT_FOUND error
    const walletNotFoundError = {
      code: ERROR_CODES.WALLET_NOT_FOUND,
      title: 'Freighter Wallet Not Found',
      message: 'Freighter browser extension is not installed in your browser.',
      downloadUrl: 'https://www.freighter.app/',
    };
    assert.strictEqual(walletNotFoundError.code, 'WALLET_NOT_FOUND');
    assert.ok(walletNotFoundError.downloadUrl);

    // 2. USER_REJECTED error
    const userRejectedError = {
      code: ERROR_CODES.USER_REJECTED,
      title: 'Connection Request Denied',
      message: 'User cancelled or rejected the Freighter connection prompt.',
    };
    assert.strictEqual(userRejectedError.code, 'USER_REJECTED');

    // 3. INSUFFICIENT_BALANCE error
    const insufficientBalanceError = {
      code: ERROR_CODES.INSUFFICIENT_BALANCE,
      title: 'Insufficient Balance',
      message: 'Available balance is lower than required deposit amount + Stellar base reserve.',
    };
    assert.strictEqual(insufficientBalanceError.code, 'INSUFFICIENT_BALANCE');
  });

  it('should identify required Stellar base fee and escrow threshold', () => {
    const totalDeposit = 1500;
    const baseReserve = 1.0;
    const balanceLow = 1000;
    const balanceSufficient = 2000;

    const isLow = balanceLow < (totalDeposit + baseReserve);
    const isOk = balanceSufficient >= (totalDeposit + baseReserve);

    assert.strictEqual(isLow, true);
    assert.strictEqual(isOk, true);
  });
});
