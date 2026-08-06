import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Section } from '../components/layout/Section';
import { PrimaryButton } from '../components/buttons/PrimaryButton';
import { SecondaryButton } from '../components/buttons/SecondaryButton';
import { FeatureCard } from '../components/cards/FeatureCard';
import { StatCard } from '../components/cards/StatCard';
import { StatusBadge } from '../components/status/StatusBadge';
import { 
  ShieldCheck, 
  Lock, 
  Clock, 
  Zap, 
  Wallet, 
  Play, 
  ArrowRight,
  TrendingUp,
  Coins,
  FileCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      {/* Hero Section */}
      <Section className="text-center pt-8 pb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border mb-8 shadow-sm">
          <StatusBadge variant="primary" size="sm">New</StatusBadge>
          <span className="text-caption text-text-secondary">
            Powered by Soroban Smart Contracts on Stellar
          </span>
        </div>

        <h1 className="text-hero max-w-4xl mx-auto mb-6 text-text-primary tracking-tight">
          Trustless Rental Security Deposits on <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">Stellar</span>
        </h1>

        <p className="text-body text-text-secondary max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
          RentVault automates rental security deposit escrows with smart auto-release timers, shared utility deductions, and transparent blockchain settlements.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <PrimaryButton 
            icon={Wallet} 
            onClick={() => alert('Phase 1 Placeholder: Wallet connection will be implemented in future phases.')}
          >
            Connect Freighter Wallet
          </PrimaryButton>

          <SecondaryButton 
            icon={Play}
            onClick={() => navigate('/dashboard')}
          >
            Watch Demo Dashboard
          </SecondaryButton>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
          <StatCard 
            title="Total Escrow Locked"
            value="124,500 XLM"
            change="+18.4%"
            changeType="positive"
            icon={Coins}
            caption="Verified on Horizon API"
          />
          <StatCard 
            title="Active Agreements"
            value="48"
            change="100% On-Chain"
            changeType="positive"
            icon={FileCheck}
            caption="Soroban Escrow Contracts"
          />
          <StatCard 
            title="Avg Settlement Time"
            value="< 2.4 Mins"
            change="Instant Refund"
            changeType="positive"
            icon={TrendingUp}
            caption="Automated Timers"
          />
        </div>
      </Section>

      {/* Feature Cards Section */}
      <Section id="features">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-h1 text-text-primary mb-4">
            Built for Modern Tenants & Landlords
          </h2>
          <p className="text-body text-text-secondary">
            Eliminate disputes and waiting periods with automated Web3 smart contract rules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={Lock}
            title="Soroban Escrow Locking"
            description="Tenant security deposits are securely locked in immutable Soroban smart contracts on the Stellar blockchain until lease fulfillment."
            badge="Security"
          />

          <FeatureCard 
            icon={Clock}
            title="Smart Auto-Release Timer"
            description="If a landlord is inactive post-lease, our automated contract timer triggers a full tenant deposit refund without delays."
            badge="Automation"
          />

          <FeatureCard 
            icon={Zap}
            title="Shared Utility Settlement"
            description="Transparently deduct final electricity, water, or repair bills directly from the deposit reserve with verifiable on-chain logs."
            badge="Utility Reserve"
          />
        </div>
      </Section>

      {/* How it Works Section */}
      <Section className="bg-card/40 border border-border rounded-3xl p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <StatusBadge variant="primary">Seamless Workflow</StatusBadge>
            <h2 className="text-h2 text-text-primary">
              Ready to create your first decentralized rental agreement?
            </h2>
            <p className="text-body text-text-secondary">
              Experience the future of transparent, automated security deposit escrows today.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <PrimaryButton 
              icon={ArrowRight} 
              onClick={() => navigate('/agreement/create')}
            >
              Create Agreement Now
            </PrimaryButton>
          </div>
        </div>
      </Section>
    </PageContainer>
  );
};
