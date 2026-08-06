import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, CheckCircle2, Coins, Cpu, Key } from 'lucide-react';

export const HeroVisual = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto aspect-square flex items-center justify-center p-4">
      {/* Background Radial Ambient Glow - Soft & Subtle */}
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
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-card/90 backdrop-blur-md border border-success/40 text-success px-3 py-1 rounded-full text-[11px] font-mono flex items-center gap-1.5 shadow-stellar">
          <CheckCircle2 className="w-3.5 h-3.5 text-success" /> Stellar Testnet Active
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
        <div className="w-16 h-16 rounded-2xl bg-surface border border-primary/30 flex items-center justify-center text-primary-glow mb-3 group-hover:scale-105 group-hover:border-primary/60 transition-all duration-300">
          <Shield className="w-9 h-9 text-primary" />
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-text-primary">
          <Lock className="w-3.5 h-3.5 text-success" />
          <span>RentVault Escrow</span>
        </div>
        <span className="text-[10px] text-text-muted font-mono mt-0.5 tracking-wider">CB7X...XLM9</span>
      </motion.div>

      {/* Floating Web3 Activity Chips */}
      <motion.div 
        animate={{ y: [-3, 3, -3] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-8 left-2 z-20 bg-card/95 backdrop-blur-md border border-border px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-3"
      >
        <div className="w-8 h-8 rounded-xl bg-surface border border-border flex items-center justify-center text-success">
          <Coins className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] text-text-muted uppercase tracking-wider font-medium">Escrow Balance</div>
          <div className="text-xs font-bold text-text-primary">2,500 XLM Locked</div>
        </div>
      </motion.div>

      <motion.div 
        animate={{ y: [4, -4, 4] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        className="absolute bottom-10 right-2 z-20 bg-card/95 backdrop-blur-md border border-border px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-3"
      >
        <div className="w-8 h-8 rounded-xl bg-surface border border-border flex items-center justify-center text-primary-glow">
          <Key className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] text-text-muted uppercase tracking-wider font-medium">Freighter Wallet</div>
          <div className="text-xs font-bold text-success flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Connected
          </div>
        </div>
      </motion.div>
    </div>
  );
};
