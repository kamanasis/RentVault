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
import { evaluateAgreementRole } from '../../utils/role';
import { CheckCircle2, AlertTriangle, UserCheck, Lock, ShieldCheck, Zap, Loader2 } from 'lucide-react';

export const TenantReviewPanel = ({ agreement }) => {
  const { approveRefund, tenantApproveSettlement, raiseSettlementDispute } = useAgreements();
  const { address, refreshBalance } = useWallet();

  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [txStage, setTxStage] = useState('idle'); // 'idle' | 'preparing' | 'signing' | 'submitting' | 'confirming' | 'success' | 'failed'
  const [errorMessage, setErrorMessage] = useState('');
  const [txResult, setTxResult] = useState(null);

  if (!agreement) return null;

  const roleInfo = evaluateAgreementRole(address, agreement);

  const isDisputed = 
    agreement.status === 'dispute_open' || 
    agreement.status === 'dispute_landlord_response' || 
    agreement.status === 'dispute_tenant_response' || 
    agreement.status === 'Dispute Pending';

  const isResolved = agreement.status === 'dispute_resolved';
  const isApproved = agreement.status === 'Settlement Approved';

  // Tenant approves the settlement deductions
  const handleTenantApprove = async () => {
    if (isDisputed || isApproving) return;

    setIsApproving(true);
    setErrorMessage('');
    try {
      await tenantApproveSettlement(agreement.id);
    } catch (err) {
      console.error('[TenantReviewPanel] Approve error:', err);
      setErrorMessage(err?.message || 'Failed to approve settlement deductions.');
    } finally {
      setIsApproving(false);
    }
  };

  // Landlord executes on-chain release in Soroban (authorized by smart contract)
  const handleLandlordRelease = async () => {
    if (isDisputed) return;

    setTxStage('preparing');
    setErrorMessage('');

    try {
      const res = await releaseEscrowContract(
        {
          agreementId: agreement.id,
          tenantAddress: agreement.tenantWallet,
          landlordAddress: agreement.landlordWallet,
          refundAmount: agreement.finalRefundAmount !== undefined ? agreement.finalRefundAmount : agreement.depositAmount,
        },
        (stage) => setTxStage(stage)
      );

      console.log('[TenantReviewPanel] Escrow release transaction confirmed:', res);
      setTxResult(res);

      await approveRefund(agreement.id, res);
      await refreshBalance();

      setTxStage('success');
    } catch (err) {
      console.error('[TenantReviewPanel Release Error]:', err);
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
        onTimerExpire={roleInfo.isLandlord ? handleLandlordRelease : handleTenantApprove} 
        isDisputed={isDisputed}
        isLandlord={roleInfo.isLandlord}
        agreement={agreement}
      />

      <RefundBreakdown agreement={agreement} />

      {/* Settlement Review Controls */}
      <Card className="space-y-4 border border-border/80">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <UserCheck className="w-5 h-5 text-success" />
            <h3 className="text-h3 text-text-primary">Settlement Review & Release</h3>
          </div>
          <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
            isDisputed 
              ? 'text-error bg-error/15 border-error/30' 
              : isApproved
              ? 'text-primary-glow bg-primary/15 border-primary/30'
              : isResolved
              ? 'text-success bg-success/15 border-success/30'
              : 'text-warning bg-warning/10 border-warning/30'
          }`}>
            {isDisputed 
              ? 'Dispute Active' 
              : isApproved 
              ? 'Settlement Approved' 
              : isResolved 
              ? 'Dispute Resolved' 
              : 'Review Pending'}
          </span>
        </div>

        {errorMessage && (
          <div className="p-3 bg-error/15 border border-error/40 rounded-xl text-xs text-error font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {isDisputed ? (
          <div className="p-4 bg-error/10 border border-error/30 rounded-2xl text-error text-caption space-y-2">
            <div className="flex items-center justify-between font-bold text-body">
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Active Settlement Dispute
              </span>
              <span className="text-xs bg-error/20 px-2.5 py-0.5 rounded-full font-mono">Release Locked</span>
            </div>
            <p className="text-text-secondary text-xs">
              Refund execution is locked until landlord and tenant resolve the dispute. Use the Dispute Resolution Workspace below to review response threads.
            </p>
            <div className="pt-2 flex justify-end">
              <button
                disabled
                className="px-4 py-2 rounded-xl bg-surface border border-border text-text-muted text-xs font-semibold flex items-center gap-1.5 cursor-not-allowed opacity-80"
              >
                <Lock className="w-4 h-4 text-error" /> Escrow Locked — Active Dispute
              </button>
            </div>
          </div>
        ) : isApproved && !roleInfo.isLandlord ? (
          /* Tenant View after Approval */
          <div className="p-4 bg-primary/10 border border-primary/30 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-primary-glow font-bold text-body">
              <ShieldCheck className="w-5 h-5" /> Settlement Approved by Tenant
            </div>
            <p className="text-text-secondary text-xs">
              You have approved the utility deductions. The landlord can now execute the final on-chain release transaction from their Freighter wallet to transfer your refund.
            </p>
          </div>
        ) : roleInfo.isLandlord ? (
          /* Landlord View */
          <div className="space-y-4 pt-1">
            <div className="p-3.5 bg-background/80 rounded-2xl border border-border/80 text-xs text-text-secondary">
              {isApproved ? (
                <span className="text-success font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Tenant has approved the settlement deductions. Ready for Soroban release.
                </span>
              ) : isResolved ? (
                <span className="text-success font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Dispute resolved. Ready to execute on-chain escrow release.
                </span>
              ) : (
                <span>Tenant review is currently pending. You may execute release once terms are agreed.</span>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <PrimaryButton
                icon={Zap}
                onClick={handleLandlordRelease}
                disabled={txStage !== 'idle' && txStage !== 'failed'}
                className="w-full sm:w-auto min-w-[220px]"
              >
                {txStage === 'preparing' || txStage === 'signing' || txStage === 'submitting' || txStage === 'confirming'
                  ? 'Releasing on Soroban...'
                  : 'Execute Escrow Release on Soroban'}
              </PrimaryButton>
            </div>
          </div>
        ) : (
          /* Tenant View before Approval */
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
              onClick={handleTenantApprove}
              disabled={isApproving}
              className="w-full sm:w-auto bg-success hover:bg-emerald-600 border-success min-w-[200px]"
            >
              {isApproving ? 'Approving Deductions...' : 'Approve Settlement Deductions'}
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
        title="Executing Escrow Release"
        successTitle="Escrow Refund Released Successfully"
        successDescription="Deposit refund has been transferred and confirmed on Stellar Testnet."
        onRetry={handleLandlordRelease}
        onClose={() => setTxStage('idle')}
      />
    </div>
  );
};
