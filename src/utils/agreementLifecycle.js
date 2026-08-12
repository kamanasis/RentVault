/**
 * RentVault Centralized Agreement Lifecycle State Machine & Event Helper
 */

export const LIFECYCLE_STAGES = [
  { stage: 1, key: 'agreement_created', status: 'Agreement Created', label: 'Agreement Created' },
  { stage: 2, key: 'awaiting_deposit', status: 'Awaiting Deposit', label: 'Awaiting Deposit' },
  { stage: 3, key: 'deposit_locked', status: 'Deposit Locked', label: 'Deposit Locked' },
  { stage: 4, key: 'lease_active', status: 'Lease Active', label: 'Lease Active' },
  { stage: 5, key: 'lease_ended', status: 'Lease Ended', label: 'Lease Ended' },
  { stage: 6, key: 'utility_settlement', status: 'Utility Settlement', label: 'Utility Settlement' },
  { stage: 7, key: 'refund_completed', status: 'Refund Completed', label: 'Refund Completed' },
];

/**
 * Returns stage number (1 to 7) for a given status
 */
export const getStageNumber = (status) => {
  const found = LIFECYCLE_STAGES.find((s) => s.status === status || s.key === status);
  return found ? found.stage : 1;
};

/**
 * Factory for creating immutable lifecycle event objects
 */
export const createLifecycleEvent = ({
  agreementId,
  type,
  status,
  actor,
  txHash = null,
  metadata = {},
}) => {
  const stageNum = getStageNumber(status);
  return {
    id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    agreementId,
    type,
    status,
    stage: stageNum,
    actor: actor || 'System',
    timestamp: new Date().toISOString(),
    txHash,
    metadata,
  };
};

/**
 * Default event history generator for demo agreements
 */
export const generateDemoEventHistory = (agreement) => {
  const events = [];
  const createdAt = agreement.createdAt || new Date().toISOString();
  const landlord = agreement.landlordWallet || 'GB7X...';
  const tenant = agreement.tenantWallet || 'GDKX...';

  // Stage 1
  events.push(createLifecycleEvent({
    agreementId: agreement.id,
    type: 'AGREEMENT_CREATED',
    status: 'Agreement Created',
    actor: landlord,
    timestamp: createdAt,
    metadata: { note: 'Draft digital rental agreement created.' },
  }));

  // Stage 2
  if (agreement.status !== 'Agreement Created') {
    events.push(createLifecycleEvent({
      agreementId: agreement.id,
      type: 'DEPOSIT_LINK_SHARED',
      status: 'Awaiting Deposit',
      actor: landlord,
      timestamp: createdAt,
      metadata: { note: 'Escrow deposit link generated & shared with tenant.' },
    }));
  }

  // Stage 3
  if (
    agreement.status === 'Deposit Locked' ||
    agreement.status === 'Lease Active' ||
    agreement.status === 'Lease Ended' ||
    agreement.status === 'Utility Settlement' ||
    agreement.status === 'Refund Completed'
  ) {
    events.push(createLifecycleEvent({
      agreementId: agreement.id,
      type: 'ESCROW_DEPOSIT_LOCKED',
      status: 'Deposit Locked',
      actor: tenant,
      txHash: agreement.txHash || '8f92a10e2b4c129d39f4011029419082001',
      timestamp: agreement.depositConfirmedAt || createdAt,
      metadata: { amount: (agreement.depositAmount || 0) + (agreement.utilityReserve || 0) },
    }));
  }

  // Stage 4
  if (
    agreement.status === 'Lease Active' ||
    agreement.status === 'Lease Ended' ||
    agreement.status === 'Utility Settlement' ||
    agreement.status === 'Refund Completed'
  ) {
    events.push(createLifecycleEvent({
      agreementId: agreement.id,
      type: 'LEASE_ACTIVATED',
      status: 'Lease Active',
      actor: landlord,
      timestamp: agreement.leaseActivatedAt || createdAt,
      metadata: { leaseStart: agreement.leaseStart, leaseEnd: agreement.leaseEnd },
    }));
  }

  // Stage 5
  if (
    agreement.status === 'Lease Ended' ||
    agreement.status === 'Utility Settlement' ||
    agreement.status === 'Refund Completed'
  ) {
    events.push(createLifecycleEvent({
      agreementId: agreement.id,
      type: 'LEASE_ENDED',
      status: 'Lease Ended',
      actor: agreement.leaseEndedBy || landlord,
      timestamp: agreement.leaseEndedAt || createdAt,
      metadata: { note: 'Lease occupancy completed by landlord.' },
    }));
  }

  // Stage 6
  if (
    agreement.status === 'Utility Settlement' ||
    agreement.status === 'Refund Completed'
  ) {
    events.push(createLifecycleEvent({
      agreementId: agreement.id,
      type: 'UTILITY_SETTLEMENT_SUBMITTED',
      status: 'Utility Settlement',
      actor: landlord,
      timestamp: agreement.settlementSubmittedAt || createdAt,
      metadata: {
        totalDeduction: agreement.totalDeduction || 0,
        finalRefundAmount: agreement.finalRefundAmount || agreement.depositAmount,
      },
    }));
  }

  // Stage 7
  if (agreement.status === 'Refund Completed') {
    events.push(createLifecycleEvent({
      agreementId: agreement.id,
      type: 'REFUND_COMPLETED',
      status: 'Refund Completed',
      actor: tenant,
      txHash: agreement.refundTxHash || '9f71c42e88b1092a8771a2',
      timestamp: agreement.refundApprovedAt || createdAt,
      metadata: { refundedAmount: agreement.finalRefundAmount || agreement.depositAmount },
    }));
  }

  return events;
};
