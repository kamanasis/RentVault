import React from 'react';
import { Card } from '../cards/Card';
import { StatusBadge } from '../status/StatusBadge';
import { useWallet } from '../../context/WalletContext';
import { useAgreements } from '../../context/AgreementContext';
import { ShieldCheck, Cpu, CheckCircle2, Coins, Lock, CheckCircle, Clock } from 'lucide-react';

export const WalletStatus = () => {
  const { connected, address } = useWallet();
  const { agreements } = useAgreements();

  if (!connected) return null;

  const normalizedAddress = (address || '').trim().toUpperCase();

  // Strict identity filtering: agreements participating as Landlord or Tenant
  const userAgreements = agreements.filter((a) => {
    const landlord = (a.landlordWallet || '').trim().toUpperCase();
    const tenant = (a.tenantWallet || '').trim().toUpperCase();
    return landlord === normalizedAddress || tenant === normalizedAddress;
  });

  // Active escrows strictly in funded/locked states:
  // Deposit Locked | Lease Active | Lease Ended | Utility Settlement | Approval Pending
  const activeEscrows = userAgreements.filter((a) => {
    return (
      a.status === 'Deposit Locked' ||
      a.status === 'Lease Active' ||
      a.status === 'Lease Ended' ||
      a.status === 'Utility Settlement' ||
      a.status === 'Approval Pending'
    );
  });

  // Completed settlements
  const completedAgreements = userAgreements.filter((a) => a.status === 'Refund Completed');

  // Sum live escrow balance across active escrows (depositAmount + utilityReserve)
  const liveEscrowBalance = activeEscrows.reduce((sum, a) => {
    const deposit = parseFloat(a.depositAmount || 0);
    const reserve = parseFloat(a.utilityReserve || 0);
    return sum + deposit + reserve;
  }, 0);

  const hasActiveEscrow = activeEscrows.length > 0;
  const completedCount = completedAgreements.length;
  
  // Find last refund amount from completed agreements
  const lastRefundAgreement = completedAgreements.length > 0 ? completedAgreements[completedAgreements.length - 1] : null;
  const lastRefundAmount = lastRefundAgreement 
    ? (lastRefundAgreement.finalRefundAmount !== undefined ? parseFloat(lastRefundAgreement.finalRefundAmount) : parseFloat(lastRefundAgreement.depositAmount || 0))
    : 0;

  return (
    <Card className="space-y-4 border border-border/80 h-full flex flex-col justify-between shadow-stellar-glow">
      <div>
        {/* Header Row */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/60">
          <span className="text-caption font-semibold text-text-primary uppercase tracking-wider">
            Escrow & Session
          </span>
          <StatusBadge variant={hasActiveEscrow ? 'success' : 'neutral'} size="sm">
            {hasActiveEscrow ? 'Active Session' : 'Session Ready'}
          </StatusBadge>
        </div>

        {/* Live Escrow Balance Card */}
        <div className={`p-4 rounded-2xl border mb-4 space-y-2 font-mono text-caption ${
          hasActiveEscrow ? 'bg-primary/10 border-primary/40' : 'bg-background/60 border-border/60'
        }`}>
          <div className="text-caption text-text-muted flex items-center justify-between font-sans">
            <span>Live Escrow Balance</span>
            <Coins className={`w-4 h-4 ${hasActiveEscrow ? 'text-primary-glow' : 'text-text-muted'}`} />
          </div>

          <div className="text-h2 font-extrabold text-text-primary">
            {liveEscrowBalance.toLocaleString('en-US')} XLM Locked
          </div>

          {/* Conditional Stats Row */}
          {hasActiveEscrow ? (
            <div className="pt-2 border-t border-border/40 font-sans space-y-1 text-xs">
              <div className="flex justify-between items-center text-text-secondary">
                <span>Agreements in Escrow:</span>
                <span className="font-bold font-mono text-primary-glow">{activeEscrows.length}</span>
              </div>
              <div className="flex justify-between items-center text-text-secondary">
                <span>Escrow Status:</span>
                <span className="font-bold text-success flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" /> Active
                </span>
              </div>
            </div>
          ) : (
            <div className="pt-2 border-t border-border/40 font-sans space-y-1 text-xs">
              <div className="flex justify-between items-center text-text-secondary">
                <span>Agreements in Escrow:</span>
                <span className="font-bold font-mono text-text-primary">0</span>
              </div>
              {completedCount > 0 && (
                <>
                  <div className="flex justify-between items-center text-text-secondary">
                    <span>Completed Settlements:</span>
                    <span className="font-bold font-mono text-success">{completedCount}</span>
                  </div>
                  <div className="flex justify-between items-center text-text-secondary">
                    <span>Last Refund:</span>
                    <span className="font-bold font-mono text-success">{lastRefundAmount.toFixed(2)} XLM</span>
                  </div>
                </>
              )}
              <div className="flex justify-between items-center text-text-secondary pt-0.5">
                <span>Escrow Status:</span>
                <span className="font-bold text-text-muted">No Active Escrow</span>
              </div>
            </div>
          )}
        </div>

        {/* Blockchain Connection Security Clearance */}
        <div className="space-y-2 text-caption text-text-secondary font-mono">
          <div className="flex items-center justify-between py-1.5 border-b border-border/40">
            <span className="font-sans">Stellar Testnet:</span>
            <span className="text-success font-medium flex items-center gap-1 font-sans text-xs">
              <CheckCircle2 className="w-3.5 h-3.5" /> Connected
            </span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-border/40">
            <span className="font-sans">Soroban Engine:</span>
            <span className="text-primary-glow font-medium flex items-center gap-1 font-sans text-xs">
              <Cpu className="w-3.5 h-3.5" /> Active
            </span>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="font-sans">Security Clearance:</span>
            <span className="text-text-primary font-medium flex items-center gap-1 font-sans text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-success" /> Verified
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
