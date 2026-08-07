import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/cards/Card';
import { AgreementStatusBadge } from '../components/agreements/AgreementStatusBadge';
import { AgreementTimeline } from '../components/agreements/AgreementTimeline';
import { AgreementActivityTimeline } from '../components/lifecycle/AgreementActivityTimeline';
import { SecondaryButton } from '../components/buttons/SecondaryButton';
import { useAgreements } from '../context/AgreementContext';
import { ArrowLeft, Clock, AlertCircle } from 'lucide-react';

export const Timeline = () => {
  const { id = 'RV-2026-001' } = useParams();
  const navigate = useNavigate();
  const { getAgreementById } = useAgreements();

  const agreement = getAgreementById(id);

  if (!agreement) {
    return (
      <PageContainer className="max-w-3xl text-center py-16">
        <Card className="space-y-6 p-8">
          <div className="w-16 h-16 rounded-3xl bg-error/10 border border-error/30 text-error flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-h2 text-text-primary">Agreement Not Found</h2>
            <p className="text-body text-text-secondary">
              No digital rental agreement exists for ID <code className="font-mono text-error">{id}</code>.
            </p>
          </div>
          <SecondaryButton icon={ArrowLeft} onClick={() => navigate('/agreements')}>
            Back to Agreement Dashboard
          </SecondaryButton>
        </Card>
      </PageContainer>
    );
  }

  const deposit = agreement.depositAmount || 0;
  const reserve = agreement.utilityReserve || 0;
  const totalEscrow = deposit + reserve;

  return (
    <PageContainer className="max-w-4xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
        <div>
          <button
            onClick={() => navigate(`/agreements/${agreement.id}`)}
            className="inline-flex items-center gap-1.5 text-caption font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Agreement Details
          </button>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-h1 text-text-primary">Rental Escrow Timeline</h1>
            <span className="text-xs font-mono font-bold text-primary-glow bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
              {agreement.id}
            </span>
            <AgreementStatusBadge status={agreement.status} />
          </div>
          <p className="text-body text-text-secondary mt-1">
            {agreement.propertyName} — Total Escrow: <strong className="text-primary-glow font-mono">{totalEscrow} XLM</strong>
          </p>
        </div>

        <SecondaryButton onClick={() => navigate(`/agreements/${agreement.id}`)}>
          View Agreement
        </SecondaryButton>
      </div>

      {/* Main Timeline Card */}
      <AgreementTimeline currentStatus={agreement.status} />

      {/* Auditable Event Feed */}
      <AgreementActivityTimeline agreement={agreement} />
    </PageContainer>
  );
};
