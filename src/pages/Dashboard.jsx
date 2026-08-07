import React, { useState } from 'react';
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
  ArrowRight,
  Shield,
  Layers,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { connected, address, network, disconnectWallet } = useWallet();
  const { agreements } = useAgreements();

  const [workspaceFilter, setWorkspaceFilter] = useState('all'); // 'all' | 'landlord' | 'tenant'

  const normalizedAddress = (address || '').toLowerCase().trim();

  // Role-filtered agreement sets
  const landlordAgreements = agreements.filter(
    (a) => (a.landlordWallet || '').toLowerCase().trim() === normalizedAddress
  );
  const tenantAgreements = agreements.filter(
    (a) => (a.tenantWallet || '').toLowerCase().trim() === normalizedAddress
  );

  const activeAgreementsList = workspaceFilter === 'landlord'
    ? landlordAgreements
    : workspaceFilter === 'tenant'
    ? tenantAgreements
    : agreements;

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

          {/* Phase 6.5 Role Workspaces Grid */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-h2 text-text-primary mb-1">Role Workspaces & Actions</h2>
                <p className="text-caption text-text-secondary">Select an action based on your wallet identity (Landlord or Tenant).</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Landlord Workspace Card */}
              <Card
                hoverEffect
                onClick={() => navigate('/agreements/new')}
                className="cursor-pointer group flex flex-col justify-between border-primary/40 hover:border-primary"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-primary-glow group-hover:scale-105 transition-transform">
                      <Shield className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary-glow">
                      Landlord Workspace
                    </span>
                  </div>

                  <div>
                    <h3 className="text-h3 text-text-primary mb-1 group-hover:text-primary-glow transition-colors">
                      Create New Agreement
                    </h3>
                    <p className="text-caption text-text-secondary leading-relaxed">
                      Draft rental deposit terms, reserve allocations, and assign tenant wallet addresses.
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-border/60 flex items-center text-caption font-medium text-primary-glow group-hover:translate-x-1 transition-transform">
                  <span>Create Agreement</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Card>

              {/* Tenant Workspace Card */}
              <Card
                hoverEffect
                onClick={() => navigate('/agreements')}
                className="cursor-pointer group flex flex-col justify-between border-success/40 hover:border-success"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-success group-hover:scale-105 transition-transform">
                      <UserCheck className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-success/10 border border-success/30 text-success">
                      Tenant Workspace
                    </span>
                  </div>

                  <div>
                    <h3 className="text-h3 text-text-primary mb-1 group-hover:text-success transition-colors">
                      Fund Escrow Deposit
                    </h3>
                    <p className="text-caption text-text-secondary leading-relaxed">
                      Review assigned agreements and execute Soroban smart contract deposit locks.
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-border/60 flex items-center text-caption font-medium text-success group-hover:translate-x-1 transition-transform">
                  <span>Fund Deposit</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Card>

              {/* Send Test XLM */}
              <Card
                hoverEffect
                onClick={() => navigate('/payment')}
                className="cursor-pointer group flex flex-col justify-between border-warning/40 hover:border-warning"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-warning group-hover:scale-105 transition-transform">
                      <Send className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-surface border border-border text-text-secondary">
                      Testnet Payment
                    </span>
                  </div>

                  <div>
                    <h3 className="text-h3 text-text-primary mb-1 group-hover:text-warning transition-colors">
                      Send Test XLM
                    </h3>
                    <p className="text-caption text-text-secondary leading-relaxed">
                      Send native payments directly on Stellar Testnet via Freighter signing.
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-border/60 flex items-center text-caption font-medium text-warning group-hover:translate-x-1 transition-transform">
                  <span>Send XLM</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Card>

              {/* Recent Transactions */}
              <Card
                hoverEffect
                onClick={() => navigate('/transactions')}
                className="cursor-pointer group flex flex-col justify-between border-primary/40 hover:border-primary-glow"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-primary-glow group-hover:scale-105 transition-transform">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-surface border border-border text-text-secondary">
                      Horizon API
                    </span>
                  </div>

                  <div>
                    <h3 className="text-h3 text-text-primary mb-1 group-hover:text-primary-glow transition-colors">
                      Recent Transactions
                    </h3>
                    <p className="text-caption text-text-secondary leading-relaxed">
                      View your Stellar Testnet wallet transaction history and payment activity.
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-border/60 flex items-center text-caption font-medium text-primary-glow group-hover:translate-x-1 transition-transform">
                  <span>Open History</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Card>
            </div>
          </div>

          {/* Phase 6.5 Role-Filtered Agreements Section */}
          <Section className="py-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-h2 text-text-primary mb-1">Your Role Agreements</h2>
                <p className="text-caption text-text-secondary">Filtered by your connected wallet identity.</p>
              </div>

              {/* Role Filter Tabs */}
              <div className="flex items-center gap-2 bg-surface/60 p-1.5 rounded-2xl border border-border/60">
                <button
                  onClick={() => setWorkspaceFilter('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-caption font-medium transition-all cursor-pointer ${
                    workspaceFilter === 'all' ? 'bg-primary text-white font-semibold shadow-sm' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  All ({agreements.length})
                </button>
                <button
                  onClick={() => setWorkspaceFilter('landlord')}
                  className={`px-3.5 py-1.5 rounded-xl text-caption font-medium transition-all cursor-pointer ${
                    workspaceFilter === 'landlord' ? 'bg-primary text-white font-semibold shadow-sm' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  As Landlord ({landlordAgreements.length})
                </button>
                <button
                  onClick={() => setWorkspaceFilter('tenant')}
                  className={`px-3.5 py-1.5 rounded-xl text-caption font-medium transition-all cursor-pointer ${
                    workspaceFilter === 'tenant' ? 'bg-success text-white font-semibold shadow-sm' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  As Tenant ({tenantAgreements.length})
                </button>
              </div>
            </div>

            {activeAgreementsList.length === 0 ? (
              <Card className="p-8 text-center border-dashed space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-text-muted mx-auto">
                  <Building className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-h3 text-text-primary">
                    {workspaceFilter === 'landlord' 
                      ? 'No agreements created by your wallet' 
                      : workspaceFilter === 'tenant' 
                      ? 'No agreements assigned to your tenant wallet' 
                      : 'No rental agreements found'}
                  </h3>
                  <p className="text-body text-text-secondary max-w-md mx-auto">
                    {workspaceFilter === 'landlord' 
                      ? 'Create your first digital rental agreement as a landlord.' 
                      : workspaceFilter === 'tenant' 
                      ? 'Ask your landlord to assign an agreement to your Stellar wallet address.' 
                      : 'Create or view digital security deposit agreements.'}
                  </p>
                </div>
                {workspaceFilter === 'landlord' && (
                  <PrimaryButton icon={Plus} onClick={() => navigate('/agreements/new')}>
                    Create Agreement Now
                  </PrimaryButton>
                )}
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeAgreementsList.slice(0, 3).map((ag) => (
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
