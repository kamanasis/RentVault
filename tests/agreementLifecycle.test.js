import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getStageNumber, createLifecycleEvent, LIFECYCLE_STAGES } from '../src/utils/agreementLifecycle.js';

describe('Agreement Lifecycle State Machine Tests', () => {
  it('should map lifecycle stages correctly to stage numbers', () => {
    assert.strictEqual(getStageNumber('agreement_created'), 1);
    assert.strictEqual(getStageNumber('awaiting_deposit'), 2);
    assert.strictEqual(getStageNumber('deposit_locked'), 3);
    assert.strictEqual(getStageNumber('lease_active'), 4);
    assert.strictEqual(getStageNumber('lease_ended'), 5);
    assert.strictEqual(getStageNumber('utility_settlement'), 6);
    assert.strictEqual(getStageNumber('dispute_resolution'), 7);
    assert.strictEqual(getStageNumber('refund_completed'), 8);
  });

  it('should map dispute statuses to Stage 7', () => {
    assert.strictEqual(getStageNumber('dispute_open'), 7);
    assert.strictEqual(getStageNumber('dispute_landlord_response'), 7);
    assert.strictEqual(getStageNumber('dispute_tenant_response'), 7);
    assert.strictEqual(getStageNumber('dispute_resolved'), 7);
    assert.strictEqual(getStageNumber('Dispute Pending'), 7);
  });

  it('should create an immutable lifecycle event object', () => {
    const event = createLifecycleEvent({
      agreementId: 'TEST-1001',
      type: 'ESCROW_DEPOSIT_LOCKED',
      status: 'Deposit Locked',
      actor: 'GB7XTESTWALLET1234567890',
      txHash: '2d6758e2adc05dff2f563c454034304873889d4781a114dc5d9fa69501b83593',
      metadata: { amount: 1500 },
    });

    assert.ok(event.id.startsWith('evt-'));
    assert.strictEqual(event.agreementId, 'TEST-1001');
    assert.strictEqual(event.stage, 3);
    assert.strictEqual(event.type, 'ESCROW_DEPOSIT_LOCKED');
    assert.strictEqual(event.actor, 'GB7XTESTWALLET1234567890');
    assert.strictEqual(event.txHash, '2d6758e2adc05dff2f563c454034304873889d4781a114dc5d9fa69501b83593');
    assert.strictEqual(event.metadata.amount, 1500);
    assert.ok(event.timestamp);
  });

  it('should have exactly 8 predefined lifecycle stages in sequential order', () => {
    assert.strictEqual(LIFECYCLE_STAGES.length, 8);
    LIFECYCLE_STAGES.forEach((stage, idx) => {
      assert.strictEqual(stage.stage, idx + 1);
    });
  });
});
