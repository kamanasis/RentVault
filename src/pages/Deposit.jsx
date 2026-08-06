import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/cards/Card';
import { StatusBadge } from '../components/status/StatusBadge';
import { PrimaryButton } from '../components/buttons/PrimaryButton';
import { SecondaryButton } from '../components/buttons/SecondaryButton';
import { Wallet, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const Deposit = () => {
  const { id = 'AGR-2026-9041' } = useParams();
  const navigate = useNavigate();

  return (
    <PageContainer className="max-w-3xl">
      <div className="text-center mb-8">
        <StatusBadge variant="primary" className="mb-3">Step 2: Deposit Escrow</StatusBadge>
        <h1 className="text-h1 text-text-primary mb-2">Deposit XLM into Escrow Vault</h1>
        <p className="text-body text-text-secondary">
          Review agreement parameters before locking funds into the Soroban smart contract.
        </p>
      </div>

      <Card className="space-y-6">
        <div className="bg-surface border border-border rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-caption text-text-muted block">Agreement ID</span>
            <span className="font-mono text-text-primary font-semibold">{id}</span>
          </div>
          <StatusBadge variant="warning">Awaiting Deposit</StatusBadge>
        </div>

        <div className="space-y-3">
          <h3 className="text-h3 text-text-primary">Deposit Summary</h3>
          <div className="p-4 bg-background/50 rounded-2xl border border-border/60 space-y-2 text-body">
            <div className="flex justify-between">
              <span className="text-text-secondary">Base Security Deposit</span>
              <span className="font-semibold text-text-primary">2,300 XLM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Shared Utility Reserve</span>
              <span className="font-semibold text-text-primary">200 XLM</span>
            </div>
            <div className="pt-2 border-t border-border flex justify-between text-h3 text-primary-glow">
              <span>Total Lock Amount</span>
              <span>2,500 XLM</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-caption text-primary-glow flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block mb-1">On-Chain Protection Guarantee</span>
            Funds are locked directly inside the Soroban escrow contract on Stellar Testnet. Neither party can withdraw without mutual settlement or auto-release trigger.
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4 border-t border-border">
          <SecondaryButton onClick={() => navigate(`/agreement/${id}`)}>
            Back to Details
          </SecondaryButton>
          <PrimaryButton 
            icon={Lock}
            onClick={() => {
              alert('Phase 1 Placeholder: Escrow deposit simulated. Redirecting to timeline...');
              navigate(`/agreement/${id}/timeline`);
            }}
          >
            Lock 2,500 XLM in Escrow
          </PrimaryButton>
        </div>
      </Card>
    </PageContainer>
  );
};
