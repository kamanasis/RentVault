import React from 'react';
import { motion } from 'framer-motion';
import { Coins, Lock, CheckCircle2 } from 'lucide-react';

export const FundingProgress = ({ 
  requiredAmount = 0, 
  fundedAmount = 0, 
  status = 'Awaiting Deposit' 
}) => {
  const remainingAmount = Math.max(0, requiredAmount - fundedAmount);
  const percentage = requiredAmount > 0 ? Math.min(100, Math.round((fundedAmount / requiredAmount) * 100)) : 0;
  const isFullyFunded = fundedAmount >= requiredAmount && requiredAmount > 0;

  return (
    <div className="p-4 bg-background/80 rounded-2xl border border-border/80 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
            isFullyFunded ? 'bg-success/15 border-success/30 text-success' : 'bg-primary/10 border-primary/30 text-primary-glow'
          }`}>
            {isFullyFunded ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          </div>
          <div>
            <span className="text-caption font-semibold text-text-primary block">Escrow Funding Progress</span>
            <span className="text-xs text-text-muted">Soroban Smart Contract Vault</span>
          </div>
        </div>

        <div className="text-right">
          <span className={`text-h3 font-extrabold ${isFullyFunded ? 'text-success' : 'text-primary-glow'}`}>
            {percentage}%
          </span>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full h-3 bg-surface rounded-full overflow-hidden border border-border/60 relative">
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${
            isFullyFunded 
              ? 'bg-gradient-to-r from-success via-success to-emerald-400 shadow-sm' 
              : 'bg-gradient-to-r from-warning via-primary to-primary-glow'
          }`}
        />
      </div>

      {/* Numerical Breakdown */}
      <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono text-xs">
        <div className="p-2 bg-surface/50 rounded-xl border border-border/40">
          <span className="text-[10px] text-text-muted block font-sans">Required</span>
          <span className="font-bold text-text-primary">{requiredAmount} XLM</span>
        </div>
        <div className="p-2 bg-surface/50 rounded-xl border border-border/40">
          <span className="text-[10px] text-text-muted block font-sans">Funded</span>
          <span className={`font-bold ${fundedAmount > 0 ? 'text-success' : 'text-text-muted'}`}>{fundedAmount} XLM</span>
        </div>
        <div className="p-2 bg-surface/50 rounded-xl border border-border/40">
          <span className="text-[10px] text-text-muted block font-sans">Remaining</span>
          <span className={`font-bold ${remainingAmount === 0 ? 'text-success' : 'text-warning'}`}>{remainingAmount} XLM</span>
        </div>
      </div>
    </div>
  );
};
