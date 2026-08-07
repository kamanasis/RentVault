import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/cards/Card';
import { AgreementStatusBadge } from '../components/agreements/AgreementStatusBadge';
import { AgreementSummary } from '../components/agreements/AgreementSummary';
import { AgreementTimeline } from '../components/agreements/AgreementTimeline';
import { FundingProgress } from '../components/escrow/FundingProgress';
import { EscrowStatusCard } from '../components/escrow/EscrowStatusCard';
import { RoleBadge } from '../components/roles/RoleBadge';
import { AgreementRoleHeader } from '../components/roles/AgreementRoleHeader';
import { WalletMismatchNotice } from '../components/roles/WalletMismatchNotice';
import { PrimaryButton } from '../components/buttons/PrimaryButton';
import { SecondaryButton } from '../components/buttons/SecondaryButton';
import { useAgreements } from '../context/AgreementContext';
import { useWallet } from '../context/WalletContext';
import { evaluateAgreementRole } from '../utils/role';
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
  ExternalLink,
  Info
} from 'lucide-react';

export const AgreementDetails = () => {
  const { id = 'RV-2026-001' } = useParams();
  const navigate = useNavigate();
  const { getAgreementById } = useAgreements();
  const { address } = useWallet();

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

  // Evaluate role based on connected wallet address
  const roleInfo = evaluateAgreementRole(address, agreement);

  const leaseDurationText = calculateLeaseDuration(agreement.leaseStart, agreement.leaseEnd);
  const depositAmount = agreement.depositAmount || 0;
  const utilityReserve = agreement.utilityReserve || 0;
  const totalEscrow = depositAmount + utilityReserve;
  const fundedAmount = agreement.fundedAmount || (agreement.status === 'Deposit Locked' ? totalEscrow : 0);

  // Helper text & deposit button state logic
  const isDepositLocked = agreement.status === 'Deposit Locked';

  return (
    <PageContainer className="max-w-5xl">
      {/* Top Navigation Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
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
            <RoleBadge role={roleInfo.role} />
          </div>
          <p className="text-body text-text-secondary mt-1">{agreement.propertyAddress}</p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          <SecondaryButton 
            icon={Share2} 
            onClick={handleShareAgreement}
            ariaLabel="Share agreement link"
          >
            {copiedShareLink ? 'Link Copied!' : 'Share Agreement'}
          </SecondaryButton>

          {/* Deposit Escrow Header Action Scoped to Tenant */}
          <PrimaryButton 
            icon={Lock} 
            disabled={!roleInfo.isTenant || isDepositLocked}
            onClick={() => navigate(`/agreement/${agreement.id}/deposit`)}
          >
            {isDepositLocked 
              ? 'Escrow Locked' 
              : roleInfo.isTenant 
              ? 'Deposit Escrow' 
              : roleInfo.isLandlord 
              ? 'Waiting for Tenant' 
              : 'Unauthorized Wallet'}
          </PrimaryButton>
        </div>
      </div>

      {/* Role Header Banner */}
      <div className="mb-6">
        <AgreementRoleHeader roleInfo={roleInfo} connectedAddress={address} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Wallet Mismatch Warning if Unauthorized */}
          {roleInfo.isUnauthorized && (
            <WalletMismatchNotice requiredRole="tenant" connectedAddress={address} />
          )}

          {/* Escrow Status Card */}
          <EscrowStatusCard status={agreement.status} />

          {/* Funding Progress Widget */}
          <FundingProgress 
            requiredAmount={totalEscrow} 
            fundedAmount={fundedAmount} 
            status={agreement.status}
          />

          {/* Agreement Lifecycle Timeline */}
          <AgreementTimeline currentStatus={agreement.status} />

          {/* Parties Card */}
          <Card className="space-y-4">
            <h3 className="text-h3 text-text-primary border-b border-border pb-3 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary-glow" /> Agreement Parties & Wallets
            </h3>

            <div className="space-y-3 font-mono text-caption">
              {/* Landlord Wallet */}
              <div className={`p-3.5 rounded-2xl border space-y-1 ${
                roleInfo.isLandlord ? 'bg-primary/10 border-primary/40' : 'bg-background/80 border-border/80'
              }`}>
                <div className="flex justify-between items-center text-text-muted text-xs">
                  <span className="font-sans font-medium flex items-center gap-1.5">
                    Landlord Address {roleInfo.isLandlord && <span className="text-primary-glow font-bold">(You)</span>}
                  </span>
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
              <div className={`p-3.5 rounded-2xl border space-y-1 ${
                roleInfo.isTenant ? 'bg-success/10 border-success/40' : 'bg-background/80 border-border/80'
              }`}>
                <div className="flex justify-between items-center text-text-muted text-xs">
                  <span className="font-sans font-medium flex items-center gap-1.5">
                    Tenant Address {roleInfo.isTenant && <span className="text-success font-bold">(You)</span>}
                  </span>
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

          {/* Lease Information Card */}
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

            {agreement.txHash && (
              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs font-mono">
                <span className="text-text-muted font-sans">Soroban Deposit Transaction Hash:</span>
                <a
                  href={`https://testnet.steexp.com/tx/${agreement.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-glow hover:underline inline-flex items-center gap-1 truncate max-w-[220px]"
                >
                  <span>{agreement.txHash}</span>
                  <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                </a>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Financial Summary & Role Controls */}
        <div className="space-y-6">
          <AgreementSummary agreement={agreement} />

          <Card className="space-y-3">
            <h4 className="text-caption font-semibold text-text-primary uppercase tracking-wider mb-2">
              Role-Based Controls
            </h4>

            {/* Landlord Only Controls */}
            {roleInfo.isLandlord && (
              <SecondaryButton 
                fullWidth 
                icon={Edit3}
                onClick={() => alert('Landlord Action: Editing agreement terms.')}
              >
                Edit Agreement Terms
              </SecondaryButton>
            )}

            <SecondaryButton 
              fullWidth 
              icon={Share2}
              onClick={handleShareAgreement}
            >
              {copiedShareLink ? 'Link Copied!' : 'Share Deposit Link'}
            </SecondaryButton>

            {/* Tenant Escrow Deposit Button */}
            <div className="space-y-1 pt-1">
              <PrimaryButton 
                fullWidth 
                icon={Lock}
                disabled={!roleInfo.isTenant || isDepositLocked}
                onClick={() => navigate(`/agreement/${agreement.id}/deposit`)}
              >
                {isDepositLocked 
                  ? 'Deposit Locked on-chain' 
                  : roleInfo.isTenant 
                  ? 'Execute Soroban Deposit' 
                  : roleInfo.isLandlord 
                  ? 'Waiting for Tenant Deposit' 
                  : 'Unauthorized Wallet'}
              </PrimaryButton>

              <p className="text-[11px] text-text-muted text-center flex items-center justify-center gap-1 leading-normal px-1">
                <Info className="w-3.5 h-3.5 text-primary-glow flex-shrink-0" />
                <span>
                  {roleInfo.isTenant && !isDepositLocked && 'Authenticated as Tenant. Ready to deposit XLM.'}
                  {roleInfo.isLandlord && !isDepositLocked && 'Only the tenant wallet assigned to this agreement can fund the escrow deposit.'}
                  {roleInfo.isUnauthorized && 'This wallet is not authorized to fund or edit this agreement.'}
                  {isDepositLocked && 'Deposit is safely locked in Soroban contract vault.'}
                </span>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
