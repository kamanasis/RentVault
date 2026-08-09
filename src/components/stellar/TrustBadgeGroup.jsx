import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, Cpu } from 'lucide-react';

export const TrustBadgeGroup = ({ className = '' }) => {
  const badges = [
    { label: 'Stellar Secured', icon: ShieldCheck, color: 'text-primary-glow bg-primary/10 border-primary/30' },
    { label: 'Soroban Smart Contract', icon: Cpu, color: 'text-primary-glow bg-primary/10 border-primary/30' },
    { label: 'Escrow Verified', icon: Lock, color: 'text-success bg-success/10 border-success/30' },
    { label: 'On-Chain Protected', icon: CheckCircle2, color: 'text-text-primary bg-surface border-border' },
  ];

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {badges.map((b, idx) => {
        const Icon = b.icon;
        return (
          <span
            key={idx}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium border ${b.color}`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{b.label}</span>
          </span>
        );
      })}
    </div>
  );
};
