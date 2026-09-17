import React, { useState } from 'react';
import { Card } from '../cards/Card';
import { PrimaryButton } from '../buttons/PrimaryButton';
import { SecondaryButton } from '../buttons/SecondaryButton';
import { 
  ShieldCheck, 
  Plus, 
  Wallet, 
  FileText, 
  Lock, 
  AlertCircle, 
  Search, 
  User, 
  Building, 
  Coins, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../../context/WalletContext';
import { trackEvent } from '../../services/analytics';

export const OnboardingCard = () => {
  const navigate = useNavigate();
  const { connected, address, rawBalance, fundTestnetAccount, isFetchingBalance } = useWallet();
  const [activeRole, setActiveRole] = useState('Landlord'); // 'Landlord' | 'Tenant'
  const [joinAgreementId, setJoinAgreementId] = useState('');
  const [fundingSuccess, setFundingSuccess] = useState(false);

  const landlordSteps = [
    { num: '1', title: 'Connect Wallet', desc: 'Authenticate via Freighter extension', icon: Wallet },
    { num: '2', title: 'Create Agreement', desc: 'Define security deposit & utility terms', icon: FileText },
    { num: '3', title: 'Share With Tenant', desc: 'Send agreement link or ID to tenant', icon: ShieldCheck },
    { num: '4', title: 'Manage & Release', desc: 'Authorize refund after inspection', icon: Lock },
  ];

  const tenantSteps = [
    { num: '1', title: 'Connect Wallet', desc: 'Authenticate your tenant Stellar address', icon: Wallet },
    { num: '2', title: 'Join Agreement', desc: 'Lookup agreement ID provided by landlord', icon: Search },
    { num: '3', title: 'Lock Deposit', desc: 'Lock funds in Soroban smart contract', icon: Lock },
    { num: '4', title: 'Auto-Refund', desc: 'Claim deposit refund upon lease completion', icon: CheckCircle2 },
  ];

  const handleCreate = () => {
    trackEvent('onboarding_cta_clicked', { role: 'Landlord' });
    navigate('/agreements/new');
  };

  const handleJoin = (e) => {
    e.preventDefault();
    const cleanId = joinAgreementId.trim();
    if (!cleanId) return;
    trackEvent('onboarding_join_clicked', { agreementId: cleanId });
    navigate(`/agreements/${cleanId}`);
  };

  const handleFund = async () => {
    try {
      await fundTestnetAccount();
      setFundingSuccess(true);
      trackEvent('onboarding_friendbot_funded');
      setTimeout(() => setFundingSuccess(false), 3000);
    } catch {
      // Handled in wallet context
    }
  };

  const isLowBalance = connected && rawBalance < 10;

  return (
    <Card className="p-6 sm:p-8 bg-gradient-to-br from-card via-surface to-card border border-primary/40 text-center space-y-6 shadow-stellar-glow">
      <div className="w-16 h-16 rounded-3xl bg-primary/10 border border-primary/30 text-primary-glow flex items-center justify-center mx-auto">
        <ShieldCheck className="w-8 h-8" />
      </div>

      <div className="space-y-2 max-w-xl mx-auto">
        <h2 className="text-h2 text-text-primary">
          {activeRole === 'Landlord' 
            ? 'Create your first blockchain-secured rental agreement' 
            : 'Join and fund your rental deposit escrow vault'}
        </h2>
        <p className="text-body text-text-secondary text-xs sm:text-sm">
          RentVault locks security deposits into Soroban smart contract vaults on Stellar Testnet, ensuring transparent auto-refunds and cryptographic utility settlements.
        </p>
      </div>

      {/* Role Pathway Selector */}
      <div className="flex items-center justify-center gap-2 max-w-sm mx-auto p-1.5 rounded-2xl bg-surface/80 border border-border">
        <button
          type="button"
          onClick={() => setActiveRole('Landlord')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeRole === 'Landlord'
              ? 'bg-primary text-white shadow-stellar'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>I am a Landlord</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveRole('Tenant')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeRole === 'Tenant'
              ? 'bg-cyan-500 text-white shadow-sm'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>I am a Tenant</span>
        </button>
      </div>

      {/* Testnet Safety & Friendbot Faucet Banner */}
      <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-400">
        <div className="flex items-center gap-2 text-left">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Stellar Testnet • Zero Real Funds • Non-Custodial Vault</span>
        </div>

        {connected && (
          <button
            type="button"
            onClick={handleFund}
            disabled={isFetchingBalance}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
              fundingSuccess
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                : 'bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-400/40 text-cyan-300'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>{isFetchingBalance ? 'Funding...' : fundingSuccess ? '+10,000 XLM Added!' : 'Get Free Testnet XLM'}</span>
          </button>
        )}
      </div>

      {/* Dynamic 4 Steps Grid based on Active Role */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left pt-1">
        {(activeRole === 'Landlord' ? landlordSteps : tenantSteps).map((s) => {
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

      {/* Role-Specific Action Bottom Area */}
      <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-center gap-3">
        {activeRole === 'Landlord' ? (
          <PrimaryButton icon={Plus} onClick={handleCreate}>
            Create Rental Agreement (Landlord)
          </PrimaryButton>
        ) : (
          <form onSubmit={handleJoin} className="flex flex-col sm:flex-row items-center gap-2 w-full max-w-md">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={joinAgreementId}
                onChange={(e) => setJoinAgreementId(e.target.value)}
                placeholder="Enter Agreement ID (e.g. AGR-1234)"
                className="w-full pl-9 pr-3 py-2.5 bg-surface/80 border border-border rounded-xl text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-cyan-400"
              />
            </div>
            <PrimaryButton type="submit" disabled={!joinAgreementId.trim()} icon={ArrowRight}>
              Lookup Agreement
            </PrimaryButton>
          </form>
        )}
      </div>
    </Card>
  );
};

