import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Section } from '../components/layout/Section';
import { Card } from '../components/cards/Card';
import { WalletCard } from '../components/wallet/WalletCard';
import { WalletStatus } from '../components/wallet/WalletStatus';
import { WalletButton } from '../components/wallet/WalletButton';
import { NetworkBadge } from '../components/wallet/NetworkBadge';
import { StatusBadge } from '../components/status/StatusBadge';
import { PrimaryButton } from '../components/buttons/PrimaryButton';
import { SecondaryButton } from '../components/buttons/SecondaryButton';
import { useWallet } from '../context/WalletContext';
import { 
  Building, 
  UserCheck, 
  Send, 
  FileText, 
  Plus, 
  ShieldCheck, 
  Wallet,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { connected, address, network, disconnectWallet } = useWallet();

  const quickActions = [
    {
      title: 'Continue as Landlord',
      subtitle: 'Create & manage rental agreements',
      icon: Building,
      badge: 'Escrow Creator',
      action: () => navigate('/agreement/create'),
      accent: 'border-primary/40 hover:border-primary',
    },
    {
      title: 'Continue as Tenant',
      subtitle: 'Deposit XLM & view lease terms',
      icon: UserCheck,
      badge: 'Escrow Tenant',
      action: () => navigate('/agreement/AGR-2026-9041'),
      accent: 'border-success/40 hover:border-success',
    },
    {
      title: 'Send Test XLM',
      subtitle: 'Fund testnet account via Stellar Faucet',
      icon: Send,
      badge: 'Stellar Faucet',
      action: () => window.open('https://laboratory.stellar.org/#account-creator?network=test', '_blank'),
      accent: 'border-warning/40 hover:border-warning',
    },
    {
      title: 'View Transactions',
      subtitle: 'Inspect on-chain Soroban contract logs',
      icon: FileText,
      badge: 'Horizon Ledger',
      action: () => navigate('/transactions'),
      accent: 'border-primary/40 hover:border-primary-glow',
    },
  ];

  return (
    <PageContainer>
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-h1 text-text-primary">Stellar Escrow Dashboard</h1>
            {connected ? (
              <NetworkBadge network={network} />
            ) : (
              <StatusBadge variant="neutral">Wallet Disconnected</StatusBadge>
            )}
          </div>
          <p className="text-body text-text-secondary">
            Manage your Soroban smart contract agreements, wallet session, and security deposit escrow vaults.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {connected ? (
            <SecondaryButton onClick={disconnectWallet}>
              Disconnect Session
            </SecondaryButton>
          ) : (
            <WalletButton pulse />
          )}
        </div>
      </div>

      {/* If wallet is disconnected, show high-contrast prompt */}
      {!connected ? (
        <Card className="text-center py-12 max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-primary/10 border border-primary/30 text-primary-glow flex items-center justify-center mx-auto">
            <Wallet className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-h2 text-text-primary">Connect Freighter Wallet</h2>
            <p className="text-body text-text-secondary max-w-md mx-auto">
              Please authenticate your Stellar Testnet wallet address using the Freighter extension to access your dashboard.
            </p>
          </div>
          <div className="pt-2">
            <WalletButton pulse />
          </div>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Top Section: Wallet Overview & Session Status Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <WalletCard />
            </div>
            <div>
              <WalletStatus />
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-h2 text-text-primary mb-1">Quick Escrow Actions</h2>
                <p className="text-caption text-text-secondary">Choose an action to manage your rental deposit workflow.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((qa, idx) => {
                const Icon = qa.icon;
                return (
                  <Card
                    key={idx}
                    hoverEffect
                    onClick={qa.action}
                    className={`cursor-pointer group flex flex-col justify-between ${qa.accent}`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-primary-glow group-hover:scale-105 transition-transform">
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-surface border border-border text-text-secondary">
                          {qa.badge}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-h3 text-text-primary mb-1 group-hover:text-primary-glow transition-colors">
                          {qa.title}
                        </h3>
                        <p className="text-caption text-text-secondary">
                          {qa.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-border/60 flex items-center text-caption font-medium text-primary-glow group-hover:translate-x-1 transition-transform">
                      <span>Open Action</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Active Agreements Overview Placeholder */}
          <Section className="py-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-h2 text-text-primary">Active Escrow Contracts</h2>
              <PrimaryButton icon={Plus} onClick={() => navigate('/agreement/create')}>
                Create Agreement
              </PrimaryButton>
            </div>

            <Card className="p-8 text-center border-dashed">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-text-muted mx-auto">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-h3 text-text-primary">Ready for Phase 4 Smart Contracts</h3>
                <p className="text-body text-text-secondary">
                  Your Freighter wallet <code className="font-mono text-primary-glow">{address.slice(0, 6)}...{address.slice(-4)}</code> is authenticated on Stellar Testnet and ready for Soroban escrow contract deployment.
                </p>
                <SecondaryButton onClick={() => navigate('/agreement/create')}>
                  Start New Agreement Draft
                </SecondaryButton>
              </div>
            </Card>
          </Section>
        </div>
      )}
    </PageContainer>
  );
};
