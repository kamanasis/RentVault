import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Section } from '../components/layout/Section';
import { Card } from '../components/cards/Card';
import { StatCard } from '../components/cards/StatCard';
import { StatusBadge } from '../components/status/StatusBadge';
import { PrimaryButton } from '../components/buttons/PrimaryButton';
import { SecondaryButton } from '../components/buttons/SecondaryButton';
import { Wallet, Plus, Shield, ArrowUpRight, Clock, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-h1 text-text-primary mb-2">Escrow Dashboard</h1>
          <p className="text-body text-text-secondary">
            Manage active rental deposits, track settlements, and create new contracts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <PrimaryButton icon={Plus} onClick={() => navigate('/agreement/create')}>
            New Agreement
          </PrimaryButton>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Active Escrows"
          value="2 Contracts"
          change="Live"
          changeType="positive"
          icon={Shield}
        />
        <StatCard 
          title="Locked Deposit"
          value="3,500 XLM"
          change="Testnet"
          changeType="primary"
          icon={Wallet}
        />
        <StatCard 
          title="Pending Settlements"
          value="1 Agreement"
          change="Review"
          changeType="warning"
          icon={Clock}
        />
        <StatCard 
          title="Total Refunds Received"
          value="1,200 XLM"
          change="Completed"
          changeType="positive"
          icon={ArrowUpRight}
        />
      </div>

      {/* Active Agreements Placeholder List */}
      <Section className="py-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-h2 text-text-primary">Your Rental Agreements</h2>
          <SecondaryButton onClick={() => navigate('/transactions')}>View All Logs</SecondaryButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <Card hoverEffect className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-text-muted">AGR-2026-9041</span>
              <StatusBadge variant="success">Lease Active</StatusBadge>
            </div>

            <div>
              <h3 className="text-h3 text-text-primary">Sunset Bay Apartments #402</h3>
              <p className="text-caption text-text-secondary mt-1">Tenant: GDKX...89A1 | Landlord: GB7X...42F0</p>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <div>
                <span className="text-xs text-text-muted block">Security Deposit</span>
                <span className="text-lg font-bold text-primary-glow">2,500 XLM</span>
              </div>
              <PrimaryButton 
                className="text-xs py-2 px-4 min-h-[36px]"
                onClick={() => navigate('/agreement/AGR-2026-9041')}
              >
                View Details
              </PrimaryButton>
            </div>
          </Card>

          <Card hoverEffect className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-text-muted">AGR-2026-8812</span>
              <StatusBadge variant="warning">Utility Settlement</StatusBadge>
            </div>

            <div>
              <h3 className="text-h3 text-text-primary">Metro Loft Suites #12</h3>
              <p className="text-caption text-text-secondary mt-1">Tenant: GC2Y...19D4 | Landlord: GD9K...90B3</p>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <div>
                <span className="text-xs text-text-muted block">Reserve Allocated</span>
                <span className="text-lg font-bold text-warning">1,000 XLM</span>
              </div>
              <SecondaryButton 
                className="text-xs py-2 px-4 min-h-[36px]"
                onClick={() => navigate('/agreement/AGR-2026-8812/settlement')}
              >
                Review Bills
              </SecondaryButton>
            </div>
          </Card>

        </div>
      </Section>
    </PageContainer>
  );
};
