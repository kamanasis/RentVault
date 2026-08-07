import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

export const AutoReleaseTimer = ({ onTimerExpire, isDisputed = false }) => {
  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    if (isDisputed) return;

    if (secondsLeft <= 0) {
      if (onTimerExpire) onTimerExpire();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, isDisputed, onTimerExpire]);

  const formattedSeconds = String(secondsLeft).padStart(2, '0');

  if (isDisputed) {
    return (
      <div className="p-4 bg-error/15 border border-error/40 rounded-2xl flex items-center justify-between text-error font-mono text-caption">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-sans font-semibold">Auto-Release Frozen</span>
        </div>
        <span>Dispute Pending</span>
      </div>
    );
  }

  return (
    <div 
      aria-live="polite"
      className="p-4 bg-gradient-to-r from-primary/20 via-card to-card border border-primary/40 rounded-2xl flex items-center justify-between shadow-stellar-glow"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-primary/20 border border-primary/50 text-primary-glow flex items-center justify-center">
          <Clock className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <span className="text-caption font-semibold text-text-primary block">Automatic Escrow Refund Timer</span>
          <span className="text-xs text-text-secondary">Auto-executes on Stellar Testnet upon countdown completion</span>
        </div>
      </div>

      <div className="text-right">
        <div className="text-h2 font-mono font-extrabold text-primary-glow tracking-widest">
          00:{formattedSeconds}
        </div>
        <span className="text-[10px] text-text-muted uppercase tracking-wider block">Auto-Release</span>
      </div>
    </div>
  );
};
