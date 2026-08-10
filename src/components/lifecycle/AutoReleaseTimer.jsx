import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, ShieldCheck, Plus, Zap } from 'lucide-react';
import { useAgreements } from '../../context/AgreementContext';
import { formatAutoReleaseCountdown, getAutoReleasePolicyLabel } from '../../utils/autoRelease';

export const AutoReleaseTimer = ({ agreement, onTimerExpire, isDisputed = false, isLandlord = false }) => {
  const { updateAutoReleasePolicy } = useAgreements();

  const autoReleaseObj = agreement?.autoRelease || {
    preset: '7_days',
    duration: 7,
    unit: 'days',
    milliseconds: 7 * 24 * 60 * 60 * 1000,
  };

  // Base timestamp from settlement submission or lease end date
  const startTimestamp = agreement?.settlementSubmittedAt
    ? new Date(agreement.settlementSubmittedAt).getTime()
    : agreement?.leaseEndedAt
    ? new Date(agreement.leaseEndedAt).getTime()
    : new Date(agreement?.createdAt || Date.now()).getTime();

  const targetEndTimestamp = startTimestamp + (autoReleaseObj.milliseconds || 60000);

  const [msRemaining, setMsRemaining] = useState(() => Math.max(0, targetEndTimestamp - Date.now()));

  useEffect(() => {
    if (isDisputed) return;

    const calculateRemaining = () => {
      const rem = Math.max(0, targetEndTimestamp - Date.now());
      setMsRemaining(rem);

      if (rem <= 0 && onTimerExpire) {
        onTimerExpire();
      }
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000);

    return () => clearInterval(interval);
  }, [targetEndTimestamp, isDisputed, onTimerExpire]);

  const policyLabel = getAutoReleasePolicyLabel(autoReleaseObj);
  const scheduledReleaseDate = new Date(targetEndTimestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleExtendPolicy = () => {
    if (!agreement) return;
    const currentMs = autoReleaseObj.milliseconds || 86400000;
    const extendedMs = currentMs + (24 * 60 * 60 * 1000); // Add 24 hours
    const updatedObj = {
      ...autoReleaseObj,
      duration: (autoReleaseObj.duration || 1) + 1,
      milliseconds: extendedMs,
    };
    updateAutoReleasePolicy(agreement.id, updatedObj);
  };

  if (isDisputed) {
    return (
      <div className="p-4 bg-error/15 border border-error/40 rounded-2xl flex items-center justify-between text-error font-mono text-caption">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-sans font-semibold">Auto-Release Policy Frozen</span>
        </div>
        <span>Dispute Pending</span>
      </div>
    );
  }

  return (
    <div 
      aria-live="polite"
      className="p-5 bg-gradient-to-r from-primary/20 via-card to-card border border-primary/40 rounded-3xl space-y-4 shadow-stellar-glow"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-primary/20 border border-primary/50 text-primary-glow flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-caption font-semibold text-text-primary">Auto-Release Policy Status</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary-glow">
                {policyLabel}
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              Scheduled Release: <span className="font-mono text-text-primary font-medium">{scheduledReleaseDate}</span>
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-h2 font-mono font-extrabold text-primary-glow tracking-wide">
            {formatAutoReleaseCountdown(msRemaining)}
          </div>
          <span className="text-[10px] text-text-muted uppercase tracking-wider block font-medium">Auto-Release Countdown</span>
        </div>
      </div>

      {/* Landlord Extension Controls */}
      {isLandlord && (
        <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
          <span className="text-text-muted font-sans">Policy Controls (Landlord Only):</span>
          <button
            onClick={handleExtendPolicy}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface hover:bg-surface-hover border border-border text-primary-glow font-semibold transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Extend Timer (+24h)
          </button>
        </div>
      )}
    </div>
  );
};
