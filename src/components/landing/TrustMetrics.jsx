import React from 'react';
import { Card } from '../cards/Card';
import { Coins, FileCheck, ShieldCheck } from 'lucide-react';

export const TrustMetrics = () => {
  const metrics = [
    {
      title: '250+ XLM Protected',
      subtitle: 'Secured across Soroban escrow vaults',
      icon: Coins,
      accent: 'text-primary-glow',
    },
    {
      title: '12 Agreements Created',
      subtitle: 'Digital rental contracts on Stellar Testnet',
      icon: FileCheck,
      accent: 'text-success',
    },
    {
      title: '100% On-Chain Transparency',
      subtitle: 'Verifiable transactions on Horizon API',
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
