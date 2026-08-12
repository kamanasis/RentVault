import React, { useState } from 'react';
import { Card } from '../cards/Card';
import { PrimaryButton } from '../buttons/PrimaryButton';
import { SecondaryButton } from '../buttons/SecondaryButton';
import { AutoReleaseTimer } from './AutoReleaseTimer';
import { RefundBreakdown } from './RefundBreakdown';
import { RaiseDisputeModal } from './RaiseDisputeModal';
import { TransactionProgress } from '../wallet/TransactionProgress';
import { useAgreements } from '../../context/AgreementContext';
import { useWallet } from '../../context/WalletContext';
import { releaseEscrowContract } from '../../services/soroban';
import { CheckCircle2, AlertTriangle, UserCheck, Lock } from 'lucide-react';

export const TenantReviewPanel = ({ agreement }) => {
  const { approveRefund, raiseSettlementDispute } = useAgreements();
  const { address, refreshBalance } = useWallet();

  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [txStage, setTxStage] = useState('idle'); // 'idle' | 'preparing' | 'signing' | 'submitting' | 'confirming' | 'success' | 'failed'
  const [errorMessage, setErrorMessage] = useState('');
  const [txResult, setTxResult] = useState(null);

  if (!agreement) return null;

  const isDisputed = 
    agreement.status === 'dispute_open' || 
    agreement.status === 'dispute_landlord_response' || 
    agreement.status === 'dispute_tenant_response' || 
    agreement.status === 'Dispute Pending';

  const isResolved = agreement.status === 'dispute_resolved';

  const handleApprove = async () => {
    if (isDisputed) return;

    setTxStage('preparing');
    setErrorMessage('');

    try {
      const res = await releaseEscrowContract(
        {
          agreementId: agreement.id,
          tenantAddress: agreement.tenantWallet,
          landlordAddress: agreement.landlordWallet,
          refundAmount: agreement.finalRefundAmount || agreement.depositAmount,
        },
        (stage) => setTxStage(stage)
      );

      console.log('[TenantReviewPanel] Refund release transaction confirmed:', res);
      setTxResult(res);

      await approveRefund(agreement.id);
      await refreshBalance();

      setTxStage('success');
    } catch (err) {
      console.error('[TenantReviewPanel Error]:', err);
      setErrorMessage(err?.message || 'Failed to submit Soroban release transaction.');
      setTxStage('failed');
    }
  };

  const handleDisputeSubmit = async (disputeData) => {
    await raiseSettlementDispute(agreement.id, disputeData);
  };

  return (
    <div className="space-y-6">
      {/* Auto-Release Timer (Pauses during dispute) */}
      <AutoReleaseTimer 
        onTimerExpire={handleApprove} 
        isDisputed={isDisputed}
        agreement={agreement}
      />

      <RefundBreakdown agreement={agreement} />

      {/* Tenant Action Controls */}
      <Card className="space-y-4 border border-border/80">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <UserCheck className="w-5 h-5 text-success" />
            <h3 className="text-h3 text-text-primary">Tenant Settlement Review</h3>
          </div>
          <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
            isDisputed 
              ? 'text-error bg-error/15 border-error/30' 
              : isResolved
              ? 'text-success bg-success/15 border-success/30'
              : 'text-success bg-success/10 border-success/30'
          }`}>
            {isDisputed ? 'Dispute Active' : isResolved ? 'Dispute Resolved' : 'Tenant Action Required'}
          </span>
        </div>

        {isDisputed ? (
          <div className="p-4 bg-error/10 border border-error/30 rounded-2xl text-error text-caption space-y-2">
            <div className="flex items-center justify-between font-bold text-body">
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Active Settlement Dispute
              </span>
              <span className="text-xs bg-error/20 px-2.5 py-0.5 rounded-full font-mono">Refund Locked</span>
            </div>
            <p className="text-text-secondary text-xs">
              Refund execution is locked until landlord and tenant resolve the dispute. Use the Dispute Resolution Workspace below to review response threads.
            </p>
            <div className="pt-2 flex justify-end">
              <button
                disabled
                className="px-4 py-2 rounded-xl bg-surface border border-border text-text-muted text-xs font-semibold flex items-center gap-1.5 cursor-not-allowed opacity-80"
              >
                <Lock className="w-4 h-4 text-error" /> Refund Locked — Active Dispute
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            {!isResolved && (
              <SecondaryButton 
                icon={AlertTriangle} 
                onClick={() => setIsDisputeModalOpen(true)}
                className="w-full sm:w-auto text-error border-error/40 hover:bg-error/10"
              >
                Raise Settlement Dispute
              </SecondaryButton>
            )}

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

      {/* Raise Dispute Modal */}
      <RaiseDisputeModal
        isOpen={isDisputeModalOpen}
        onClose={() => setIsDisputeModalOpen(false)}
        onSubmit={handleDisputeSubmit}
        agreement={agreement}
      />

      {/* Transaction Progress Modal */}
      <TransactionProgress
        stage={txStage}
        errorMessage={errorMessage}
        txResult={txResult}
        onRetry={handleApprove}
        onClose={() => setTxStage('idle')}
      />
    </div>
  );
};
