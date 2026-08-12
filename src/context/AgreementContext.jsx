import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useWallet } from './WalletContext';
import { AUTO_RELEASE_PRESETS, calculateAutoReleaseMs } from '../utils/autoRelease';
import { createLifecycleEvent, generateDemoEventHistory, getStageNumber } from '../utils/agreementLifecycle';
import { 
  subscribeToSharedAgreements, 
  saveAgreementToSharedStore, 
  saveAllAgreementsToSharedStore,
  deleteAgreementFromSharedStore,
  normalizeAgreementForStorage
} from '../services/sharedStore';

const AgreementContext = createContext();

const STORAGE_KEY = 'rentvault_agreements';

const INITIAL_DEMO_AGREEMENTS = [
  {
    id: 'RV-2026-001',
    propertyName: 'Sunset Bay Apartments #402',
    propertyAddress: '742 Evergreen Terrace, Sector 4',
    landlordWallet: 'GB7X42F098A190B38812TESTNETRENTVAULTKEY99',
    tenantWallet: 'GDKX89A190B38812TESTNETTENANTKEY99881',
    depositAmount: 2300,
    utilityReserve: 200,
    fundedAmount: 0,
    leaseStart: '2026-09-01',
    leaseEnd: '2027-08-31',
    notes: 'Includes reserved utility escrow for electricity and water settlement.',
    status: 'Awaiting Deposit',
    createdAt: '2026-08-01T10:00:00.000Z',
    autoRelease: {
      preset: '7_days',
      duration: 7,
      unit: 'days',
      milliseconds: 7 * 24 * 60 * 60 * 1000,
    },
  },
  {
    id: 'RV-2026-002',
    propertyName: 'Metro Loft Suites #12',
    propertyAddress: '101 Innovation Boulevard, Tech District',
    landlordWallet: 'GB7X42F098A190B38812TESTNETRENTVAULTKEY99',
    tenantWallet: 'GC2Y19D488A1009182TESTNETTENANTKEY77',
    depositAmount: 1800,
    utilityReserve: 200,
    fundedAmount: 2000,
    leaseStart: '2026-06-01',
    leaseEnd: '2027-05-31',
    notes: 'Escrow deposit locked on Stellar Testnet.',
    status: 'Deposit Locked',
    createdAt: '2026-05-20T14:30:00.000Z',
    txHash: '8f92a10e2b4c129d39f4011029419082001',
    depositConfirmedAt: '2026-05-20T14:35:00.000Z',
    autoRelease: {
      preset: '1_min',
      duration: 1,
      unit: 'minutes',
      milliseconds: 60 * 1000,
    },
  },
];

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

  // Initialize and subscribe to real-time shared store across distinct browsers/tabs
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      let initialList = INITIAL_DEMO_AGREEMENTS;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          initialList = parsed;
        }
      }

      const { migrated } = checkAndMigrateLeaseStatus(initialList);
      setAgreements(migrated);
    } catch (err) {
      const { migrated } = checkAndMigrateLeaseStatus(INITIAL_DEMO_AGREEMENTS);
      setAgreements(migrated);
    } finally {
      setLoading(false);
    }

    // Subscribe to shared real-time persistence layer (Firebase + BroadcastChannel)
    const unsubscribe = subscribeToSharedAgreements((sharedList) => {
      const { migrated } = checkAndMigrateLeaseStatus(sharedList);
      setAgreements(migrated);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const persistAgreements = (newAgreements) => {
    const { migrated } = checkAndMigrateLeaseStatus(newAgreements);
    setAgreements(migrated);
    saveAllAgreementsToSharedStore(migrated);
  };

  // Centralized Lifecycle State Machine advance function
  const advanceAgreementStatus = (id, nextStatus, eventDetails = {}) => {
    let targetUpdated = null;
    const updated = agreements.map((a) => {
      if (a.id.toLowerCase() === id.toLowerCase()) {
        const newEvt = createLifecycleEvent({
          agreementId: a.id,
          type: eventDetails.type || `STATUS_ADVANCED_${nextStatus.toUpperCase().replace(/\s+/g, '_')}`,
          status: nextStatus,
          actor: eventDetails.actor || address || a.landlordWallet,
          txHash: eventDetails.txHash || null,
          metadata: eventDetails.metadata || {},
        });

        const currentHistory = Array.isArray(a.eventHistory) ? a.eventHistory : [];

        targetUpdated = {
          ...a,
          ...eventDetails.updatedFields,
          status: nextStatus,
          updatedAt: new Date().toISOString(),
          eventHistory: [...currentHistory, newEvt],
        };
        return targetUpdated;
      }
      return a;
    });

    if (targetUpdated) {
      saveAgreementToSharedStore(targetUpdated);
    } else {
      persistAgreements(updated);
    }
  };

  // Create new agreement with customizable autoRelease policy
  const createAgreement = (formData) => {
    const nextIndex = agreements.length + 1;
    const padIndex = String(nextIndex).padStart(3, '0');
    const newId = `RV-2026-${padIndex}`;
    const landlordAddr = address || 'GB7X42F098A190B38812TESTNETRENTVAULTKEY99';

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
      tenantWallet: formData.tenantWallet,
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
    saveAgreementToSharedStore(newAgreement);
    return newAgreement;
  };

  // Update agreement terms
  const updateAgreement = (id, updatedFields) => {
    let targetUpdated = null;
    const updated = agreements.map((a) => {
      if (a.id.toLowerCase() === id.toLowerCase()) {
        targetUpdated = {
          ...a,
          ...updatedFields,
          depositAmount: updatedFields.depositAmount !== undefined ? parseFloat(updatedFields.depositAmount) : a.depositAmount,
          utilityReserve: updatedFields.utilityReserve !== undefined ? parseFloat(updatedFields.utilityReserve) : a.utilityReserve,
          updatedAt: new Date().toISOString(),
        };
        return targetUpdated;
      }
      return a;
    });

    if (targetUpdated) {
      saveAgreementToSharedStore(targetUpdated);
    } else {
      persistAgreements(updated);
    }
  };

  // Update landlord auto-release policy
  const updateAutoReleasePolicy = (id, newAutoReleaseObj) => {
    let targetUpdated = null;
    const updated = agreements.map((a) => {
      if (a.id.toLowerCase() === id.toLowerCase()) {
        targetUpdated = {
          ...a,
          autoRelease: newAutoReleaseObj,
          updatedAt: new Date().toISOString(),
        };
        return targetUpdated;
      }
      return a;
    });

    if (targetUpdated) {
      saveAgreementToSharedStore(targetUpdated);
    } else {
      persistAgreements(updated);
    }
  };

  // Deposit Escrow Contract execution handler
  const depositEscrow = (id, txData) => {
    const target = agreements.find((a) => a.id.toLowerCase() === id.toLowerCase());
    const total = target ? (target.depositAmount || 0) + (target.utilityReserve || 0) : 0;

    advanceAgreementStatus(id, 'Deposit Locked', {
      type: 'ESCROW_DEPOSIT_LOCKED',
      actor: address || target?.tenantWallet,
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
  const activateLease = (id) => {
    const target = agreements.find((a) => a.id.toLowerCase() === id.toLowerCase());
    advanceAgreementStatus(id, 'Lease Active', {
      type: 'LEASE_ACTIVATED',
      actor: address || target?.landlordWallet,
      metadata: { leaseStart: target?.leaseStart, leaseEnd: target?.leaseEnd },
      updatedFields: { leaseActivatedAt: new Date().toISOString() },
    });
  };

  // Landlord-only End Lease State Handler
  const endLease = (id, actorAddress = '') => {
    const target = agreements.find((a) => a.id.toLowerCase() === id.toLowerCase());
    const actor = actorAddress || address || target?.landlordWallet;

    advanceAgreementStatus(id, 'Lease Ended', {
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
  const submitUtilitySettlement = (id, deductionsData) => {
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

    advanceAgreementStatus(id, 'Utility Settlement', {
      type: 'UTILITY_SETTLEMENT_SUBMITTED',
      actor: address || target?.landlordWallet,
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
  const approveRefund = (id) => {
    const target = agreements.find((a) => a.id.toLowerCase() === id.toLowerCase());
    const mockRefundHash = `9f71c42e88b1092a${Date.now().toString(16)}`;
    const deposit = target?.depositAmount || 0;
    const refundVal = target?.finalRefundAmount !== undefined ? target.finalRefundAmount : deposit;

    advanceAgreementStatus(id, 'Refund Completed', {
      type: 'REFUND_COMPLETED',
      actor: address || target?.tenantWallet,
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
  const raiseDispute = (id) => {
    const target = agreements.find((a) => a.id.toLowerCase() === id.toLowerCase());
    advanceAgreementStatus(id, 'Dispute Pending', {
      type: 'SETTLEMENT_DISPUTE_RAISED',
      actor: address || target?.tenantWallet,
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
  const updateAgreementStatus = (id, newStatus) => {
    advanceAgreementStatus(id, newStatus);
  };

  // Delete agreement
  const deleteAgreement = (id) => {
    deleteAgreementFromSharedStore(id);
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
