import React from 'react';
import { Card } from '../cards/Card';
import { StatusBadge } from '../status/StatusBadge';
import { useWallet } from '../../context/WalletContext';
import { ShieldCheck, Cpu, CheckCircle2 } from 'lucide-react';

export const WalletStatus = () => {
  const { connected, network } = useWallet();

  if (!connected) return null;

  return (
    <Card className="space-y-4 border border-border/80">
      <div className="flex items-center justify-between">
        <span className="text-caption font-semibold text-text-primary uppercase tracking-wider">
          Session Status
        </span>
        <StatusBadge variant="success" size="sm">
          Active
        </StatusBadge>
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
            <Cpu className="w-3.5 h-3.5" /> Ready
          </span>
        </div>
        <div className="flex items-center justify-between py-1.5">
          <span>Security Clearance:</span>
          <span className="text-text-primary font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-success" /> Verified
          </span>
        </div>
      </div>
    </Card>
  );
};
