import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/cards/Card';
import { AgreementStatusBadge } from '../components/agreements/AgreementStatusBadge';
import { AgreementSummary } from '../components/agreements/AgreementSummary';
import { AgreementTimeline } from '../components/agreements/AgreementTimeline';
import { PrimaryButton } from '../components/buttons/PrimaryButton';
import { SecondaryButton } from '../components/buttons/SecondaryButton';
import { useAgreements } from '../context/AgreementContext';
import { calculateLeaseDuration } from '../utils/duration';
import { 
  Building, 
  Wallet, 
  Calendar, 
  Clock, 
  ArrowLeft, 
  Copy, 
  Check, 
  Share2, 
  Edit3, 
  Lock, 
  ShieldCheck,
  AlertCircle,
  Info
} from 'lucide-react';

export const AgreementDetails = () => {
  const { id = 'RV-2026-001' } = useParams();
  const navigate = useNavigate();
  const { getAgreementById } = useAgreements();

  const agreement = getAgreementById(id);

  const [copiedLandlord, setCopiedLandlord] = useState(false);
  const [copiedTenant, setCopiedTenant] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  const copyToClipboard = (text, setCopiedState) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  const handleShareAgreement = () => {
    const currentUrl = window.location.href;
    copyToClipboard(currentUrl, setCopiedShareLink);
  };

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
          <div className="pt-2">
            <SecondaryButton icon={ArrowLeft} onClick={() => navigate('/agreements')}>
              Back to Agreement Dashboard
            </SecondaryButton>
          </div>
        </Card>
      </PageContainer>
    );
  }

  const leaseDurationText = calculateLeaseDuration(agreement.leaseStart, agreement.leaseEnd);

  return (
    <PageContainer className="max-w-5xl">
      {/* Top Navigation Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
        <div>
          <button
            onClick={() => navigate('/agreements')}
            className="inline-flex items-center gap-1.5 text-caption font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Agreements
          </button>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-h1 text-text-primary">{agreement.propertyName}</h1>
            <span className="text-xs font-mono font-bold text-primary-glow bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
              {agreement.id}
            </span>
            <AgreementStatusBadge status={agreement.status} />
          </div>
          <p className="text-body text-text-secondary mt-1">{agreement.propertyAddress}</p>
        </div>

        {/* Action Header Buttons */}
        <div className="flex items-center gap-3">
          <SecondaryButton 
            icon={Share2} 
            onClick={handleShareAgreement}
            ariaLabel="Share agreement link"
          >
            {copiedShareLink ? 'Link Copied!' : 'Share Agreement'}
          </SecondaryButton>

          <PrimaryButton 
            icon={Lock} 
            onClick={() => navigate(`/agreement/${agreement.id}/deposit`)}
          >
            Deposit Escrow
          </PrimaryButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Escrow Status Banner */}
          <Card className="p-6 bg-warning/10 border-warning/30 space-y-2">
            <div className="flex items-center gap-2 text-warning font-semibold text-caption">
              <Clock className="w-4 h-4" />
              <span>Escrow Status: Awaiting Deposit</span>
            </div>
            <p className="text-body text-text-secondary">
              The tenant has not deposited the required security XLM into the Soroban escrow vault yet.
            </p>
          </Card>

          {/* Phase 5.5 Agreement Lifecycle Timeline */}
          <AgreementTimeline currentStatus={agreement.status} />

          {/* Parties Card */}
          <Card className="space-y-4">
            <h3 className="text-h3 text-text-primary border-b border-border pb-3 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary-glow" /> Agreement Parties & Wallets
            </h3>

            <div className="space-y-3 font-mono text-caption">
              {/* Landlord Wallet */}
              <div className="p-3.5 bg-background/80 rounded-2xl border border-border/80 space-y-1">
                <div className="flex justify-between items-center text-text-muted text-xs">
                  <span className="font-sans font-medium">Landlord Stellar Address:</span>
                  <button
                    onClick={() => copyToClipboard(agreement.landlordWallet, setCopiedLandlord)}
                    className="flex items-center gap-1 text-primary-glow hover:underline text-xs cursor-pointer font-sans"
                  >
                    {copiedLandlord ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedLandlord ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="text-text-primary truncate font-semibold">{agreement.landlordWallet}</div>
              </div>

              {/* Tenant Wallet */}
              <div className="p-3.5 bg-background/80 rounded-2xl border border-border/80 space-y-1">
                <div className="flex justify-between items-center text-text-muted text-xs">
                  <span className="font-sans font-medium">Tenant Stellar Address:</span>
                  <button
                    onClick={() => copyToClipboard(agreement.tenantWallet, setCopiedTenant)}
                    className="flex items-center gap-1 text-primary-glow hover:underline text-xs cursor-pointer font-sans"
                  >
                    {copiedTenant ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedTenant ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="text-text-primary truncate font-semibold">{agreement.tenantWallet}</div>
              </div>
            </div>
          </Card>

          {/* Lease Information Card with Real Duration Calculation */}
          <Card className="space-y-4">
            <h3 className="text-h3 text-text-primary border-b border-border pb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-glow" /> Lease Information & Duration
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-body">
              <div>
                <span className="text-caption text-text-muted block">Lease Start Date</span>
                <span className="font-semibold text-text-primary">{agreement.leaseStart}</span>
              </div>
              <div>
                <span className="text-caption text-text-muted block">Lease End Date</span>
                <span className="font-semibold text-text-primary">{agreement.leaseEnd}</span>
              </div>
              <div>
                <span className="text-caption text-text-muted block">Lease Duration</span>
                <span className="font-extrabold text-primary-glow">{leaseDurationText}</span>
              </div>
            </div>

            {agreement.notes && (
              <div className="pt-3 border-t border-border/60">
                <span className="text-caption text-text-muted block mb-1">Additional Terms & Notes</span>
                <p className="text-caption text-text-secondary bg-surface/50 p-3 rounded-xl border border-border/40 leading-relaxed">
                  {agreement.notes}
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Financial Summary & Actions */}
        <div className="space-y-6">
          <AgreementSummary agreement={agreement} />

          <Card className="space-y-3">
            <h4 className="text-caption font-semibold text-text-primary uppercase tracking-wider mb-2">
              Agreement Controls
            </h4>
            <SecondaryButton 
              fullWidth 
              icon={Edit3}
              onClick={() => alert('Phase 5.5 Placeholder: Agreement editing modal.')}
            >
              Edit Agreement Terms
            </SecondaryButton>
            <SecondaryButton 
              fullWidth 
              icon={Share2}
              onClick={handleShareAgreement}
            >
              {copiedShareLink ? 'Link Copied!' : 'Share Agreement'}
            </SecondaryButton>

            <div className="space-y-1 pt-1">
              <PrimaryButton 
                fullWidth 
                icon={Lock}
                onClick={() => navigate(`/agreement/${agreement.id}/deposit`)}
              >
                Deposit Escrow
              </PrimaryButton>
              <p className="text-[11px] text-text-muted text-center flex items-center justify-center gap-1">
                <Info className="w-3 h-3 text-primary-glow flex-shrink-0" />
                <span>This action will connect to the Soroban escrow contract in Phase 6.</span>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
