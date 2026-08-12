import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useWallet } from './WalletContext';
import { AUTO_RELEASE_PRESETS, calculateAutoReleaseMs } from '../utils/autoRelease';
import { createLifecycleEvent, generateDemoEventHistory, getStageNumber } from '../utils/agreementLifecycle';
import { 
  subscribeToSharedAgreements, 
  saveAgreementToSharedStore, 
  deleteAgreementFromSharedStore,
  normalizeAgreementForStorage
} from '../services/sharedStore';

const AgreementContext = createContext();

/**
 * Self-healing status migration & event history initialization
 */
const checkAndMigrateLeaseStatus = (agreementsList = []) => {
  let hasChanges = false;
  const now = new Date();

  const migrated = agreementsList.map((a) => {
    const autoReleaseObj = a.autoRelease || {
      preset: '7_days',
      duration: 7,
      unit: 'days',
      milliseconds: 7 * 24 * 60 * 60 * 1000,
    };

    let updatedObj = { ...a, autoRelease: autoReleaseObj };

    // Auto-initialize event history if missing
    if (!updatedObj.eventHistory || !Array.isArray(updatedObj.eventHistory) || updatedObj.eventHistory.length === 0) {
      hasChanges = true;
      updatedObj.eventHistory = generateDemoEventHistory(updatedObj);
    }

    if (updatedObj.status === 'Lease Active' && updatedObj.leaseEnd) {
      const endDate = new Date(updatedObj.leaseEnd);
      endDate.setHours(23, 59, 59, 999);
      if (endDate < now) {
        hasChanges = true;
        const newEvt = createLifecycleEvent({
          agreementId: updatedObj.id,
          type: 'LEASE_ENDED_AUTO',
          status: 'Lease Ended',
          actor: updatedObj.landlordWallet,
          timestamp: new Date().toISOString(),
          metadata: { note: 'Lease end date elapsed automatically.' },
        });

        updatedObj = {
          ...updatedObj,
          status: 'Lease Ended',
          leaseEndedAt: updatedObj.leaseEndedAt || new Date().toISOString(),
          leaseEndedBy: updatedObj.leaseEndedBy || updatedObj.landlordWallet,
          eventHistory: [...updatedObj.eventHistory, newEvt],
        };
      }
    }

    return updatedObj;
  });

  return { migrated, hasChanges };
};

export const AgreementProvider = ({ children }) => {
  const { address } = useWallet();
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Subscribe strictly to Firestore realtime onSnapshot single source of truth
  useEffect(() => {
    console.log('[AgreementContext] Initializing Firestore realtime listener...');
    
    const unsubscribe = subscribeToSharedAgreements((sharedList) => {
      const { migrated } = checkAndMigrateLeaseStatus(sharedList);
      console.log(`[AgreementContext] Received ${migrated.length} agreements from Firestore realtime feed`);
      setAgreements(migrated);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Centralized Lifecycle State Machine advance function (Atomic Firestore Write)
  const advanceAgreementStatus = async (id, nextStatus, eventDetails = {}) => {
    const target = agreements.find((a) => a.id.toLowerCase() === id.toLowerCase());
    if (!target) return;

    const newEvt = createLifecycleEvent({
      agreementId: target.id,
      type: eventDetails.type || `STATUS_ADVANCED_${nextStatus.toUpperCase().replace(/\s+/g, '_')}`,
      status: nextStatus,
      actor: eventDetails.actor || address || target.landlordWallet,
      txHash: eventDetails.txHash || null,
      metadata: eventDetails.metadata || {},
    });

    const currentHistory = Array.isArray(target.eventHistory) ? target.eventHistory : [];

    const updatedAgreement = {
      ...target,
      ...eventDetails.updatedFields,
      status: nextStatus,
      updatedAt: new Date().toISOString(),
      eventHistory: [...currentHistory, newEvt],
    };

    console.log(`[AgreementContext] Advancing agreement ${id} to state '${nextStatus}'...`);
    await saveAgreementToSharedStore(updatedAgreement);
  };

  // Create new agreement with customizable autoRelease policy (Atomic Firestore Write)
  const createAgreement = async (formData) => {
    const nextIndex = agreements.length + 1;
    const padIndex = String(nextIndex).padStart(3, '0');
    const newId = `RV-2026-${padIndex}`;
    const landlordAddr = (address || 'GB7X42F098A190B38812TESTNETRENTVAULTKEY99').trim().toUpperCase();
    const tenantAddr = (formData.tenantWallet || '').trim().toUpperCase();

    let autoReleaseObj = {
      preset: formData.autoReleasePreset || '7_days',
      duration: 7,
      unit: 'days',
      milliseconds: 7 * 24 * 60 * 60 * 1000,
    };

    if (formData.autoReleasePreset === 'custom') {
      const customDur = Math.max(1, parseFloat(formData.customAutoReleaseDuration) || 1);
      const customUnit = formData.customAutoReleaseUnit || 'days';
      const customMs = calculateAutoReleaseMs(customDur, customUnit);
      autoReleaseObj = {
        preset: 'custom',
        duration: customDur,
        unit: customUnit,
        milliseconds: customMs,
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

    const newAgreementDraft = {
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
    };

    const initialEvents = [
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
    ];

    const newAgreement = { ...newAgreementDraft, eventHistory: initialEvents };
    console.log(`[AgreementContext] Creating new agreement ${newId} in Firestore...`);
    await saveAgreementToSharedStore(newAgreement);
    return newAgreement;
  };

  // Update agreement terms
  const updateAgreement = async (id, updatedFields) => {
    const target = agreements.find((a) => a.id.toLowerCase() === id.toLowerCase());
    if (!target) return;

    const updatedAgreement = {
      ...target,
      ...updatedFields,
      landlordWallet: updatedFields.landlordWallet ? updatedFields.landlordWallet.trim().toUpperCase() : target.landlordWallet,
      tenantWallet: updatedFields.tenantWallet ? updatedFields.tenantWallet.trim().toUpperCase() : target.tenantWallet,
      depositAmount: updatedFields.depositAmount !== undefined ? parseFloat(updatedFields.depositAmount) : target.depositAmount,
      utilityReserve: updatedFields.utilityReserve !== undefined ? parseFloat(updatedFields.utilityReserve) : target.utilityReserve,
      updatedAt: new Date().toISOString(),
    };

    await saveAgreementToSharedStore(updatedAgreement);
  };

  // Update landlord auto-release policy
  const updateAutoReleasePolicy = async (id, newAutoReleaseObj) => {
    const target = agreements.find((a) => a.id.toLowerCase() === id.toLowerCase());
    if (!target) return;

    const updatedAgreement = {
      ...target,
      autoRelease: newAutoReleaseObj,
      updatedAt: new Date().toISOString(),
    };

    await saveAgreementToSharedStore(updatedAgreement);
  };

  // Deposit Escrow Contract execution handler
  const depositEscrow = async (id, txData) => {
    const target = agreements.find((a) => a.id.toLowerCase() === id.toLowerCase());
    const total = target ? (target.depositAmount || 0) + (target.utilityReserve || 0) : 0;

    await advanceAgreementStatus(id, 'Deposit Locked', {
      type: 'ESCROW_DEPOSIT_LOCKED',
      actor: address ? address.trim().toUpperCase() : target?.tenantWallet,
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

  // Activate Lease State
  const activateLease = async (id) => {
    const target = agreements.find((a) => a.id.toLowerCase() === id.toLowerCase());
    await advanceAgreementStatus(id, 'Lease Active', {
      type: 'LEASE_ACTIVATED',
      actor: address ? address.trim().toUpperCase() : target?.landlordWallet,
      metadata: { leaseStart: target?.leaseStart, leaseEnd: target?.leaseEnd },
      updatedFields: { leaseActivatedAt: new Date().toISOString() },
    });
  };

  // Landlord-only End Lease State Handler
  const endLease = async (id, actorAddress = '') => {
    const target = agreements.find((a) => a.id.toLowerCase() === id.toLowerCase());
    const actor = (actorAddress || address || target?.landlordWallet || '').trim().toUpperCase();

    await advanceAgreementStatus(id, 'Lease Ended', {
      type: 'LEASE_ENDED',
      actor,
      metadata: { note: 'Lease terminated by landlord.' },
      updatedFields: {
        leaseEndedAt: new Date().toISOString(),
        leaseEndedBy: actor,
      },
    });
  };

  // Submit Landlord Utility Settlement
  const submitUtilitySettlement = async (id, deductionsData) => {
    const target = agreements.find((a) => a.id.toLowerCase() === id.toLowerCase());
    const deposit = target?.depositAmount || 0;
    const reserve = target?.utilityReserve || 0;
    const totalEscrow = deposit + reserve;

    const electricity = parseFloat(deductionsData.electricity || 0);
    const water = parseFloat(deductionsData.water || 0);
    const internet = parseFloat(deductionsData.internet || 0);
    const maintenance = parseFloat(deductionsData.maintenance || 0);
    const other = parseFloat(deductionsData.other || 0);
    const totalDeduction = electricity + water + internet + maintenance + other;
    const finalRefundAmount = Math.max(0, totalEscrow - totalDeduction);

    await advanceAgreementStatus(id, 'Utility Settlement', {
      type: 'UTILITY_SETTLEMENT_SUBMITTED',
      actor: address ? address.trim().toUpperCase() : target?.landlordWallet,
      metadata: { totalDeduction, finalRefundAmount },
      updatedFields: {
        utilityDeductions: { electricity, water, internet, maintenance, other, notes: deductionsData.notes || '' },
        totalDeduction,
        finalRefundAmount,
        settlementSubmittedAt: new Date().toISOString(),
      },
    });
  };

  // Tenant Approve Refund
  const approveRefund = async (id) => {
    const target = agreements.find((a) => a.id.toLowerCase() === id.toLowerCase());
    const mockRefundHash = `9f71c42e88b1092a${Date.now().toString(16)}`;
    const deposit = target?.depositAmount || 0;
    const refundVal = target?.finalRefundAmount !== undefined ? target.finalRefundAmount : deposit;

    await advanceAgreementStatus(id, 'Refund Completed', {
      type: 'REFUND_COMPLETED',
      actor: address ? address.trim().toUpperCase() : target?.tenantWallet,
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

  // Tenant Raise Dispute
  const raiseDispute = async (id) => {
    const target = agreements.find((a) => a.id.toLowerCase() === id.toLowerCase());
    await advanceAgreementStatus(id, 'Dispute Pending', {
      type: 'SETTLEMENT_DISPUTE_RAISED',
      actor: address ? address.trim().toUpperCase() : target?.tenantWallet,
      metadata: { note: 'Dispute raised by tenant.' },
      updatedFields: { disputedAt: new Date().toISOString() },
    });
  };

  // Get specific agreement by ID
  const getAgreementById = useCallback((id) => {
    if (!id) return null;
    return agreements.find((a) => a.id.toLowerCase() === id.toLowerCase()) || null;
  }, [agreements]);

  // Update agreement status
  const updateAgreementStatus = async (id, newStatus) => {
    await advanceAgreementStatus(id, newStatus);
  };

  // Delete agreement
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
        approveRefund,
        raiseDispute,
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
