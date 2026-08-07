import React from 'react';
import { Card } from '../cards/Card';
import { PrimaryButton } from '../buttons/PrimaryButton';
import { SecondaryButton } from '../buttons/SecondaryButton';
import { AutoReleaseTimer } from './AutoReleaseTimer';
import { RefundBreakdown } from './RefundBreakdown';
import { useAgreements } from '../../context/AgreementContext';
import { CheckCircle2, AlertTriangle, UserCheck, ShieldCheck } from 'lucide-react';

export const TenantReviewPanel = ({ agreement }) => {
  const { approveRefund, raiseDispute } = useAgreements();

  if (!agreement) return null;

  const isDisputed = agreement.status === 'Dispute Pending';

  const handleApprove = () => {
    approveRefund(agreement.id);
  };

  const handleDispute = () => {
    raiseDispute(agreement.id);
  };

  return (
    <div className="space-y-6">
      {/* 60-Second Auto-Release Timer */}
      <AutoReleaseTimer 
        onTimerExpire={handleApprove} 
        isDisputed={isDisputed}
      />

      <RefundBreakdown agreement={agreement} />

      {/* Tenant Action Controls */}
      <Card className="space-y-4 border border-border/80">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <UserCheck className="w-5 h-5 text-success" />
            <h3 className="text-h3 text-text-primary">Tenant Settlement Review</h3>
          </div>
          <span className="text-xs font-mono font-bold text-success bg-success/10 border border-success/30 px-3 py-1 rounded-full">
            Tenant Action Required
          </span>
        </div>

        {isDisputed ? (
          <div className="p-4 bg-error/10 border border-error/30 rounded-2xl text-error text-caption space-y-1">
            <div className="flex items-center gap-2 font-bold text-body">
              <AlertTriangle className="w-5 h-5" />
              <span>Escrow Dispute Pending</span>
            </div>
            <p>Escrow funds are frozen on Soroban smart contract pending manual resolution between parties.</p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <SecondaryButton 
              icon={AlertTriangle} 
              onClick={handleDispute}
              className="w-full sm:w-auto text-error border-error/40 hover:bg-error/10"
            >
              Raise Settlement Dispute
            </SecondaryButton>

            <PrimaryButton 
              icon={CheckCircle2} 
              onClick={handleApprove}
              className="w-full sm:w-auto bg-success hover:bg-emerald-600 border-success min-w-[200px]"
            >
              Approve Refund & Release
            </PrimaryButton>
          </div>
        )}
      </Card>
    </div>
  );
};
