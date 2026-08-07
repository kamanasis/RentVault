import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/cards/Card';
import { AgreementCard } from '../components/agreements/AgreementCard';
import { PrimaryButton } from '../components/buttons/PrimaryButton';
import { SecondaryButton } from '../components/buttons/SecondaryButton';
import { InputField } from '../components/forms/InputField';
import { useAgreements } from '../context/AgreementContext';
import { useWallet } from '../context/WalletContext';
import { Search, Plus, Filter, ArrowUpDown, FileCheck, Building, ShieldCheck, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AgreementDashboard = () => {
  const navigate = useNavigate();
  const { agreements, loading } = useAgreements();
  const { address } = useWallet();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All'); // 'All' | 'As Landlord' | 'As Tenant'
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const normalizedAddress = (address || '').toLowerCase().trim();

  // Internal identity filtering: connected wallet must participate as Landlord or Tenant
  const landlordAgreements = agreements.filter(
    (a) => (a.landlordWallet || '').toLowerCase().trim() === normalizedAddress
  );

  const tenantAgreements = agreements.filter(
    (a) => (a.tenantWallet || '').toLowerCase().trim() === normalizedAddress
  );

  const userAgreements = agreements.filter((a) => {
    const landlord = (a.landlordWallet || '').toLowerCase().trim();
    const tenant = (a.tenantWallet || '').toLowerCase().trim();
    return landlord === normalizedAddress || tenant === normalizedAddress;
  });

  const statusOptions = ['All', 'Awaiting Deposit', 'Deposit Locked', 'Lease Active', 'Refund Completed'];

  // Base list depending on Role filter tab
  const roleBaseAgreements = roleFilter === 'As Landlord' 
    ? landlordAgreements 
    : roleFilter === 'As Tenant' 
    ? tenantAgreements 
    : userAgreements;

  // Filter & Sort Logic applied on roleBaseAgreements
  const filteredAgreements = roleBaseAgreements
    .filter((a) => {
      const matchesSearch = 
        a.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.propertyAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.tenantWallet.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || a.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortBy === 'deposit') {
        return (b.depositAmount + b.utilityReserve) - (a.depositAmount + a.utilityReserve);
      }
      return 0;
    });

  return (
    <PageContainer>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
        <div>
          <h1 className="text-h1 text-text-primary mb-1">Rental Agreement Dashboard</h1>
          <p className="text-body text-text-secondary">
            View and manage rental agreements strictly associated with your connected Freighter wallet.
          </p>
        </div>

        <PrimaryButton icon={Plus} onClick={() => navigate('/agreements/new')}>
          Create Agreement
        </PrimaryButton>
      </div>

      {/* Filter & Search Bar */}
      <Card className="mb-8 space-y-5 p-5 sm:p-6">
        {/* Role Tabs */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-border/60">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRoleFilter('All')}
              className={`px-4 py-2 rounded-xl text-caption font-semibold transition-all cursor-pointer ${
                roleFilter === 'All' ? 'bg-primary text-white shadow-sm' : 'bg-surface text-text-secondary hover:text-text-primary'
              }`}
            >
              All ({userAgreements.length})
            </button>

            <button
              onClick={() => setRoleFilter('As Landlord')}
              className={`px-4 py-2 rounded-xl text-caption font-semibold transition-all cursor-pointer ${
                roleFilter === 'As Landlord' ? 'bg-primary text-white shadow-sm' : 'bg-surface text-text-secondary hover:text-text-primary'
              }`}
            >
              As Landlord ({landlordAgreements.length})
            </button>

            <button
              onClick={() => setRoleFilter('As Tenant')}
              className={`px-4 py-2 rounded-xl text-caption font-semibold transition-all cursor-pointer ${
                roleFilter === 'As Tenant' ? 'bg-success text-white shadow-sm' : 'bg-surface text-text-secondary hover:text-text-primary'
              }`}
            >
              As Tenant ({tenantAgreements.length})
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <InputField
              placeholder="Search by property name, address, ID (RV-2026-001), or tenant wallet..."
              icon={Search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted font-medium flex items-center gap-1 flex-shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-surface border border-border text-text-primary rounded-2xl px-4 py-3 text-caption outline-none cursor-pointer hover:border-primary/50 transition-colors"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="deposit">Deposit (High to Low)</option>
            </select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none border-t border-border/60">
          <span className="text-xs text-text-muted font-medium flex items-center gap-1 mr-2 flex-shrink-0">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          {statusOptions.map((opt) => {
            const isActive = statusFilter === opt;
            return (
              <button
                key={opt}
                onClick={() => setStatusFilter(opt)}
                className={`px-4 py-1.5 rounded-full text-caption font-medium transition-all cursor-pointer flex-shrink-0 ${
                  isActive 
                    ? 'bg-primary text-white font-semibold shadow-sm' 
                    : 'bg-surface/60 text-text-secondary hover:text-text-primary hover:bg-surface border border-border/40'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Agreement List Grid */}
      {filteredAgreements.length === 0 ? (
        <Card className="text-center py-12 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-text-muted mx-auto">
            <FileCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-h3 text-text-primary">No agreements found</h3>
            <p className="text-caption text-text-secondary max-w-md mx-auto">
              {searchQuery || statusFilter !== 'All' || roleFilter !== 'All'
                ? 'No rental agreements matched your current filters.' 
                : 'This wallet address is not currently associated with any rental agreements.'}
            </p>
          </div>
          <div className="pt-2">
            <PrimaryButton icon={Plus} onClick={() => navigate('/agreements/new')}>
              Create Agreement Now
            </PrimaryButton>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgreements.map((ag) => (
            <AgreementCard key={ag.id} agreement={ag} />
          ))}
        </div>
      )}
    </PageContainer>
  );
};
