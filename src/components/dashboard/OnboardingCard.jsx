import React from 'react';
import { Card } from '../cards/Card';
import { PrimaryButton } from '../buttons/PrimaryButton';
import { ShieldCheck, Plus, Wallet, FileText, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const OnboardingCard = () => {
  const navigate = useNavigate();

  const steps = [
    { num: '1', title: 'Connect Wallet', desc: 'Authenticate via Freighter extension', icon: Wallet },
    { num: '2', title: 'Create Agreement', desc: 'Define security deposit & utility terms', icon: FileText },
    { num: '3', title: 'Share With Tenant', desc: 'Provide agreement link to tenant', icon: ShieldCheck },
    { num: '4', title: 'Lock Deposit', desc: 'Lock funds in Soroban smart contract', icon: Lock },
  ];

  return (
    <Card className="p-8 bg-gradient-to-br from-card via-surface to-card border border-primary/40 text-center space-y-6 shadow-stellar-glow">
      <div className="w-16 h-16 rounded-3xl bg-primary/10 border border-primary/30 text-primary-glow flex items-center justify-center mx-auto">
        <ShieldCheck className="w-8 h-8" />
      </div>

      <div className="space-y-2 max-w-lg mx-auto">
        <h2 className="text-h2 text-text-primary">
          Create your first blockchain-secured rental agreement in under 60 seconds
        </h2>
        <p className="text-body text-text-secondary">
          RentVault locks security deposits into Soroban smart contract vaults on Stellar, ensuring instant auto-refunds and verifiable utility settlements.
        </p>
      </div>

      {/* 4 Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left pt-2">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.num} className="p-4 bg-background/80 rounded-2xl border border-border/80 space-y-2 relative group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold w-6 h-6 rounded-full bg-primary/10 border border-primary/30 text-primary-glow flex items-center justify-center">
                  {s.num}
                </span>
                <Icon className="w-4 h-4 text-text-muted group-hover:text-primary-glow transition-colors" />
              </div>
              <div>
                <h4 className="text-caption font-semibold text-text-primary">{s.title}</h4>
                <p className="text-xs text-text-secondary mt-0.5">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4 border-t border-border/60 flex justify-center">
        <PrimaryButton icon={Plus} onClick={() => navigate('/agreements/new')}>
          Create First Agreement Now
        </PrimaryButton>
      </div>
    </Card>
  );
};
