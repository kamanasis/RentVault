import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../cards/Card';
import { RoleBadge } from '../roles/RoleBadge';
import { useWallet } from '../../context/WalletContext';
import { useAgreements } from '../../context/AgreementContext';
import { evaluateAgreementRole } from '../../utils/role';
import { ShieldCheck, Coins, Building, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ExecutiveHeroSummary = ({ onOpenDemoGuide }) => {
  const navigate = useNavigate();
  const { connected, address } = useWallet();
  const { agreements } = useAgreements();

  const normalizedAddress = (address || '').toLowerCase().trim();

  // Role-filtered agreement sets
  const userAgreements = agreements.filter((a) => {
    const landlord = (a.landlordWallet || '').toLowerCase().trim();
    const tenant = (a.tenantWallet || '').toLowerCase().trim();
    return landlord === normalizedAddress || tenant === normalizedAddress;
  });

  const landlordCount = userAgreements.filter(
    (a) => (a.landlordWallet || '').toLowerCase().trim() === normalizedAddress
  ).length;

  const tenantCount = userAgreements.filter(
    (a) => (a.tenantWallet || '').toLowerCase().trim() === normalizedAddress
  ).length;

  // Primary evaluated role for user
  const primaryRole = landlordCount >= tenantCount ? 'landlord' : 'tenant';

  // Calculate live escrow protected XLM
  const totalProtectedXLM = userAgreements.reduce((sum, ag) => {
    if (ag.status === 'Deposit Locked' || ag.status === 'Lease Active' || ag.status === 'Lease Ended' || ag.status === 'Utility Settlement') {
      return sum + (ag.depositAmount || 0) + (ag.utilityReserve || 0);
    }
    return sum;
  }, 0);

  // Active agreements count
  const activeCount = userAgreements.filter(
    (a) => a.status === 'Deposit Locked' || a.status === 'Lease Active' || a.status === 'Lease Ended' || a.status === 'Utility Settlement'
  ).length;

  // Pending actions count
  const pendingActionsCount = userAgreements.filter(
    (a) => a.status === 'Awaiting Deposit' || a.status === 'Lease Ended' || a.status === 'Approval Pending'
  ).length;

  // Last settlement refund
  const completedSettlement = userAgreements.find((a) => a.status === 'Refund Completed');
  const lastRefundXLM = completedSettlement ? (completedSettlement.finalRefundAmount || completedSettlement.depositAmount) : 0;

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
            Welcome, <span className="font-mono text-primary-glow">{truncateKey(address)}</span>
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

      {/* 4 Executive Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Protected Escrow */}
        <div className="p-4 bg-background/80 rounded-2xl border border-primary/30 space-y-1">
          <div className="flex items-center justify-between text-caption text-text-muted">
            <span>Protected Escrow</span>
            <Coins className="w-4 h-4 text-primary-glow" />
          </div>
          <span className="text-h2 font-extrabold text-primary-glow block font-mono">
            {totalProtectedXLM} XLM
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
          <span className="text-[11px] text-text-secondary block">Active Rental Leases</span>
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
            {lastRefundXLM > 0 ? `${lastRefundXLM} XLM` : '0 XLM'}
          </span>
          <span className="text-[11px] text-text-secondary block">Completed Settlement</span>
        </div>
      </div>
    </Card>
  );
};
