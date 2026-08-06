import React from 'react';
import { Card } from '../cards/Card';
import { Wallet, FilePlus, Lock, RefreshCw } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      step: '01',
      title: 'Connect Freighter Wallet',
      desc: 'Authenticate your Stellar Testnet wallet address securely in one click.',
      icon: Wallet,
    },
    {
      step: '02',
      title: 'Create Rental Agreement',
      desc: 'Landlord sets property terms, deposit requirements, and lease duration.',
      icon: FilePlus,
    },
    {
      step: '03',
      title: 'Lock Deposit in Escrow',
      desc: 'Tenant signs the transaction; funds are securely locked in Soroban.',
      icon: Lock,
    },
    {
      step: '04',
      title: 'Automatic Refund Release',
      desc: 'On lease end, utility deductions are computed and remaining XLM is refunded.',
      icon: RefreshCw,
    },
  ];

  return (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-primary font-semibold mb-2 block">
          Simple 4-Step Process
        </span>
        <h2 className="text-h1 text-text-primary mb-4">
          How RentVault Escrow Works
        </h2>
        <p className="text-body text-text-secondary">
          A seamless, transparent workflow designed for complete peace of mind throughout your entire lease.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <Card key={idx} hoverEffect className="relative flex flex-col justify-between group">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-primary group-hover:border-primary/50 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-2xl font-mono font-bold text-border group-hover:text-primary-glow transition-colors">
                  {s.step}
                </span>
              </div>

              <div>
                <h3 className="text-h3 text-text-primary mb-2 group-hover:text-primary-glow transition-colors">
                  {s.title}
                </h3>
                <p className="text-caption text-text-secondary leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
