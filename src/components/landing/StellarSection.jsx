import React from 'react';
import { Card } from '../cards/Card';
import { StatusBadge } from '../status/StatusBadge';
import { PrimaryButton } from '../buttons/PrimaryButton';
import { Cpu, Zap, Shield, Wallet, ArrowRight, ExternalLink } from 'lucide-react';

export const StellarSection = () => {
  const highlights = [
    { title: 'Stellar Testnet', desc: 'Instant, reliable network environment for risk-free escrow testing.', icon: Zap },
    { title: 'Soroban Smart Contracts', desc: 'Rust-based WebAssembly smart contract engine enforcing deposit rules.', icon: Cpu },
    { title: 'Freighter Wallet Integration', desc: 'Non-custodial cryptographic key signing directly in browser.', icon: Wallet },
    { title: 'Sub-Second Finality', desc: 'Near-instant transaction confirmations with fraction-of-a-cent fees.', icon: Shield },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-card via-surface to-card border border-primary/30 rounded-3xl p-8 md:p-14 shadow-stellar-glow">
      {/* Background Radial Ambient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <StatusBadge variant="primary" size="md">
            Built for the Stellar Ecosystem
          </StatusBadge>
          
          <h2 className="text-h1 text-text-primary leading-tight">
            High-Performance Web3 Security Built on <span className="bg-gradient-to-r from-primary via-primary-glow to-white bg-clip-text text-transparent">Stellar & Soroban</span>
          </h2>

          <p className="text-body text-text-secondary leading-relaxed">
            Stellar provides the ultimate layer-1 foundation for real-world financial escrows, offering sub-second transaction finality, deterministic fees, and industrial-grade smart contract capabilities via Soroban.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a 
              href="https://soroban.stellar.org" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-caption font-semibold text-primary-glow hover:underline"
            >
              Learn about Soroban Contracts <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {highlights.map((h, idx) => {
            const Icon = h.icon;
            return (
              <div 
                key={idx} 
                className="bg-card/80 backdrop-blur-md border border-border p-5 rounded-2xl space-y-2 hover:border-primary/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-primary-glow">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-body font-semibold text-text-primary">{h.title}</h4>
                <p className="text-caption text-text-secondary">{h.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
