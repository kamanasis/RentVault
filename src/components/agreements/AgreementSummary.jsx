import React from 'react';
import { Card } from '../cards/Card';
import { Coins, ShieldCheck, Calendar, FileText } from 'lucide-react';

export const AgreementSummary = ({ agreement }) => {
  if (!agreement) return null;

  const totalEscrow = (agreement.depositAmount || 0) + (agreement.utilityReserve || 0);

  // Compute duration in months
  const calcDurationMonths = (startStr, endStr) => {
    if (!startStr || !endStr) return '12 Months';
    const start = new Date(startStr);
    const end = new Date(endStr);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return `${months > 0 ? months : 12} Months`;
  };

  return (
    <Card className="space-y-4 bg-gradient-to-br from-card via-card to-surface border border-primary/30 shadow-stellar-glow">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <span className="text-caption font-semibold text-text-primary uppercase tracking-wider">
          Financial Summary
        </span>
        <span className="text-xs font-mono text-primary-glow font-bold">
          {agreement.id}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center text-body">
          <span className="text-text-secondary">Security Deposit:</span>
          <span className="font-bold text-text-primary">{agreement.depositAmount} XLM</span>
        </div>

        <div className="flex justify-between items-center text-body">
          <span className="text-text-secondary">Utility Reserve:</span>
          <span className="font-bold text-text-primary">{agreement.utilityReserve} XLM</span>
        </div>

        <div className="pt-3 border-t border-border flex justify-between items-center text-h2">
          <span className="text-text-primary font-bold">Total Required Escrow</span>
          <span className="font-extrabold text-primary-glow">{totalEscrow} XLM</span>
        </div>
      </div>

      <div className="p-3.5 bg-background/60 rounded-2xl border border-border/60 text-xs space-y-1.5 text-text-secondary">
        <div className="flex justify-between">
          <span>Lease Period:</span>
          <span className="text-text-primary font-medium">{agreement.leaseStart} to {agreement.leaseEnd}</span>
        </div>
        <div className="flex justify-between">
          <span>Calculated Duration:</span>
          <span className="text-text-primary font-medium">{calcDurationMonths(agreement.leaseStart, agreement.leaseEnd)}</span>
        </div>
      </div>
    </Card>
  );
};
