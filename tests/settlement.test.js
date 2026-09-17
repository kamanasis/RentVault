import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('Utility Settlement & Financial Calculations Tests', () => {
  // Pure helper simulating the settlement deduction logic
  const calculateSettlement = (escrowAmount, utilityReserve, deductions = {}) => {
    const parseAmount = (v) => {
      const n = parseFloat(v);
      return isNaN(n) ? 0 : Math.max(0, n);
    };

    const totalEscrow = parseAmount(escrowAmount) + parseAmount(utilityReserve);
    const electricity = parseAmount(deductions.electricity);
    const water = parseAmount(deductions.water);
    const internet = parseAmount(deductions.internet);
    const maintenance = parseAmount(deductions.maintenance);
    const other = parseAmount(deductions.other);

    const totalDeductions = electricity + water + internet + maintenance + other;
    const finalRefund = Math.max(0, totalEscrow - totalDeductions);

    return {
      totalEscrow,
      totalDeductions,
      finalRefund,
      isFullyRefunded: totalDeductions === 0,
      isZeroRefund: finalRefund === 0,
    };
  };

  it('should accurately calculate total deductions and net refund', () => {
    const res = calculateSettlement(1200, 200, {
      electricity: 65.5,
      water: 34.5,
      internet: 50.0,
      maintenance: 0,
    });

    assert.strictEqual(res.totalEscrow, 1400);
    assert.strictEqual(res.totalDeductions, 150);
    assert.strictEqual(res.finalRefund, 1250);
    assert.strictEqual(res.isFullyRefunded, false);
    assert.strictEqual(res.isZeroRefund, false);
  });

  it('should return full escrow when deductions are zero', () => {
    const res = calculateSettlement(1500, 0, {});
    assert.strictEqual(res.totalEscrow, 1500);
    assert.strictEqual(res.totalDeductions, 0);
    assert.strictEqual(res.finalRefund, 1500);
    assert.strictEqual(res.isFullyRefunded, true);
  });

  it('should clamp final refund to 0 if deductions exceed total escrow deposit', () => {
    const res = calculateSettlement(1000, 0, {
      electricity: 600,
      water: 500,
    });

    assert.strictEqual(res.totalEscrow, 1000);
    assert.strictEqual(res.totalDeductions, 1100);
    assert.strictEqual(res.finalRefund, 0);
    assert.strictEqual(res.isZeroRefund, true);
  });

  it('should handle missing, negative, or invalid deduction amounts safely', () => {
    const res = calculateSettlement(1000, 100, {
      electricity: -50,
      water: 'invalid',
      internet: null,
    });

    assert.strictEqual(res.totalEscrow, 1100);
    assert.strictEqual(res.totalDeductions, 0);
    assert.strictEqual(res.finalRefund, 1100);
  });

  it('should evaluate dispute resolution state transitions correctly', () => {
    const validDisputeTransitions = {
      open: ['landlord_response', 'resolved'],
      landlord_response: ['tenant_response', 'resolved'],
      tenant_response: ['landlord_response', 'resolved'],
      resolved: [], // Terminal state
    };

    assert.ok(validDisputeTransitions['open'].includes('landlord_response'));
    assert.ok(validDisputeTransitions['open'].includes('resolved'));
    assert.ok(validDisputeTransitions['landlord_response'].includes('resolved'));
    assert.strictEqual(validDisputeTransitions['resolved'].length, 0);
  });
});
