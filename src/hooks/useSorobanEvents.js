/**
 * useSorobanEvents.js — React hook for Level 2C Soroban Event Streaming
 *
 * Connects the sorobanEvents.js polling service to:
 *   - AgreementContext (Firebase sync for agreement state)
 *   - ToastContext (user notifications triggered ONLY by real blockchain events)
 *
 * Mount this hook inside a component that has access to both contexts.
 * It cleans up the polling loop automatically on unmount.
 */

import { useEffect, useRef, useCallback } from 'react';
import { startSorobanEventListener } from '../services/sorobanEvents';
import { useAgreements } from '../context/AgreementContext';
import { useToast } from '../context/ToastContext';
import { useWallet } from '../context/WalletContext';
import { saveAgreementToSharedStore, normalizeWallet } from '../services/sharedStore';
import { createLifecycleEvent } from '../utils/agreementLifecycle';

/**
 * @param {object} options
 * @param {boolean} [options.enabled=true]  Set to false to temporarily pause the listener.
 */
export function useSorobanEvents({ enabled = true } = {}) {
  const { agreements } = useAgreements();
  const { addToast } = useToast();
  const { address } = useWallet();

  // Keep a ref to the latest agreements list so the event handler closure
  // always sees fresh data without needing to be re-created on every render.
  const agreementsRef = useRef(agreements);
  useEffect(() => {
    agreementsRef.current = agreements;
  }, [agreements]);

  const handleEvent = useCallback(
    async (parsedEvent) => {
      const { type, agreementId, txHash, ledger, ledgerClosedAt, eventId } = parsedEvent;

      console.log(`[useSorobanEvents] Handling event: ${type} for ${agreementId}`);

      // Locate the agreement in the current list
      const agreement = agreementsRef.current.find((a) => a.id === agreementId);

      if (!agreement) {
        console.warn(
          `[useSorobanEvents] Event received for unknown agreement "${agreementId}". ` +
          `Ignoring (may belong to a different user).`
        );
        return;
      }

      const actor = normalizeWallet(address) || agreement.tenantWallet;
      const now = new Date().toISOString();

      if (type === 'ESCROW_LOCKED') {
        // Guard: don't re-apply if already locked
        if (agreement.status === 'Deposit Locked') {
          console.log(`[useSorobanEvents] Agreement ${agreementId} already "Deposit Locked". Skipping duplicate.`);
          return;
        }

        const total = (agreement.depositAmount || 0) + (agreement.utilityReserve || 0);

        const newEvt = createLifecycleEvent({
          agreementId,
          type: 'SOROBAN_EVENT_ESCROW_LOCKED',
          status: 'Deposit Locked',
          actor,
          txHash,
          metadata: {
            fundedAmount: total,
            ledger,
            ledgerClosedAt,
            eventId,
            note: 'Deposit locked confirmed by real Soroban blockchain event.',
          },
        });

        const updated = {
          ...agreement,
          status: 'Deposit Locked',
          fundedAmount: total,
          txHash,
          txLedger: ledger,
          depositConfirmedAt: ledgerClosedAt || now,
          sorobanEventId: eventId,
          updatedAt: now,
          eventHistory: [...(Array.isArray(agreement.eventHistory) ? agreement.eventHistory : []), newEvt],
        };

        await saveAgreementToSharedStore(updated);

        addToast({
          title: 'Escrow Deposit Confirmed On-Chain ✓',
          message: `Agreement ${agreementId}: deposit locked via Soroban event.`,
          type: 'success',
          duration: 8000,
        });

        console.log(`[useSorobanEvents] ✅ Agreement ${agreementId} → "Deposit Locked" (from blockchain event)`);

      } else if (type === 'ESCROW_RELEASED') {
        // Guard: don't re-apply if already released/refunded
        if (
          agreement.status === 'Refund Completed' ||
          agreement.status === 'Released'
        ) {
          console.log(`[useSorobanEvents] Agreement ${agreementId} already released. Skipping.`);
          return;
        }

        const newEvt = createLifecycleEvent({
          agreementId,
          type: 'SOROBAN_EVENT_ESCROW_RELEASED',
          status: 'Refund Completed',
          actor,
          txHash,
          metadata: {
            ledger,
            ledgerClosedAt,
            eventId,
            note: 'Escrow release confirmed by real Soroban blockchain event.',
          },
        });

        const updated = {
          ...agreement,
          status: 'Refund Completed',
          fundedAmount: 0,
          releaseTxHash: txHash,
          releaseTxLedger: ledger,
          releaseConfirmedAt: ledgerClosedAt || now,
          sorobanReleaseEventId: eventId,
          updatedAt: now,
          eventHistory: [...(Array.isArray(agreement.eventHistory) ? agreement.eventHistory : []), newEvt],
        };

        await saveAgreementToSharedStore(updated);

        addToast({
          title: 'Escrow Release Confirmed On-Chain ✓',
          message: `Agreement ${agreementId}: escrow released via Soroban event.`,
          type: 'success',
          duration: 8000,
        });

        console.log(`[useSorobanEvents] ✅ Agreement ${agreementId} → "Refund Completed" (from blockchain event)`);
      }
    },
    // address is included so actor is always current; agreements is handled via ref
    [address, addToast]
  );

  useEffect(() => {
    if (!enabled) return;

    const stop = startSorobanEventListener({
      onEvent: handleEvent,
      onError: (err) => {
        console.warn('[useSorobanEvents] RPC poll error (non-fatal):', err?.message || err);
      },
    });

    return () => {
      stop();
    };
  }, [enabled, handleEvent]);
}
