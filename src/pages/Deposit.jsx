import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/cards/Card';
import { AgreementStatusBadge } from '../components/agreements/AgreementStatusBadge';
import { FundingProgress } from '../components/escrow/FundingProgress';
import { EscrowStatusCard } from '../components/escrow/EscrowStatusCard';
import { EscrowTransactionCard } from '../components/escrow/EscrowTransactionCard';
import { PrimaryButton } from '../components/buttons/PrimaryButton';
import { SecondaryButton } from '../components/buttons/SecondaryButton';
import { WalletButton } from '../components/wallet/WalletButton';
import { NetworkBadge } from '../components/wallet/NetworkBadge';
import { useAgreements } from '../context/AgreementContext';
import { useWallet } from '../context/WalletContext';
import { depositEscrowContract, getSorobanContractId } from '../services/soroban';
import { 
  Lock, 
  ArrowLeft, 
  Wallet, 
  ShieldCheck, 
  Coins, 
  Cpu, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export const Deposit = () => {
  const { id = 'RV-2026-001' } = useParams();
  const navigate = useNavigate();
  const { getAgreementById, depositEscrow } = useAgreements();
  const { connected, address, network, xlmBalance, rawBalance, refreshBalance } = useWallet();

  const agreement = getAgreementById(id);

  const [depositState, setDepositState] = useState('idle'); // 'idle' | 'locking' | 'success' | 'failure'
  const [txResult, setTxResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

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

  const depositAmount = agreement.depositAmount || 0;
  const utilityReserve = agreement.utilityReserve || 0;
  const totalRequired = depositAmount + utilityReserve;
  const contractId = getSorobanContractId();

  const handleExecuteDeposit = async () => {
    if (!connected || !address) {
      setErrorMessage('Please connect your Freighter wallet to execute escrow deposit.');
      setDepositState('failure');
      return;
    }

    if (rawBalance > 0 && totalRequired > rawBalance - 1) {
      setErrorMessage(`Insufficient wallet balance. Required: ${totalRequired} XLM, Available: ${xlmBalance} XLM.`);
      setDepositState('failure');
      return;
    }

    setDepositState('locking');
    setErrorMessage('');

    try {
      const res = await depositEscrowContract({
        agreementId: agreement.id,
        tenantAddress: address,
        landlordAddress: agreement.landlordWallet,
        depositAmount: depositAmount,
        utilityReserve: utilityReserve,
      });

      console.log('[Deposit Page] Escrow transaction result:', res);
      setTxResult(res);

      // Update agreement status in AgreementContext & localStorage
      depositEscrow(agreement.id, res);

      // Auto-refresh WalletContext XLM balance
      await refreshBalance();

      setDepositState('success');
    } catch (err) {
      console.error('[Deposit Page Error]:', err);
      setErrorMessage(err?.message || 'Failed to submit Soroban escrow contract deposit transaction.');
      setDepositState('failure');
    }
  };

  return (
    <PageContainer className="max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
        <div>
          <button
            onClick={() => navigate(`/agreements/${agreement.id}`)}
            className="inline-flex items-center gap-1.5 text-caption font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Agreement Details
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-h1 text-text-primary">Deposit Escrow Funds</h1>
            <NetworkBadge network={network || 'TESTNET'} />
          </div>
          <p className="text-body text-text-secondary mt-1">
            Lock security deposit XLM into Soroban smart contract vault for <span className="font-semibold text-text-primary">{agreement.propertyName}</span>.
          </p>
        </div>

        <div>
          {!connected && <WalletButton pulse />}
        </div>
      </div>

      {!connected ? (
        <Card className="text-center py-12 space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-primary/10 border border-primary/30 text-primary-glow flex items-center justify-center mx-auto">
            <Wallet className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-h2 text-text-primary">Connect Wallet to Deposit</h2>
            <p className="text-body text-text-secondary max-w-md mx-auto">
              You must authenticate your Freighter wallet to execute smart contract transactions on Stellar Testnet.
            </p>
          </div>
          <div className="pt-2">
            <WalletButton pulse />
          </div>
        </Card>
      ) : depositState === 'success' && txResult ? (
        <EscrowTransactionCard
          agreementId={agreement.id}
          amountLocked={txResult.amountLocked}
          hash={txResult.hash}
          contractId={txResult.contractId}
          ledger={txResult.ledger}
          timestamp={txResult.timestamp}
        />
      ) : (
        <div className="space-y-6">
          {/* Status State Card */}
          <EscrowStatusCard 
            status={depositState === 'locking' ? 'Locking Escrow' : depositState === 'failure' ? 'failure' : agreement.status} 
            errorMessage={errorMessage}
          />

          {/* Funding Progress Widget */}
          <FundingProgress 
            requiredAmount={totalRequired} 
            fundedAmount={agreement.status === 'Deposit Locked' ? totalRequired : 0} 
            status={agreement.status}
          />

          {/* Escrow Deposit Summary Card */}
          <Card className="space-y-6">
            <h3 className="text-h3 text-text-primary flex items-center gap-2 pb-3 border-b border-border">
              <ShieldCheck className="w-5 h-5 text-primary-glow" /> Soroban Contract Execution Parameters
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-caption">
              <div className="p-3.5 bg-background/80 rounded-2xl border border-border/80 space-y-1">
                <span className="text-text-muted text-xs block font-sans">Agreement ID</span>
                <span className="text-text-primary font-bold text-body">{agreement.id}</span>
              </div>

              <div className="p-3.5 bg-background/80 rounded-2xl border border-border/80 space-y-1">
                <span className="text-text-muted text-xs block font-sans">Soroban Contract ID</span>
                <span className="text-primary-glow font-bold truncate block">{contractId}</span>
              </div>

              <div className="p-3.5 bg-background/80 rounded-2xl border border-border/80 space-y-1">
                <span className="text-text-muted text-xs block font-sans">Security Deposit</span>
                <span className="text-text-primary font-bold text-body">{depositAmount} XLM</span>
              </div>

              <div className="p-3.5 bg-background/80 rounded-2xl border border-border/80 space-y-1">
                <span className="text-text-muted text-xs block font-sans">Utility Reserve</span>
                <span className="text-text-primary font-bold text-body">{utilityReserve} XLM</span>
              </div>
            </div>

            {/* Total Required Lock Banner */}
            <div className="p-4 bg-primary/10 rounded-2xl border border-primary/30 flex items-center justify-between">
              <div>
                <span className="text-caption text-text-secondary block">Total Escrow XLM Required</span>
                <span className="text-xs text-text-muted">Will be locked in Soroban contract</span>
              </div>
              <div className="text-right">
                <span className="text-hero font-extrabold text-primary-glow">{totalRequired} XLM</span>
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <SecondaryButton 
                onClick={() => navigate(`/agreements/${agreement.id}`)}
                disabled={depositState === 'locking'}
                className="w-full sm:w-auto"
              >
                Cancel
              </SecondaryButton>

              <PrimaryButton
                icon={Lock}
                onClick={handleExecuteDeposit}
                disabled={depositState === 'locking' || agreement.status === 'Deposit Locked'}
                className="w-full sm:w-auto min-w-[200px]"
              >
                {depositState === 'locking' ? 'Locking on Soroban...' : agreement.status === 'Deposit Locked' ? 'Escrow Already Locked' : 'Confirm & Lock Escrow Deposit'}
              </PrimaryButton>
            </div>
          </Card>
        </div>
      )}
    </PageContainer>
  );
};
