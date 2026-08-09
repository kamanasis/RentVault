import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, CheckCircle2, Coins, Cpu, Key } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { useAgreements } from '../../context/AgreementContext';

export const HeroVisual = () => {
  const { connected, address, truncateAddress } = useWallet();
  const { agreements } = useAgreements();

  const normalizedAddress = (address || '').toLowerCase().trim();

  // User participating agreements when wallet is connected
  const userAgreements = connected
    ? agreements.filter((a) => {
        const landlord = (a.landlordWallet || '').toLowerCase().trim();
        const tenant = (a.tenantWallet || '').toLowerCase().trim();
        return landlord === normalizedAddress || tenant === normalizedAddress;
      })
    : [];

  // Active escrows filter strictly derived for connected wallet
  const activeEscrows = connected
    ? userAgreements.filter((a) => {
        return (
          a.status === 'Deposit Locked' ||
          a.status === 'Lease Active' ||
          a.status === 'Lease Ended' ||
          a.status === 'Utility Settlement' ||
          a.status === 'Approval Pending'
        );
      })
    : [];

  // Dynamic live locked XLM balance
  const totalLockedXLM = connected
    ? activeEscrows.reduce((sum, a) => {
        const deposit = parseFloat(a.depositAmount || 0);
        const reserve = parseFloat(a.utilityReserve || 0);
        return sum + deposit + reserve;
      }, 0)
    : 0;

  const activeCount = connected ? activeEscrows.length : 0;

  // Primary active agreement status for Center Card
  const primaryActiveAgreement = activeEscrows[0] || userAgreements[0];
  const currentStatusText = primaryActiveAgreement
    ? primaryActiveAgreement.status
    : 'No Active Escrow';

  return (
    <div className="relative w-full max-w-lg mx-auto aspect-square flex items-center justify-center p-4">
      {/* Background Radial Ambient Glow */}
      <div className="absolute inset-0 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Outer Rotating Soroban Ring - Slower 45s Rotation */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
        className="absolute w-[86%] h-[86%] rounded-full border border-dashed border-primary/25 flex items-center justify-center pointer-events-none"
      >
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-card/90 backdrop-blur-md border border-primary/40 text-primary-glow px-3 py-1 rounded-full text-[11px] font-mono flex items-center gap-1.5 shadow-stellar">
          <Cpu className="w-3.5 h-3.5 text-primary" /> Soroban Escrow Contract
        </div>
        <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 bg-card/90 backdrop-blur-md border px-3 py-1 rounded-full text-[11px] font-mono flex items-center gap-1.5 shadow-stellar ${
          connected && activeCount > 0 
            ? 'border-success/40 text-success' 
            : 'border-primary/30 text-text-secondary'
        }`}>
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{connected && activeCount > 0 ? 'Escrow Session Active' : 'Stellar Testnet Active'}</span>
        </div>
      </motion.div>

      {/* Middle Glowing Surface Circle */}
      <div className="absolute w-[66%] h-[66%] rounded-full bg-surface/70 border border-border/80 flex items-center justify-center shadow-card-glow backdrop-blur-md">
        <div className="w-[88%] h-[88%] rounded-full bg-gradient-to-tr from-primary/15 via-surface to-primary/5 border border-primary/20 flex items-center justify-center" />
      </div>

      {/* Central Vault Isometric Card */}
      <motion.div 
        animate={{ y: [-4, 4, -4] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 w-44 h-44 rounded-3xl bg-gradient-to-b from-card via-card to-surface border border-primary/40 p-6 flex flex-col items-center justify-center text-center shadow-stellar-glow group cursor-pointer"
      >
        <div className="w-14 h-14 rounded-2xl bg-surface border border-primary/30 flex items-center justify-center text-primary-glow mb-2 group-hover:scale-105 group-hover:border-primary/60 transition-all duration-300">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-text-primary">
          <Lock className="w-3.5 h-3.5 text-success" />
          <span>RentVault Escrow</span>
        </div>
        <span className="text-[10px] text-text-muted font-mono mt-0.5 tracking-wider truncate max-w-[130px]">
          {connected ? truncateAddress(address) : 'Wallet Not Connected'}
        </span>
        {connected && (
          <span className="text-[9px] font-medium text-primary-glow mt-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
            {currentStatusText}
          </span>
        )}
      </motion.div>

      {/* Dynamic Floating Escrow Balance Card (Shared State with AgreementContext) */}
      <motion.div 
        animate={{ y: [-3, 3, -3] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-8 left-2 z-20 bg-card/95 backdrop-blur-md border border-border px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-3 max-w-[210px]"
      >
        <div className="w-8 h-8 rounded-xl bg-surface border border-border flex items-center justify-center text-success flex-shrink-0">
          <Coins className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] text-text-muted uppercase tracking-wider font-medium">Escrow Balance</div>
          <div>
            <div className="text-xs font-bold text-text-primary">{totalLockedXLM.toLocaleString('en-US')} XLM Locked</div>
            <div className="text-[9px] text-text-muted">
              {activeCount > 0 
                ? `${activeCount} active escrow agreement${activeCount > 1 ? 's' : ''}` 
                : 'No active escrow agreements'}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Freighter Wallet Connection Status Card */}
      <motion.div 
        animate={{ y: [4, -4, 4] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        className="absolute bottom-10 right-2 z-20 bg-card/95 backdrop-blur-md border border-border px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-3"
      >
        <div className="w-8 h-8 rounded-xl bg-surface border border-border flex items-center justify-center text-primary-glow flex-shrink-0">
          <Key className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] text-text-muted uppercase tracking-wider font-medium">Freighter Wallet</div>
          {connected ? (
            <div className="text-xs font-bold text-success flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Connected
            </div>
          ) : (
            <div className="text-xs font-bold text-text-muted flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-border" /> Disconnected
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
