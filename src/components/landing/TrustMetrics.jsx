import React from 'react';
import { Card } from '../cards/Card';
import { Coins, FileCheck, ShieldCheck } from 'lucide-react';
import { useAgreements } from '../../context/AgreementContext';

export const TrustMetrics = () => {
  let agreements = [];
  try {
    const ctx = useAgreements();
    agreements = ctx?.agreements || [];
  } catch {
    agreements = [];
  }

  const totalAgreements = agreements.length;
  const lockedXlm = agreements
    .filter((a) => a.status === 'Deposit Locked' || a.status === 'Lease Active' || a.status === 'Settlement Proposed')
    .reduce((sum, a) => sum + (parseFloat(a.fundedAmount || a.depositAmount) || 0), 0);

  const metrics = [
    {
      title: totalAgreements > 0 ? `${lockedXlm.toLocaleString()} XLM Protected` : '0 XLM Escrowed',
      subtitle: 'Secured in Soroban WASM contract vaults',
      icon: Coins,
      accent: 'text-primary-glow',
    },
    {
      title: totalAgreements > 0 ? `${totalAgreements} Digital Agreements` : '0 Agreements Created',
      subtitle: 'Decentralized contracts on Stellar Testnet',
      icon: FileCheck,
      accent: 'text-success',
    },
    {
      title: '100% Non-Custodial',
      subtitle: 'Direct tenant-to-contract authorization',
      icon: ShieldCheck,
      accent: 'text-warning',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <Card key={idx} hoverEffect className="relative overflow-hidden group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-primary group-hover:border-primary/50 group-hover:scale-105 transition-all">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className={`text-h3 font-bold ${m.accent}`}>
                  {m.title}
                </h3>
                <p className="text-caption text-text-secondary mt-0.5">
                  {m.subtitle}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
