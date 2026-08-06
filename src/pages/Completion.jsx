import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/cards/Card';
import { StatusBadge } from '../components/status/StatusBadge';
import { PrimaryButton } from '../components/buttons/PrimaryButton';
import { SecondaryButton } from '../components/buttons/SecondaryButton';
import { CheckCircle, ExternalLink, ArrowRight, Home } from 'lucide-react';

export const Completion = () => {
  const { id = 'AGR-2026-9041' } = useParams();
  const navigate = useNavigate();

  return (
    <PageContainer className="max-w-2xl text-center">
      <div className="mb-8">
        <div className="w-20 h-20 rounded-full bg-success/10 border-2 border-success text-success flex items-center justify-center mx-auto mb-4 animate-bounce">
          <CheckCircle className="w-10 h-10" />
        </div>
        <StatusBadge variant="success" size="lg" className="mb-3">Agreement Completed</StatusBadge>
        <h1 className="text-h1 text-text-primary mb-2">Escrow Refund Completed!</h1>
        <p className="text-body text-text-secondary">
          The Soroban escrow smart contract has released the remaining deposit funds to the tenant wallet.
        </p>
      </div>

      <Card className="space-y-6 text-left mb-8">
        <div className="p-4 bg-background/60 rounded-2xl border border-border/60 space-y-3 font-mono text-caption">
          <div className="flex justify-between">
            <span className="text-text-muted">Agreement ID:</span>
            <span className="text-text-primary font-semibold">{id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Transaction Hash:</span>
            <span className="text-primary-glow truncate max-w-[200px] sm:max-w-none">0x8a92f...39d1b0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Refunded Amount:</span>
            <span className="text-success font-bold">2,430 XLM</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Stellar Network:</span>
            <span className="text-text-primary">Testnet</span>
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <SecondaryButton icon={Home} onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </SecondaryButton>
        <PrimaryButton icon={ArrowRight} onClick={() => navigate('/agreement/create')}>
          Create New Agreement
        </PrimaryButton>
      </div>
    </PageContainer>
  );
};
