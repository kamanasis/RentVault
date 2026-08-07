import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/cards/Card';
import { AgreementStatusBadge } from '../components/agreements/AgreementStatusBadge';
import { RoleBadge } from '../components/roles/RoleBadge';
import { UtilitySettlementForm } from '../components/lifecycle/UtilitySettlementForm';
import { TenantReviewPanel } from '../components/lifecycle/TenantReviewPanel';
import { RefundConfirmationCard } from '../components/lifecycle/RefundConfirmationCard';
import { SecondaryButton } from '../components/buttons/SecondaryButton';
import { useAgreements } from '../context/AgreementContext';
import { useWallet } from '../context/WalletContext';
import { evaluateAgreementRole } from '../utils/role';
import { ArrowLeft, Zap, ShieldCheck } from 'lucide-react';

export const Settlement = () => {
  const { id = 'RV-2026-001' } = useParams();
  const navigate = useNavigate();
  const { getAgreementById } = useAgreements();
  const { address } = useWallet();

  const agreement = getAgreementById(id);

  if (!agreement) {
    return (
      <PageContainer className="max-w-3xl text-center py-16">
        <Card className="p-8 space-y-4">
          <h2 className="text-h2 text-text-primary">Agreement Not Found</h2>
          <SecondaryButton icon={ArrowLeft} onClick={() => navigate('/agreements')}>
            Back to Agreements
          </SecondaryButton>
        </Card>
      </PageContainer>
    );
  }

  const roleInfo = evaluateAgreementRole(address, agreement);

  return (
    <PageContainer className="max-w-4xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
        <div>
          <button
            onClick={() => navigate(`/agreement/${agreement.id}`)}
            className="inline-flex items-center gap-1.5 text-caption font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Agreement Details
          </button>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-h1 text-text-primary">Utility Settlement & Release Portal</h1>
            <span className="text-xs font-mono font-bold text-primary-glow bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
              {agreement.id}
            </span>
            <AgreementStatusBadge status={agreement.status} />
            <RoleBadge role={roleInfo.role} />
          </div>
          <p className="text-body text-text-secondary mt-1">{agreement.propertyName} — {agreement.propertyAddress}</p>
        </div>
      </div>

      {agreement.status === 'Refund Completed' ? (
        <RefundConfirmationCard agreement={agreement} />
      ) : roleInfo.isLandlord && (agreement.status === 'Lease Ended' || agreement.status === 'Deposit Locked' || agreement.status === 'Lease Active') ? (
        <UtilitySettlementForm agreement={agreement} />
      ) : (
        <TenantReviewPanel agreement={agreement} />
      )}
    </PageContainer>
  );
};
