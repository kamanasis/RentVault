import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/cards/Card';
import { AgreementStatusBadge } from '../components/agreements/AgreementStatusBadge';
import { AgreementSummary } from '../components/agreements/AgreementSummary';
import { AgreementTimeline } from '../components/agreements/AgreementTimeline';
import { AgreementActivityTimeline } from '../components/lifecycle/AgreementActivityTimeline';
import { LeaseStatusCard } from '../components/lifecycle/LeaseStatusCard';
import { TenantReviewPanel } from '../components/lifecycle/TenantReviewPanel';
import { RefundConfirmationCard } from '../components/lifecycle/RefundConfirmationCard';
import { EditAgreementModal } from '../components/agreements/EditAgreementModal';
import { FundingProgress } from '../components/escrow/FundingProgress';
import { EscrowStatusCard } from '../components/escrow/EscrowStatusCard';
import { EscrowFundingDetailsCard } from '../components/escrow/EscrowFundingDetailsCard';
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
  Info,
  CheckCircle2,
  Zap,
  Archive,
  Download,
  FileText
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

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

  const handleDownloadReceipt = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
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

  const roleInfo = evaluateAgreementRole(address, agreement);

  const leaseDurationText = calculateLeaseDuration(agreement.leaseStart, agreement.leaseEnd);
  const depositAmount = agreement.depositAmount || 0;
  const utilityReserve = agreement.utilityReserve || 0;
  const totalEscrow = depositAmount + utilityReserve;
  const fundedAmount = agreement.fundedAmount !== undefined 
    ? agreement.fundedAmount 
    : (agreement.status === 'Deposit Locked' || agreement.status === 'Lease Active' || agreement.status === 'Lease Ended' || agreement.status === 'Utility Settlement' ? totalEscrow : 0);

  const isDepositLocked = agreement.status !== 'Awaiting Deposit';
  const isRefundCompleted = agreement.status === 'Refund Completed';
  const isSettlementMode = agreement.status === 'Utility Settlement';

  // Role permissions list items
  const landlordPermissions = isRefundCompleted ? [
    'View settlement receipt',
    'View transaction history',
    'Download receipt certificate',
  ] : [
    'Edit agreement metadata',
    'Share agreement link',
    'Submit utility settlement',
    'Monitor escrow status',
    'View funding details',
  ];

  const tenantPermissions = isRefundCompleted ? [
    'View settlement receipt',
    'View transaction history',
    'Download receipt certificate',
  ] : [
    'Deposit security XLM',
    'Review utility deductions',
    'Approve refund & release',
    'Raise settlement dispute',
    'View funding details',
  ];

  const guestPermissions = [
    'View agreement details',
    'View agreement timeline',
    'Inspect wallet keys',
  ];

  const activePermissions = roleInfo.isLandlord 
    ? landlordPermissions 
    : roleInfo.isTenant 
    ? tenantPermissions 
    : guestPermissions;

  return (
    <PageContainer className="max-w-5xl">
      {/* Top Navigation Row & Header Actions */}
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

        {/* Header Actions (Fix 5: Agreement Archived when completed) */}
        <div className="flex items-center gap-3">
          <SecondaryButton 
            icon={Share2} 
            onClick={handleShareAgreement}
            ariaLabel="Share agreement link"
          >
            {copiedShareLink ? 'Link Copied!' : 'Share Agreement'}
          </SecondaryButton>

          {/* Landlord Edit vs Archived Option (Fix 5) */}
          {isRefundCompleted ? (
            <SecondaryButton 
              icon={Archive}
              disabled
              className="opacity-70 cursor-not-allowed"
            >
              Agreement Archived
            </SecondaryButton>
          ) : roleInfo.isLandlord && (
            <SecondaryButton 
              icon={Edit3}
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit Terms
            </SecondaryButton>
          )}

          {/* Portal / Action Button */}
          {isRefundCompleted ? (
            <PrimaryButton 
              icon={CheckCircle2} 
              disabled
              className="bg-success/80 border-success cursor-not-allowed"
            >
              Refund Completed
            </PrimaryButton>
          ) : agreement.status === 'Lease Ended' || agreement.status === 'Utility Settlement' ? (
            <PrimaryButton 
              icon={Zap} 
              onClick={() => navigate(`/agreement/${agreement.id}/settlement`)}
            >
              Utility Settlement Portal
            </PrimaryButton>
          ) : (
            <PrimaryButton 
              icon={Lock} 
              disabled={!roleInfo.isTenant || isDepositLocked}
              onClick={() => navigate(`/agreement/${agreement.id}/deposit`)}
            >
              {isDepositLocked 
                ? 'Escrow Already Funded' 
                : roleInfo.isTenant 
                ? 'Deposit Escrow' 
                : roleInfo.isLandlord 
                ? 'Waiting for Tenant' 
                : 'Unauthorized Wallet'}
            </PrimaryButton>
          )}
        </div>
      </div>

      {/* Role Header Banner */}
      <div className="mb-6">
        <AgreementRoleHeader roleInfo={roleInfo} connectedAddress={address} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Main Details & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Wallet Mismatch Warning if Unauthorized */}
          {roleInfo.isUnauthorized && (
            <WalletMismatchNotice requiredRole="tenant" connectedAddress={address} />
          )}

          {/* Phase 7 Refund Completion Card */}
          {isRefundCompleted && (
            <RefundConfirmationCard agreement={agreement} />
          )}

          {/* Phase 7 Lease Lifecycle Status Card */}
          {!isRefundCompleted && <LeaseStatusCard agreement={agreement} isLandlord={roleInfo.isLandlord} />}

          {/* Phase 7 Tenant Review Panel */}
          {isSettlementMode && (
            <TenantReviewPanel agreement={agreement} />
          )}

          {/* Escrow Status Card */}
          <EscrowStatusCard status={agreement.status} />

          {/* Phase 6.8 / 7.1 Settlement Receipt Card (Fix 7) */}
          {isDepositLocked && (
            <EscrowFundingDetailsCard agreement={agreement} />
          )}

          {/* Phase 6 Funding Progress Widget (Fix 2) */}
          <FundingProgress 
            requiredAmount={totalEscrow} 
            fundedAmount={fundedAmount} 
            status={agreement.status}
            totalDeduction={agreement.totalDeduction || 0}
            finalRefundAmount={agreement.finalRefundAmount}
          />

          {/* Agreement Lifecycle Timeline (Fix 3) */}
          <AgreementTimeline currentStatus={agreement.status} />

          {/* Phase 7 10-Stage Complete Lifecycle Activity Log */}
          <AgreementActivityTimeline agreement={agreement} />

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

        {/* Right Sidebar: Financial Summary & Archived Role Controls (Fix 4) */}
        <div className="space-y-6">
          <AgreementSummary agreement={agreement} />

          {/* Informational Role-Based Summary Card */}
          <Card className="space-y-4 border-border/80 bg-background/50">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="text-caption font-semibold text-text-primary uppercase tracking-wider">
                {isRefundCompleted ? 'Archived Agreement Controls' : 'Role-Based Controls'}
              </span>
              <RoleBadge role={roleInfo.role} />
            </div>

            {/* Granted Permissions List */}
            <div className="space-y-2">
              <span className="text-xs text-text-muted font-medium block">
                {isRefundCompleted ? 'Completed Status Actions' : 'Granted Permissions'}
              </span>
              <ul className="space-y-2 text-xs text-text-secondary">
                {activePermissions.map((perm, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0" />
                    <span>{perm}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Fix 4 Action Buttons for Completed Agreements */}
            {isRefundCompleted && (
              <div className="space-y-2 pt-2 border-t border-border/60">
                <SecondaryButton fullWidth icon={FileText} onClick={() => navigate(`/agreement/${agreement.id}/settlement`)}>
                  View Settlement Receipt
                </SecondaryButton>
                <SecondaryButton fullWidth icon={Clock} onClick={() => navigate('/transactions')}>
                  View Transaction History
                </SecondaryButton>
                <SecondaryButton fullWidth icon={Download} onClick={handleDownloadReceipt}>
                  {downloaded ? 'Receipt Downloaded!' : 'Download Receipt'}
                </SecondaryButton>
              </div>
            )}

            {/* Compact Escrow State Summary */}
            <div className="p-3.5 bg-surface/60 rounded-2xl border border-border/60 space-y-1.5 text-xs">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-text-muted">Escrow Lifecycle</span>
                <span className={isRefundCompleted ? 'text-success' : 'text-primary-glow'}>
                  {agreement.status}
                </span>
              </div>
              <p className="text-[11px] text-text-secondary leading-relaxed">
                {isRefundCompleted 
                  ? `Refund of ${(agreement.finalRefundAmount || depositAmount).toFixed(2)} XLM fully executed on Stellar Testnet.`
                  : isDepositLocked 
                  ? `Funded by tenant wallet (${totalEscrow} XLM locked on-chain)`
                  : `Requires ${totalEscrow} XLM escrow deposit by assigned tenant`}
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Edit Agreement Modal */}
      <EditAgreementModal
        agreement={agreement}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </PageContainer>
  );
};
