import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useWallet } from './WalletContext';
import { AUTO_RELEASE_PRESETS, calculateAutoReleaseMs } from '../utils/autoRelease';
import { createLifecycleEvent, generateDemoEventHistory } from '../utils/agreementLifecycle';
import {
  subscribeToSharedAgreements,
  saveAgreementToSharedStore,
  deleteAgreementFromSharedStore,
  normalizeWallet,
} from '../services/sharedStore';

const AgreementContext = createContext();

/**
 * Self-healing migration: ensure autoRelease, eventHistory, and auto lease-end transitions.
 */
const migrateAgreementsList = (list = []) => {
  const now = new Date();
  return list.map((a) => {
    let ag = {
      ...a,
      autoRelease: a.autoRelease || {
        preset: '7_days',
        duration: 7,
        unit: 'days',
        milliseconds: 7 * 24 * 60 * 60 * 1000,
      },
    };

    if (!Array.isArray(ag.eventHistory) || ag.eventHistory.length === 0) {
      ag.eventHistory = generateDemoEventHistory(ag);
    }

    if (ag.status === 'Lease Active' && ag.leaseEnd) {
      const endDate = new Date(ag.leaseEnd);
      endDate.setHours(23, 59, 59, 999);
      if (endDate < now) {
        const newEvt = createLifecycleEvent({
          agreementId: ag.id,
          type: 'LEASE_ENDED_AUTO',
          status: 'Lease Ended',
          actor: ag.landlordWallet,
          timestamp: new Date().toISOString(),
          metadata: { note: 'Lease end date elapsed automatically.' },
        });
        ag = {
          ...ag,
          status: 'Lease Ended',
          leaseEndedAt: ag.leaseEndedAt || new Date().toISOString(),
          leaseEndedBy: ag.leaseEndedBy || ag.landlordWallet,
          eventHistory: [...ag.eventHistory, newEvt],
        };
      }
    }

    return ag;
  });
};

export const AgreementProvider = ({ children }) => {
  const { address } = useWallet();
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Subscribe to agreements where the connected wallet is either landlord or tenant.
   * This uses targeted dual-queries to prevent exposing unrelated users' agreements.
   * The listener restarts automatically whenever the connected wallet address changes.
   */
  useEffect(() => {
    if (!address) {
      setAgreements([]);
      setLoading(false);
      return;
    }

    console.log(`[AgreementContext] Starting targeted Firestore subscription for: ${address}`);
    setLoading(true);

    const unsubscribe = subscribeToSharedAgreements(address, (firestoreList) => {
      const migrated = migrateAgreementsList(firestoreList);
      console.log(`[AgreementContext] Received ${migrated.length} agreements from Firestore`);
      setAgreements(migrated);
      setLoading(false);
    });

    return () => {
      console.log(`[AgreementContext] Cleaning up Firestore subscription for: ${address}`);
      unsubscribe();
    };
  }, [address]);

  /**
   * Central lifecycle state machine — advances an agreement to a new status
   * and persists it atomically to Firestore. All browsers receive the update
   * instantly via the global onSnapshot listener.
   */
  const advanceAgreementStatus = async (id, nextStatus, eventDetails = {}) => {
    const target = agreements.find((a) => a.id === id);
    if (!target) {
      console.error(`[AgreementContext] Agreement ${id} not found`);
      return;
    }

    const newEvt = createLifecycleEvent({
      agreementId: target.id,
      type: eventDetails.type || `STATUS_ADVANCED_${nextStatus.toUpperCase().replace(/\s+/g, '_')}`,
      status: nextStatus,
      actor: eventDetails.actor || normalizeWallet(address) || target.landlordWallet,
      txHash: eventDetails.txHash || null,
      metadata: eventDetails.metadata || {},
    });

    const currentHistory = Array.isArray(target.eventHistory) ? target.eventHistory : [];

    const updatedAgreement = {
      ...target,
      ...(eventDetails.updatedFields || {}),
      status: nextStatus,
      updatedAt: new Date().toISOString(),
      eventHistory: [...currentHistory, newEvt],
    };

    await saveAgreementToSharedStore(updatedAgreement);
  };

  /**
   * Creates a new rental agreement and writes it to Firestore.
   * The global onSnapshot listener ensures all browsers receive it immediately.
   */
  const createAgreement = async (formData) => {
    const landlordAddr = normalizeWallet(address) || 'GB7X42F098A190B38812TESTNETRENTVAULTKEY99';
    const tenantAddr = normalizeWallet(formData.tenantWallet);

    const nextIndex = agreements.length + 1;
    const padIndex = String(nextIndex).padStart(3, '0');
    const newId = `RV-${Date.now()}-${padIndex}`;

    let autoReleaseObj = {
      preset: '7_days',
      duration: 7,
      unit: 'days',
      milliseconds: 7 * 24 * 60 * 60 * 1000,
    };

    if (formData.autoReleasePreset === 'custom') {
      const customDur = Math.max(1, parseFloat(formData.customAutoReleaseDuration) || 1);
      const customUnit = formData.customAutoReleaseUnit || 'days';
      autoReleaseObj = {
        preset: 'custom',
        duration: customDur,
        unit: customUnit,
        milliseconds: calculateAutoReleaseMs(customDur, customUnit),
      };
    } else if (formData.autoReleasePreset) {
      const presetFound = AUTO_RELEASE_PRESETS.find((p) => p.id === formData.autoReleasePreset);
      if (presetFound) {
        autoReleaseObj = {
          preset: presetFound.id,
          duration: presetFound.duration,
          unit: presetFound.unit,
          milliseconds: presetFound.milliseconds,
        };
      }
    }

    const createdAtTs = new Date().toISOString();

    const newAgreement = {
      id: newId,
      propertyName: formData.propertyName,
      propertyAddress: formData.propertyAddress,
      landlordWallet: landlordAddr,
      tenantWallet: tenantAddr,
      depositAmount: parseFloat(formData.depositAmount) || 0,
      utilityReserve: parseFloat(formData.utilityReserve) || 0,
      fundedAmount: 0,
      leaseStart: formData.leaseStart,
      leaseEnd: formData.leaseEnd,
      notes: formData.notes || '',
      autoRelease: autoReleaseObj,
      status: 'Awaiting Deposit',
      createdAt: createdAtTs,
      updatedAt: createdAtTs,
      eventHistory: [
        createLifecycleEvent({
          agreementId: newId,
          type: 'AGREEMENT_CREATED',
          status: 'Agreement Created',
          actor: landlordAddr,
          timestamp: createdAtTs,
          metadata: { note: 'Digital rental agreement created.' },
        }),
        createLifecycleEvent({
          agreementId: newId,
          type: 'DEPOSIT_LINK_SHARED',
          status: 'Awaiting Deposit',
          actor: landlordAddr,
          timestamp: createdAtTs,
          metadata: { note: 'Deposit link generated & shared with tenant.' },
        }),
      ],
    };

    console.log('CREATING AGREEMENT', {
      id: newId,
      landlordWallet: landlordAddr,
      tenantWallet: tenantAddr,
    });

    await saveAgreementToSharedStore(newAgreement);
    return newAgreement;
  };

  // ── Dispute Handlers ────────────────────────────────────────────────────────

  const raiseSettlementDispute = async (id, disputeData) => {
    const target = agreements.find((a) => a.id === id);
    if (!target) return;

    const actor = normalizeWallet(address) || target.tenantWallet;
    const disputeObj = {
      status: 'open',
      openedBy: 'tenant',
      openedAt: new Date().toISOString(),
      reason: disputeData.reason || 'Excessive Utility Deduction',
      description: disputeData.description || '',
      autoReleasePausedAt: new Date().toISOString(),
      responses: [],
    };

    await advanceAgreementStatus(id, 'dispute_open', {
      type: 'DISPUTE_RAISED',
      actor,
      metadata: { reason: disputeObj.reason, description: disputeObj.description },
      updatedFields: { dispute: disputeObj },
    });
  };

  const respondToDisputeLandlord = async (id, responseData) => {
    const target = agreements.find((a) => a.id === id);
    if (!target || !target.dispute) return;

    const actor = normalizeWallet(address) || target.landlordWallet;
    const action = responseData.action || 'revised_proposal';
    const now = new Date().toISOString();

    const newResponse = {
      id: `resp-${Date.now()}`,
      by: actor,
      role: 'landlord',
      action,
      message: responseData.message || '',
      proposedUtilityDeduction: responseData.revisedUtility,
      timestamp: now,
    };

    const updatedResponses = [...(target.dispute.responses || []), newResponse];

    if (action === 'accept') {
      const totalEscrow = (target.depositAmount || 0) + (target.utilityReserve || 0);
      await advanceAgreementStatus(id, 'dispute_resolved', {
        type: 'LANDLORD_ACCEPTED_DISPUTE',
        actor,
        metadata: { note: 'Landlord accepted tenant dispute claim.' },
        updatedFields: {
          dispute: { ...target.dispute, status: 'resolved', resolvedAt: now, finalUtilityDeduction: 0, responses: updatedResponses },
          totalDeduction: 0,
          finalRefundAmount: totalEscrow,
        },
      });
    } else {
      const totalEscrow = (target.depositAmount || 0) + (target.utilityReserve || 0);
      const newDeduction = action === 'revised_proposal' ? responseData.revisedUtility : target.totalDeduction;
      const newRefund = Math.max(0, totalEscrow - newDeduction);

      await advanceAgreementStatus(id, 'dispute_landlord_response', {
        type: 'LANDLORD_DISPUTE_RESPONSE',
        actor,
        metadata: { action, proposedUtility: newDeduction },
        updatedFields: {
          dispute: { ...target.dispute, status: 'landlord_response', responses: updatedResponses },
          totalDeduction: newDeduction,
          finalRefundAmount: newRefund,
        },
      });
    }
  };

  const respondToDisputeTenant = async (id, responseData) => {
    const target = agreements.find((a) => a.id === id);
    if (!target || !target.dispute) return;

    const actor = normalizeWallet(address) || target.tenantWallet;
    const action = responseData.action || 'accept';
    const now = new Date().toISOString();

    const newResponse = {
      id: `resp-${Date.now()}`,
      by: actor,
      role: 'tenant',
      action,
      message: responseData.message || '',
      timestamp: now,
    };

    const updatedResponses = [...(target.dispute.responses || []), newResponse];

    if (action === 'accept') {
      await advanceAgreementStatus(id, 'dispute_resolved', {
        type: 'TENANT_ACCEPTED_SETTLEMENT',
        actor,
        metadata: { note: 'Tenant accepted revised settlement proposal.' },
        updatedFields: {
          dispute: { ...target.dispute, status: 'resolved', resolvedAt: now, responses: updatedResponses },
        },
      });
    } else {
      await advanceAgreementStatus(id, 'dispute_tenant_response', {
        type: 'TENANT_CONTINUED_DISPUTE',
        actor,
        metadata: { note: 'Tenant requested further dispute negotiation.' },
        updatedFields: {
          dispute: { ...target.dispute, status: 'tenant_response', responses: updatedResponses },
        },
      });
    }
  };

  // ── Agreement Update Handlers ────────────────────────────────────────────────

  const updateAgreement = async (id, updatedFields) => {
    const target = agreements.find((a) => a.id === id);
    if (!target) return;

    await saveAgreementToSharedStore({
      ...target,
      ...updatedFields,
      landlordWallet: normalizeWallet(updatedFields.landlordWallet || target.landlordWallet),
      tenantWallet: normalizeWallet(updatedFields.tenantWallet || target.tenantWallet),
      depositAmount: updatedFields.depositAmount !== undefined ? parseFloat(updatedFields.depositAmount) : target.depositAmount,
      utilityReserve: updatedFields.utilityReserve !== undefined ? parseFloat(updatedFields.utilityReserve) : target.utilityReserve,
      updatedAt: new Date().toISOString(),
    });
  };

  const updateAutoReleasePolicy = async (id, newAutoReleaseObj) => {
    const target = agreements.find((a) => a.id === id);
    if (!target) return;
    await saveAgreementToSharedStore({ ...target, autoRelease: newAutoReleaseObj, updatedAt: new Date().toISOString() });
  };

  const depositEscrow = async (id, txData) => {
    const target = agreements.find((a) => a.id === id);
    const total = target ? (target.depositAmount || 0) + (target.utilityReserve || 0) : 0;

    await advanceAgreementStatus(id, 'Deposit Locked', {
      type: 'ESCROW_DEPOSIT_LOCKED',
      actor: normalizeWallet(address) || target?.tenantWallet,
      txHash: txData.hash,
      metadata: { fundedAmount: total, ledger: txData.ledger },
      updatedFields: {
        fundedAmount: total,
        txHash: txData.hash,
        txLedger: txData.ledger,
        contractId: txData.contractId,
        depositConfirmedAt: txData.timestamp || new Date().toISOString(),
      },
    });
  };

  const activateLease = async (id) => {
    const target = agreements.find((a) => a.id === id);
    await advanceAgreementStatus(id, 'Lease Active', {
      type: 'LEASE_ACTIVATED',
      actor: normalizeWallet(address) || target?.landlordWallet,
      metadata: { leaseStart: target?.leaseStart, leaseEnd: target?.leaseEnd },
      updatedFields: { leaseActivatedAt: new Date().toISOString() },
    });
  };

  const endLease = async (id, actorAddress = '') => {
    const target = agreements.find((a) => a.id === id);
    const actor = normalizeWallet(actorAddress || address) || target?.landlordWallet || '';
    await advanceAgreementStatus(id, 'Lease Ended', {
      type: 'LEASE_ENDED',
      actor,
      metadata: { note: 'Lease terminated by landlord.' },
      updatedFields: { leaseEndedAt: new Date().toISOString(), leaseEndedBy: actor },
    });
  };

  const submitUtilitySettlement = async (id, deductionsData) => {
    const target = agreements.find((a) => a.id === id);
    const totalEscrow = (target?.depositAmount || 0) + (target?.utilityReserve || 0);
    const electricity = parseFloat(deductionsData.electricity || 0);
    const water = parseFloat(deductionsData.water || 0);
    const internet = parseFloat(deductionsData.internet || 0);
    const maintenance = parseFloat(deductionsData.maintenance || 0);
    const other = parseFloat(deductionsData.other || 0);
    const totalDeduction = electricity + water + internet + maintenance + other;
    const finalRefundAmount = Math.max(0, totalEscrow - totalDeduction);

    await advanceAgreementStatus(id, 'Utility Settlement', {
      type: 'UTILITY_SETTLEMENT_SUBMITTED',
      actor: normalizeWallet(address) || target?.landlordWallet,
      metadata: { totalDeduction, finalRefundAmount },
      updatedFields: {
        utilityDeductions: { electricity, water, internet, maintenance, other, notes: deductionsData.notes || '' },
        totalDeduction,
        finalRefundAmount,
        settlementSubmittedAt: new Date().toISOString(),
      },
    });
  };

  const approveRefund = async (id) => {
    const target = agreements.find((a) => a.id === id);
    if (target?.dispute && target.dispute.status !== 'resolved') {
      console.warn(`[AgreementContext] Refund locked for ${id}: active dispute in progress.`);
      return;
    }

    const mockRefundHash = `9f71c42e88b1092a${Date.now().toString(16)}`;
    const refundVal = target?.finalRefundAmount !== undefined ? target.finalRefundAmount : (target?.depositAmount || 0);

    await advanceAgreementStatus(id, 'Refund Completed', {
      type: 'REFUND_COMPLETED',
      actor: normalizeWallet(address) || target?.tenantWallet,
      txHash: mockRefundHash,
      metadata: { refundVal },
      updatedFields: {
        finalRefundAmount: refundVal,
        refundApprovedAt: new Date().toISOString(),
        refundTxHash: mockRefundHash,
        fundedAmount: 0,
      },
    });
  };

  const getAgreementById = useCallback(
    (id) => {
      if (!id) return null;
      return agreements.find((a) => a.id === id) || null;
    },
    [agreements]
  );

  const updateAgreementStatus = async (id, newStatus) => {
    await advanceAgreementStatus(id, newStatus);
  };

  const deleteAgreement = async (id) => {
    await deleteAgreementFromSharedStore(id);
  };

  return (
    <AgreementContext.Provider
      value={{
        agreements,
        loading,
        createAgreement,
        updateAgreement,
        updateAutoReleasePolicy,
        advanceAgreementStatus,
        depositEscrow,
        activateLease,
        endLease,
        submitUtilitySettlement,
        raiseSettlementDispute,
        respondToDisputeLandlord,
        respondToDisputeTenant,
        approveRefund,
        getAgreementById,
        updateAgreementStatus,
        deleteAgreement,
      }}
    >
      {children}
    </AgreementContext.Provider>
  );
};

export const useAgreements = () => {
  const context = useContext(AgreementContext);
  if (!context) {
    throw new Error('useAgreements must be used within an AgreementProvider');
  }
  return context;
};
