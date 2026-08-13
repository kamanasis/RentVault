import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../cards/Card';
import { RoleBadge } from '../roles/RoleBadge';
import { useWallet } from '../../context/WalletContext';
import { useAgreements } from '../../context/AgreementContext';
import { ShieldCheck, Coins, Building, ArrowUpRight, CheckCircle2, Clock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ExecutiveHeroSummary = ({ onOpenDemoGuide }) => {
  const navigate = useNavigate();
  const { connected, address } = useWallet();
  const { agreements } = useAgreements();

  const normalizedAddress = (address || '').trim().toUpperCase();

  // Role-filtered agreement sets for connected wallet (fallback to all when disconnected)
  const userAgreements = (connected && address)
    ? agreements.filter((a) => {
        const landlord = (a.landlordWallet || '').trim().toUpperCase();
        const tenant = (a.tenantWallet || '').trim().toUpperCase();
        return landlord === normalizedAddress || tenant === normalizedAddress;
      })
    : agreements;

  const landlordCount = userAgreements.filter(
    (a) => (a.landlordWallet || '').trim().toUpperCase() === normalizedAddress
  ).length;

  const tenantCount = userAgreements.filter(
    (a) => (a.tenantWallet || '').trim().toUpperCase() === normalizedAddress
  ).length;

  // Primary evaluated role for user
  const primaryRole = (connected && address)
    ? (landlordCount >= tenantCount ? 'landlord' : 'tenant')
    : 'landlord';

  // Active escrows strictly in funded/locked states:
  // Deposit Locked | Lease Active | Lease Ended | Utility Settlement | Approval Pending | Dispute Pending
  const activeEscrows = userAgreements.filter((a) => {
    return (
      a.status === 'Deposit Locked' ||
      a.status === 'Lease Active' ||
      a.status === 'Lease Ended' ||
      a.status === 'Utility Settlement' ||
      a.status === 'Approval Pending' ||
      a.status === 'Dispute Pending'
    );
  });

  // Calculate live escrow protected XLM (depositAmount + utilityReserve)
  const totalProtectedXLM = activeEscrows.reduce((sum, ag) => {
    return sum + (parseFloat(ag.depositAmount || 0) + parseFloat(ag.utilityReserve || 0));
  }, 0);

  // Active agreements count
  const activeCount = activeEscrows.length;

  // Pending actions count (agreements requiring action)
  const pendingActionsCount = userAgreements.filter(
    (a) => 
      a.status === 'Awaiting Deposit' || 
      a.status === 'Lease Ended' || 
      a.status === 'Utility Settlement' || 
      a.status === 'Approval Pending' || 
      a.status === 'Dispute Pending'
  ).length;

  // Auto-Release Queue Count
  const autoReleaseQueueCount = userAgreements.filter(
    (a) => a.status === 'Lease Ended' || a.status === 'Utility Settlement'
  ).length;

  // Last settlement refund paid from completed history
  const completedSettlements = userAgreements.filter((a) => a.status === 'Refund Completed');
  const lastRefundAgreement = completedSettlements.length > 0 ? completedSettlements[completedSettlements.length - 1] : null;
  const lastRefundXLM = lastRefundAgreement 
    ? (lastRefundAgreement.finalRefundAmount !== undefined ? parseFloat(lastRefundAgreement.finalRefundAmount) : parseFloat(lastRefundAgreement.depositAmount || 0))
    : 0;

  const truncateKey = (key) => {
    if (!key) return 'G...';
    return `${key.slice(0, 5)}...${key.slice(-4)}`;
  };

  return (
    <Card className="p-6 md:p-8 bg-gradient-to-r from-card via-surface to-card border border-primary/40 shadow-stellar-glow space-y-6">
      {/* Greeting & Role Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-primary-glow bg-primary/10 border border-primary/20 px-3 py-1 rounded-full uppercase tracking-wider">
              Executive Summary
            </span>
            <RoleBadge role={primaryRole} />
          </div>
          <h2 className="text-h2 text-text-primary pt-1">
            Welcome, <span className="font-mono text-primary-glow">{connected ? truncateKey(address) : 'Demo Host'}</span>
          </h2>
          <p className="text-caption text-text-secondary">
            Decentralized Soroban security deposit escrow dashboard on Stellar Testnet.
          </p>
        </div>

        {onOpenDemoGuide && (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenDemoGuide}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-primary to-primary-hover text-white font-semibold text-caption shadow-stellar cursor-pointer"
          >
            <span>Stella Demo Guide</span>
            <ArrowUpRight className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      {/* Auto-Release Queue Banner */}
      {autoReleaseQueueCount > 0 && (
        <div className="p-3.5 bg-primary/10 border border-primary/30 rounded-2xl flex items-center justify-between text-xs font-mono text-primary-glow">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary-glow animate-pulse" />
            <span>Auto-Release Queue: <strong>{autoReleaseQueueCount}</strong> agreement{autoReleaseQueueCount > 1 ? 's' : ''} scheduled for automated release</span>
          </div>
          <button 
            onClick={() => navigate('/agreements')}
            className="hover:underline cursor-pointer font-sans font-semibold text-[11px]"
          >
            View Queue →
          </button>
        </div>
      )}

      {/* 4 Executive Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Protected Escrow */}
        <div className="p-4 bg-background/80 rounded-2xl border border-primary/30 space-y-1">
          <div className="flex items-center justify-between text-caption text-text-muted">
            <span>Protected Escrow</span>
            <Coins className="w-4 h-4 text-primary-glow" />
          </div>
          <span className="text-h2 font-extrabold text-primary-glow block font-mono">
            {totalProtectedXLM.toLocaleString('en-US')} XLM
          </span>
          <span className="text-[11px] text-text-secondary block">Locked in Soroban Contract</span>
        </div>

        {/* Metric 2: Active Agreements */}
        <div className="p-4 bg-background/80 rounded-2xl border border-success/30 space-y-1">
          <div className="flex items-center justify-between text-caption text-text-muted">
            <span>Active Escrows</span>
            <Building className="w-4 h-4 text-success" />
          </div>
          <span className="text-h2 font-extrabold text-success block font-mono">
            {activeCount}
          </span>
          <span className="text-[11px] text-text-secondary block">Active Escrow Leases</span>
        </div>

        {/* Metric 3: Pending Actions */}
        <div className="p-4 bg-background/80 rounded-2xl border border-warning/30 space-y-1">
          <div className="flex items-center justify-between text-caption text-text-muted">
            <span>Pending Actions</span>
            <Clock className="w-4 h-4 text-warning" />
          </div>
          <span className="text-h2 font-extrabold text-warning block font-mono">
            {pendingActionsCount}
          </span>
          <span className="text-[11px] text-text-secondary block">Require Wallet Signatures</span>
        </div>

        {/* Metric 4: Last Settlement */}
        <div className="p-4 bg-background/80 rounded-2xl border border-border space-y-1">
          <div className="flex items-center justify-between text-caption text-text-muted">
            <span>Last Refund Paid</span>
            <CheckCircle2 className="w-4 h-4 text-text-primary" />
          </div>
          <span className="text-h2 font-extrabold text-text-primary block font-mono">
            {lastRefundXLM > 0 ? `${lastRefundXLM.toLocaleString('en-US')} XLM` : '0 XLM'}
          </span>
          <span className="text-[11px] text-text-secondary block">Completed Settlement</span>
        </div>
      </div>
    </Card>
  );
};
