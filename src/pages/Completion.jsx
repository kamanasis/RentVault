import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/cards/Card';
import { RefundConfirmationCard } from '../components/lifecycle/RefundConfirmationCard';
import { AgreementActivityTimeline } from '../components/lifecycle/AgreementActivityTimeline';
import { SecondaryButton } from '../components/buttons/SecondaryButton';
import { useAgreements } from '../context/AgreementContext';
import { ArrowLeft } from 'lucide-react';

export const Completion = () => {
  const { id = 'RV-2026-001' } = useParams();
  const navigate = useNavigate();
  const { getAgreementById } = useAgreements();

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

  return (
    <PageContainer className="max-w-4xl space-y-8">
      <RefundConfirmationCard agreement={agreement} />
      <AgreementActivityTimeline agreement={agreement} />
    </PageContainer>
  );
};
