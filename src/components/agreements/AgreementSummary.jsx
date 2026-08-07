import React from 'react';
import { Card } from '../cards/Card';
import { calculateLeaseDuration } from '../../utils/duration';
import { Coins, ShieldCheck, Calendar, ArrowRightLeft } from 'lucide-react';

export const AgreementSummary = ({ agreement }) => {
  if (!agreement) return null;

  const deposit = agreement.depositAmount || 0;
  const reserve = agreement.utilityReserve || 0;
  const totalEscrow = deposit + reserve;
  const fundedAmount = 0; // Phase 5 default
  const remainingAmount = totalEscrow - fundedAmount;

  const leaseDurationStr = calculateLeaseDuration(agreement.leaseStart, agreement.leaseEnd);

  return (
    <Card className="space-y-5 bg-gradient-to-br from-card via-card to-surface border border-primary/30 shadow-stellar-glow">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <span className="text-caption font-semibold text-text-primary uppercase tracking-wider">
          Financial Summary
        </span>
        <span className="text-xs font-mono text-primary-glow font-bold">
          {agreement.id}
        </span>
      </div>

      <div className="space-y-3 text-body">
        <div className="flex justify-between items-center">
          <span className="text-text-secondary">Security Deposit:</span>
          <span className="font-bold text-text-primary">{deposit} XLM</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-text-secondary">Utility Reserve:</span>
          <span className="font-bold text-text-primary">{reserve} XLM</span>
        </div>

        <div className="pt-3 border-t border-border flex justify-between items-center text-h3">
          <span className="text-text-primary font-bold">Total Required Escrow</span>
          <span className="font-extrabold text-primary-glow">{totalEscrow} XLM</span>
        </div>
      </div>

      {/* Escrow Funding Progress Widget */}
      <div className="p-3.5 bg-background/80 rounded-2xl border border-border/80 space-y-2">
        <div className="flex justify-between items-center text-xs font-semibold">
          <span className="text-text-secondary">Escrow Funding Progress</span>
          <span className="text-warning">{fundedAmount} / {totalEscrow} XLM</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-surface rounded-full overflow-hidden border border-border/40">
          <div 
            className="h-full bg-gradient-to-r from-warning to-primary rounded-full transition-all"
            style={{ width: `${totalEscrow > 0 ? (fundedAmount / totalEscrow) * 100 : 0}%` }}
          />
        </div>

        <div className="flex justify-between text-[11px] text-text-muted font-mono pt-0.5">
          <span>{totalEscrow} XLM Required</span>
          <span className="text-text-primary font-semibold">{remainingAmount} XLM Remaining</span>
        </div>
      </div>

      {/* Estimated Refund Breakdown */}
      <div className="p-3.5 bg-success/10 rounded-2xl border border-success/30 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-text-muted uppercase tracking-wider block font-semibold">Estimated Tenant Refund</span>
          <span className="text-xs text-text-secondary">Returnable upon clean move-out</span>
        </div>
        <span className="text-h3 font-extrabold text-success">{deposit} XLM</span>
      </div>

      {/* Real Lease Duration */}
      <div className="p-3.5 bg-background/60 rounded-2xl border border-border/60 text-xs space-y-1.5 text-text-secondary">
        <div className="flex justify-between">
          <span>Lease Start:</span>
          <span className="text-text-primary font-medium">{agreement.leaseStart}</span>
        </div>
        <div className="flex justify-between">
          <span>Lease End:</span>
          <span className="text-text-primary font-medium">{agreement.leaseEnd}</span>
        </div>
        <div className="flex justify-between pt-1 border-t border-border/40 font-semibold">
          <span className="text-primary-glow">Real Lease Duration:</span>
          <span className="text-text-primary font-bold">{leaseDurationStr}</span>
        </div>
      </div>
    </Card>
  );
};
