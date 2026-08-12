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
import { TrustBadgeGroup } from '../components/stellar/TrustBadgeGroup';
import { Accordion } from '../components/ui/Accordion';
import { PrimaryButton } from '../components/buttons/PrimaryButton';
import { SecondaryButton } from '../components/buttons/SecondaryButton';
import { useAgreements } from '../context/AgreementContext';
import { useWallet } from '../context/WalletContext';
import { evaluateAgreementRole } from '../utils/role';
import { calculateLeaseDuration } from '../utils/duration';
import { getSorobanContractId } from '../services/soroban';
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
  FileText,
  Cpu
} from 'lucide-react';

export const AgreementDetails = () => {
  const { id = 'RV-2026-001' } = useParams();
  const navigate = useNavigate();
  const { getAgreementById, endLease } = useAgreements();
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

  const isFundedState = 
    agreement.status === 'Deposit Locked' || 
    agreement.status === 'Lease Active' || 
    agreement.status === 'Lease Ended' || 
    agreement.status === 'Utility Settlement' || 
    agreement.status === 'Approval Pending' || 
    agreement.status === 'Dispute Pending' || 
    agreement.status === 'Refund Completed';

  const fundedAmount = isFundedState ? totalEscrow : (parseFloat(agreement.fundedAmount) || 0);

  const isDepositLocked = agreement.status !== 'Awaiting Deposit';
  const isRefundCompleted = agreement.status === 'Refund Completed';
  const isSettlementMode = agreement.status === 'Utility Settlement';
  const contractId = getSorobanContractId();

  // Role permissions list items
  const landlordPermissions = isRefundCompleted ? [
    'View settlement receipt',
    'View transaction history',
    'Download receipt certificate',
  ] : [
    'Edit agreement metadata',
    'Share agreement link',
    'Trigger lease termination & settlement',
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
    <PageContainer className="max-w-5xl space-y-6">
      {/* Top Navigation Row & Context-Aware Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
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

        {/* Context-Aware Action Bar */}
        <div className="flex flex-wrap items-center gap-3">
          {agreement.status === 'Awaiting Deposit' && (
            <>
              <SecondaryButton icon={Share2} onClick={handleShareAgreement}>
                {copiedShareLink ? 'Link Copied!' : 'Share Agreement'}
              </SecondaryButton>
              {roleInfo.isLandlord && (
                <SecondaryButton icon={Edit3} onClick={() => setIsEditModalOpen(true)}>
                  Edit Terms
                </SecondaryButton>
              )}
              {roleInfo.isTenant && (
                <PrimaryButton icon={Lock} onClick={() => navigate(`/agreements/${agreement.id}/deposit`)}>
                  Deposit Escrow
                </PrimaryButton>
              )}
            </>
          )}

          {agreement.status === 'Deposit Locked' && (
            <>
              <SecondaryButton icon={Share2} onClick={handleShareAgreement}>
                {copiedShareLink ? 'Link Copied!' : 'Share Link'}
              </SecondaryButton>
              <PrimaryButton icon={ShieldCheck} onClick={() => navigate(`/agreements/${agreement.id}/timeline`)}>
                Monitor Timeline
              </PrimaryButton>
            </>
          )}

          {agreement.status === 'Lease Active' && (
            <>
              <SecondaryButton icon={Share2} onClick={handleShareAgreement}>
                {copiedShareLink ? 'Link Copied!' : 'Share Link'}
              </SecondaryButton>
              {roleInfo.isLandlord && (
                <SecondaryButton icon={Edit3} onClick={() => setIsEditModalOpen(true)}>
                  Edit Terms
                </SecondaryButton>
              )}
              {roleInfo.isLandlord ? (
                <PrimaryButton 
                  icon={Zap} 
                  onClick={() => {
                    endLease(agreement.id);
                    navigate(`/agreements/${agreement.id}/settlement`);
                  }}
                >
                  Trigger Lease End & Settlement
                </PrimaryButton>
              ) : (
                <PrimaryButton icon={Calendar} onClick={() => navigate(`/agreements/${agreement.id}/timeline`)}>
                  View Active Timeline
                </PrimaryButton>
              )}
            </>
          )}

          {(agreement.status === 'Lease Ended' || agreement.status === 'Utility Settlement') && (
            <PrimaryButton icon={Zap} onClick={() => navigate(`/agreements/${agreement.id}/settlement`)}>
              Utility Settlement Portal
            </PrimaryButton>
          )}

          {isRefundCompleted && (
            <>
              <SecondaryButton icon={Download} onClick={handleDownloadReceipt}>
                {downloaded ? 'Receipt Downloaded!' : 'Download Receipt'}
              </SecondaryButton>
              <PrimaryButton icon={CheckCircle2} onClick={() => navigate(`/agreements/${agreement.id}/completed`)}>
                View Receipt
              </PrimaryButton>
            </>
          )}
        </div>
      </div>

      {/* Visual Trust Badges Strip */}
      <TrustBadgeGroup />

      {/* Role Header Banner */}
      <AgreementRoleHeader roleInfo={roleInfo} connectedAddress={address} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Always Visible Sections & Expandable Accordions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Wallet Mismatch Warning if Unauthorized */}
          {roleInfo.isUnauthorized && (
            <WalletMismatchNotice requiredRole="tenant" connectedAddress={address} />
          )}

          {/* Refund Completion Card */}
          {isRefundCompleted && (
            <RefundConfirmationCard agreement={agreement} />
          )}

          {/* Lease Lifecycle Status Card */}
          {!isRefundCompleted && <LeaseStatusCard agreement={agreement} isLandlord={roleInfo.isLandlord} />}

          {/* Tenant Review Panel */}
          {isSettlementMode && (
            <TenantReviewPanel agreement={agreement} />
          )}

          {/* Always Visible: Escrow Status & Funding Progress */}
          <EscrowStatusCard status={agreement.status} />

          <FundingProgress 
            requiredAmount={totalEscrow} 
            fundedAmount={fundedAmount} 
            status={agreement.status}
            totalDeduction={agreement.totalDeduction || 0}
            finalRefundAmount={agreement.finalRefundAmount}
          />

          {/* Always Visible: Agreement Lifecycle Timeline */}
          <AgreementTimeline currentStatus={agreement.status} />

          {/* Expandable Accordion 1: Parties & Wallet Verification */}
          <Accordion
            title="Agreement Parties & Wallets"
            subtitle="Cryptographic public keys for landlord and tenant"
            icon={Wallet}
            badgeText="Role Verified"
            defaultOpen={false}
          >
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
          </Accordion>

          {/* Expandable Accordion 2: Escrow Funding Parameters & Settlement Receipt */}
          {isDepositLocked && (
            <Accordion
              title="Escrow Funding Details & Parameters"
              subtitle="Soroban contract lock execution and settlement history"
              icon={ShieldCheck}
              badgeText="Escrow Locked"
              defaultOpen={false}
            >
              <EscrowFundingDetailsCard agreement={agreement} />
            </Accordion>
          )}

          {/* Expandable Accordion 3: Complete 10-Stage Activity Feed */}
          <Accordion
            title="Complete 10-Stage Activity Log"
            subtitle="Auditable timeline event history"
            icon={Clock}
            badgeText="Auditable"
            defaultOpen={false}
          >
            <AgreementActivityTimeline agreement={agreement} />
          </Accordion>

          {/* Expandable Accordion 4: Technical Blockchain Metadata & Soroban Contract Info */}
          <Accordion
            title="Technical Blockchain Metadata & Proofs"
            subtitle="Soroban Contract ID, network consensus, and transaction hashes"
            icon={Cpu}
            badgeText="On-Chain"
            defaultOpen={false}
          >
            <div className="space-y-3 font-mono text-caption">
              <div className="p-3 bg-background/80 rounded-2xl border border-border/80 flex justify-between items-center">
                <span className="text-text-muted">Soroban Contract ID:</span>
                <span className="text-primary-glow font-bold truncate max-w-[240px]">{contractId}</span>
              </div>

              <div className="p-3 bg-background/80 rounded-2xl border border-border/80 flex justify-between items-center">
                <span className="text-text-muted">Stellar Network:</span>
                <span className="text-success font-bold">Stellar Testnet (Protocol 20)</span>
              </div>

              <div className="p-3 bg-background/80 rounded-2xl border border-border/80 flex justify-between items-center">
                <span className="text-text-muted">Smart Contract Engine:</span>
                <span className="text-text-primary font-bold">Soroban WASM Escrow Contract</span>
              </div>

              <div className="pt-2 flex justify-end">
                <a
                  href={`https://testnet.steexp.com/contract/${contractId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-primary-glow hover:underline text-xs font-sans"
                >
                  <span>View Contract on Stellar Expert</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </Accordion>
        </div>

        {/* Right Sidebar: Financial Summary & Role Controls */}
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

            {/* Completed Action Buttons */}
            {isRefundCompleted && (
              <div className="space-y-2 pt-2 border-t border-border/60">
                <SecondaryButton fullWidth icon={FileText} onClick={() => navigate(`/agreements/${agreement.id}/settlement`)}>
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
