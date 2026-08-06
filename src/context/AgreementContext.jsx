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
    leaseStart: '2026-06-01',
    leaseEnd: '2027-05-31',
    notes: 'Escrow deposit locked on Stellar Testnet.',
    status: 'Deposit Locked',
    createdAt: '2026-05-20T14:30:00.000Z',
  },
];

export const AgreementProvider = ({ children }) => {
  const { address } = useWallet();
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Restore agreements from localStorage or seed initial demo data
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setAgreements(parsed);
      } else {
        setAgreements(INITIAL_DEMO_AGREEMENTS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_AGREEMENTS));
      }
    } catch (err) {
      console.warn('[AgreementContext] localStorage load warning:', err);
      setAgreements(INITIAL_DEMO_AGREEMENTS);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync agreements to localStorage whenever updated
  const persistAgreements = (newAgreements) => {
    setAgreements(newAgreements);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newAgreements));
    } catch (err) {
      console.error('[AgreementContext] localStorage save error:', err);
    }
  };

  // Create new agreement with auto-generated ID (e.g. RV-2026-003)
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
      leaseStart: formData.leaseStart,
      leaseEnd: formData.leaseEnd,
      notes: formData.notes || '',
      status: 'Awaiting Deposit', // Default status for Phase 5
      createdAt: new Date().toISOString(),
    };

    const updated = [newAgreement, ...agreements];
    persistAgreements(updated);
    console.log('[AgreementContext] Created new agreement:', newAgreement);
    return newAgreement;
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
