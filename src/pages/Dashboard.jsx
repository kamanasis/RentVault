import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Section } from '../components/layout/Section';
import { Card } from '../components/cards/Card';
import { BalanceCard } from '../components/wallet/BalanceCard';
import { WalletCard } from '../components/wallet/WalletCard';
import { WalletStatus } from '../components/wallet/WalletStatus';
import { WalletButton } from '../components/wallet/WalletButton';
import { TransactionList } from '../components/wallet/TransactionList';
import { AgreementCard } from '../components/agreements/AgreementCard';
import { NetworkBadge } from '../components/wallet/NetworkBadge';
import { StatusBadge } from '../components/status/StatusBadge';
import { PrimaryButton } from '../components/buttons/PrimaryButton';
import { SecondaryButton } from '../components/buttons/SecondaryButton';
import { useWallet } from '../context/WalletContext';
import { useAgreements } from '../context/AgreementContext';
import { 
  Building, 
  UserCheck, 
  Send, 
  FileText, 
  Plus, 
  ShieldCheck, 
  Wallet,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { connected, address, network, disconnectWallet } = useWallet();
  const { agreements } = useAgreements();

  const quickActions = [
    {
      title: 'Continue as Landlord',
      subtitle: 'Create digital rental security agreements',
      icon: Building,
      badge: 'Escrow Creator',
      action: () => navigate('/agreements/new'),
      accent: 'border-primary/40 hover:border-primary',
      ctaText: 'New Agreement',
    },
    {
      title: 'Continue as Tenant',
      subtitle: 'Review & manage your active agreements',
      icon: UserCheck,
      badge: 'Escrow Tenant',
      action: () => navigate('/agreements'),
      accent: 'border-success/40 hover:border-success',
      ctaText: 'View Agreements',
    },
    {
      title: 'Send Test XLM',
      subtitle: 'Send native payment on Stellar Testnet',
      icon: Send,
      badge: 'Testnet Payment',
      action: () => navigate('/payment'),
      accent: 'border-warning/40 hover:border-warning',
      ctaText: 'Send XLM',
    },
    {
      title: 'Recent Transactions',
      subtitle: 'View your Stellar Testnet wallet transaction history and payment activity',
      icon: FileText,
      badge: 'Horizon API',
      action: () => navigate('/transactions'),
      accent: 'border-primary/40 hover:border-primary-glow',
      ctaText: 'Open History',
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
            Manage your Soroban smart contract agreements, live XLM account balance, and security deposit escrow vaults.
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
          {/* Phase 4 Live XLM Balance Card */}
          <BalanceCard />

          {/* Phase 4.5 Recent Transactions Preview Section */}
          <TransactionList limit={3} isPreview={true} />

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
                        <p className="text-caption text-text-secondary leading-relaxed">
                          {qa.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-border/60 flex items-center text-caption font-medium text-primary-glow group-hover:translate-x-1 transition-transform">
                      <span>{qa.ctaText}</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Phase 5 Active Agreements Overview Section */}
          <Section className="py-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-h2 text-text-primary mb-1">Active Rental Agreements</h2>
                <p className="text-caption text-text-secondary">Digital security deposit agreements managed via RentVault.</p>
              </div>
              <div className="flex items-center gap-3">
                <SecondaryButton onClick={() => navigate('/agreements')}>
                  View All ({agreements.length})
                </SecondaryButton>
                <PrimaryButton icon={Plus} onClick={() => navigate('/agreements/new')}>
                  Create Agreement
                </PrimaryButton>
              </div>
            </div>

            {agreements.length === 0 ? (
              <Card className="p-8 text-center border-dashed">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-text-muted mx-auto">
                    <Building className="w-6 h-6" />
                  </div>
                  <h3 className="text-h3 text-text-primary">No rental agreements created</h3>
                  <p className="text-body text-text-secondary">
                    Create your first digital rental agreement to establish deposit terms and utility reserves.
                  </p>
                  <PrimaryButton icon={Plus} onClick={() => navigate('/agreements/new')}>
                    Create Agreement Now
                  </PrimaryButton>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agreements.slice(0, 3).map((ag) => (
                  <AgreementCard key={ag.id} agreement={ag} />
                ))}
              </div>
            )}
          </Section>
        </div>
      )}
    </PageContainer>
  );
};
