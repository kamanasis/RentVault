import React from 'react';
import { Card } from '../cards/Card';
import { StatusBadge } from '../status/StatusBadge';
import { useWallet } from '../../context/WalletContext';
import { useAgreements } from '../../context/AgreementContext';
import { calculateTotalLockedEscrow } from '../../services/soroban';
import { ShieldCheck, Cpu, CheckCircle2, Coins } from 'lucide-react';

export const WalletStatus = () => {
  const { connected } = useWallet();
  const { agreements } = useAgreements();

  if (!connected) return null;

  const totalLockedXlm = calculateTotalLockedEscrow(agreements);

  return (
    <Card className="space-y-4 border border-border/80 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/60">
          <span className="text-caption font-semibold text-text-primary uppercase tracking-wider">
            Escrow & Session
          </span>
          <StatusBadge variant="success" size="sm">
            Active Session
          </StatusBadge>
        </div>

        <div className="p-3.5 bg-background/60 rounded-2xl border border-border/60 mb-4 space-y-1">
          <div className="text-caption text-text-muted flex items-center justify-between">
            <span>Live Escrow Balance</span>
            <Coins className="w-3.5 h-3.5 text-success" />
          </div>
          <div className="text-h3 font-bold text-text-primary">
            {totalLockedXlm.toLocaleString('en-US')} XLM Locked
          </div>
          <p className="text-xs text-text-muted">
            {totalLockedXlm > 0 ? 'Soroban contract vault active' : 'No active escrow agreements'}
          </p>
        </div>

        <div className="space-y-2 text-caption text-text-secondary">
          <div className="flex items-center justify-between py-1.5 border-b border-border/40">
            <span>Stellar Testnet:</span>
            <span className="text-success font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Connected
            </span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-border/40">
            <span>Soroban Engine:</span>
            <span className="text-primary-glow font-medium flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5" /> Active
            </span>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span>Security Clearance:</span>
            <span className="text-text-primary font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-success" /> Verified
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
