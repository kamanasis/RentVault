import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/cards/Card';
import { StatusBadge } from '../components/status/StatusBadge';
import { PrimaryButton } from '../components/buttons/PrimaryButton';
import { SecondaryButton } from '../components/buttons/SecondaryButton';
import { Shield, Clock, ArrowRight, Lock, CheckCircle, FileText } from 'lucide-react';

export const AgreementDetails = () => {
  const { id = 'AGR-2026-9041' } = useParams();
  const navigate = useNavigate();

  return (
    <PageContainer className="max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-h1 text-text-primary">Rental Agreement Details</h1>
            <StatusBadge variant="success">Deposit Locked</StatusBadge>
          </div>
          <p className="text-caption font-mono text-text-muted">Agreement ID: {id}</p>
        </div>

        <div className="flex items-center gap-3">
          <SecondaryButton onClick={() => navigate(`/agreement/${id}/timeline`)}>
            View Timeline
          </SecondaryButton>
          <PrimaryButton onClick={() => navigate(`/agreement/${id}/deposit`)}>
            Deposit Funds
          </PrimaryButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-2 space-y-6">
          <h2 className="text-h3 text-text-primary pb-3 border-b border-border">
            Property & Wallet Info
          </h2>

          <div className="grid grid-cols-2 gap-4 text-body">
            <div>
              <span className="text-caption text-text-muted block">Property Name</span>
              <span className="font-semibold text-text-primary">Sunset Bay Apartments #402</span>
            </div>

            <div>
              <span className="text-caption text-text-muted block">Escrow Contract ID</span>
              <span className="font-mono text-xs text-primary-glow">CB7...XLM9</span>
            </div>

            <div>
              <span className="text-caption text-text-muted block">Landlord Address</span>
              <span className="font-mono text-xs text-text-secondary">GB7X...42F0</span>
            </div>

            <div>
              <span className="text-caption text-text-muted block">Tenant Address</span>
              <span className="font-mono text-xs text-text-secondary">GDKX...89A1</span>
            </div>

            <div>
              <span className="text-caption text-text-muted block">Lease Duration</span>
              <span className="text-text-primary">Sep 01, 2026 – Aug 31, 2027</span>
            </div>

            <div>
              <span className="text-caption text-text-muted block">Auto-Release Countdown</span>
              <span className="text-text-primary flex items-center gap-1">
                <Clock className="w-4 h-4 text-warning" /> 7 Days Post-Lease
              </span>
            </div>
          </div>
        </Card>

        <Card className="space-y-6">
          <h2 className="text-h3 text-text-primary pb-3 border-b border-border">
            Escrow Deposit
          </h2>

          <div className="space-y-4">
            <div>
              <span className="text-caption text-text-muted block">Total Deposit</span>
              <span className="text-h2 font-bold text-primary-glow">2,500 XLM</span>
            </div>

            <div className="pt-3 border-t border-border space-y-2 text-caption">
              <div className="flex justify-between">
                <span className="text-text-muted">Security Deposit:</span>
                <span className="text-text-primary font-medium">2,300 XLM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Utility Reserve:</span>
                <span className="text-text-primary font-medium">200 XLM</span>
              </div>
            </div>

            <div className="pt-4">
              <PrimaryButton fullWidth onClick={() => navigate(`/agreement/${id}/settlement`)}>
                Open Settlement
              </PrimaryButton>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};
