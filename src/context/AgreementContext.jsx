import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useWallet } from './WalletContext';

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
  },
];

/**
 * Self-healing status migration:
 * Automatically advances 'Lease Active' agreements to 'Lease Ended' if leaseEnd date has passed.
 * Never deletes or hides agreements from history.
 */
const checkAndMigrateLeaseStatus = (agreementsList = []) => {
  let hasChanges = false;
  const now = new Date();

  const migrated = agreementsList.map((a) => {
    if (a.status === 'Lease Active' && a.leaseEnd) {
      const endDate = new Date(a.leaseEnd);
      // Compare with end of day for leaseEnd
      endDate.setHours(23, 59, 59, 999);
      if (endDate < now) {
        hasChanges = true;
        return {
          ...a,
          status: 'Lease Ended',
          leaseEndedAt: a.leaseEndedAt || new Date().toISOString(),
        };
      }
    }
    return a;
  });

  return { migrated, hasChanges };
};

export const AgreementProvider = ({ children }) => {
  const { address } = useWallet();
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Restore agreements from localStorage and apply self-healing migration
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

      const { migrated, hasChanges } = checkAndMigrateLeaseStatus(initialList);
      setAgreements(migrated);
      if (hasChanges || !saved) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      }
    } catch (err) {
      console.warn('[AgreementContext] localStorage load warning:', err);
      const { migrated } = checkAndMigrateLeaseStatus(INITIAL_DEMO_AGREEMENTS);
      setAgreements(migrated);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync agreements to state and localStorage
  const persistAgreements = (newAgreements) => {
    const { migrated } = checkAndMigrateLeaseStatus(newAgreements);
    setAgreements(migrated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    } catch (err) {
      console.error('[AgreementContext] localStorage save error:', err);
    }
  };

  // Create new agreement
  const createAgreement = (formData) => {
    const nextIndex = agreements.length + 1;
    const padIndex = String(nextIndex).padStart(3, '0');
    const newId = `RV-2026-${padIndex}`;

    const newAgreement = {
      id: newId,
      propertyName: formData.propertyName,
      propertyAddress: formData.propertyAddress,
      landlordWallet: address || 'GB7X42F098A190B38812TESTNETRENTVAULTKEY99',
      tenantWallet: formData.tenantWallet,
      depositAmount: parseFloat(formData.depositAmount) || 0,
      utilityReserve: parseFloat(formData.utilityReserve) || 0,
      fundedAmount: 0,
      leaseStart: formData.leaseStart,
      leaseEnd: formData.leaseEnd,
      notes: formData.notes || '',
      status: 'Awaiting Deposit',
      createdAt: new Date().toISOString(),
    };

    const updated = [newAgreement, ...agreements];
    persistAgreements(updated);
    return newAgreement;
  };

  // Update agreement terms
  const updateAgreement = (id, updatedFields) => {
    const updated = agreements.map((a) => {
      if (a.id.toLowerCase() === id.toLowerCase()) {
        return {
          ...a,
          ...updatedFields,
          depositAmount: updatedFields.depositAmount !== undefined ? parseFloat(updatedFields.depositAmount) : a.depositAmount,
          utilityReserve: updatedFields.utilityReserve !== undefined ? parseFloat(updatedFields.utilityReserve) : a.utilityReserve,
          updatedAt: new Date().toISOString(),
        };
      }
      return a;
    });

    persistAgreements(updated);
  };

  // Deposit Escrow Contract execution handler
  const depositEscrow = (id, txData) => {
    const updated = agreements.map((a) => {
      if (a.id.toLowerCase() === id.toLowerCase()) {
        const total = (a.depositAmount || 0) + (a.utilityReserve || 0);
        return {
          ...a,
          status: 'Deposit Locked',
          fundedAmount: total,
          txHash: txData.hash,
          txLedger: txData.ledger,
          contractId: txData.contractId,
          depositConfirmedAt: txData.timestamp || new Date().toISOString(),
        };
      }
      return a;
    });

    persistAgreements(updated);
  };

  // Activate Lease State
  const activateLease = (id) => {
    const updated = agreements.map((a) => 
      a.id.toLowerCase() === id.toLowerCase() ? { ...a, status: 'Lease Active', leaseActivatedAt: new Date().toISOString() } : a
    );
    persistAgreements(updated);
  };

  // End Lease State
  const endLease = (id) => {
    const updated = agreements.map((a) => 
      a.id.toLowerCase() === id.toLowerCase() ? { ...a, status: 'Lease Ended', leaseEndedAt: new Date().toISOString() } : a
    );
    persistAgreements(updated);
  };

  // Submit Landlord Utility Settlement
  const submitUtilitySettlement = (id, deductionsData) => {
    const updated = agreements.map((a) => {
      if (a.id.toLowerCase() === id.toLowerCase()) {
        const deposit = a.depositAmount || 0;
        const reserve = a.utilityReserve || 0;
        const totalEscrow = deposit + reserve;

        const electricity = parseFloat(deductionsData.electricity || 0);
        const water = parseFloat(deductionsData.water || 0);
        const maintenance = parseFloat(deductionsData.maintenance || 0);
        const other = parseFloat(deductionsData.other || 0);
        const totalDeduction = electricity + water + maintenance + other;

        const finalRefundAmount = Math.max(0, totalEscrow - totalDeduction);

        return {
          ...a,
          status: 'Utility Settlement',
          utilityDeductions: { electricity, water, maintenance, other, notes: deductionsData.notes || '' },
          totalDeduction,
          finalRefundAmount,
          settlementSubmittedAt: new Date().toISOString(),
        };
      }
      return a;
    });

    persistAgreements(updated);
  };

  // Tenant Approve Refund
  const approveRefund = (id) => {
    const mockRefundHash = `9f71c42e88b1092a${Date.now().toString(16)}`;
    const updated = agreements.map((a) => {
      if (a.id.toLowerCase() === id.toLowerCase()) {
        const deposit = a.depositAmount || 0;
        const reserve = a.utilityReserve || 0;
        const refundVal = a.finalRefundAmount !== undefined ? a.finalRefundAmount : deposit;

        return {
          ...a,
          status: 'Refund Completed',
          finalRefundAmount: refundVal,
          refundApprovedAt: new Date().toISOString(),
          refundTxHash: mockRefundHash,
          fundedAmount: 0, // Escrow unlocked upon refund completion
        };
      }
      return a;
    });

    persistAgreements(updated);
  };

  // Tenant Raise Dispute
  const raiseDispute = (id) => {
    const updated = agreements.map((a) => 
      a.id.toLowerCase() === id.toLowerCase() ? { ...a, status: 'Dispute Pending', disputedAt: new Date().toISOString() } : a
    );
    persistAgreements(updated);
  };

  // Get specific agreement by ID
  const getAgreementById = useCallback((id) => {
    if (!id) return null;
    return agreements.find((a) => a.id.toLowerCase() === id.toLowerCase()) || null;
  }, [agreements]);

  // Update agreement status
  const updateAgreementStatus = (id, newStatus) => {
    const updated = agreements.map((a) => 
      a.id.toLowerCase() === id.toLowerCase() ? { ...a, status: newStatus } : a
    );
    persistAgreements(updated);
  };

  // Delete agreement
  const deleteAgreement = (id) => {
    const updated = agreements.filter((a) => a.id.toLowerCase() !== id.toLowerCase());
    persistAgreements(updated);
  };

  return (
    <AgreementContext.Provider
      value={{
        agreements,
        loading,
        createAgreement,
        updateAgreement,
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
