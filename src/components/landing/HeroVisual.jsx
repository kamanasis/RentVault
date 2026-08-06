import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, CheckCircle2, Coins, Cpu, Key } from 'lucide-react';

export const HeroVisual = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto aspect-square flex items-center justify-center p-4">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-primary/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      
      {/* Outer Rotating Escrow Ring */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute w-[85%] h-[85%] rounded-full border border-dashed border-primary/30 flex items-center justify-center"
      >
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-card border border-primary/50 text-primary-glow px-3 py-1 rounded-full text-xs font-mono flex items-center gap-1 shadow-stellar">
          <Cpu className="w-3.5 h-3.5" /> Soroban Smart Contract
        </div>
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-card border border-success/50 text-success px-3 py-1 rounded-full text-xs font-mono flex items-center gap-1 shadow-stellar">
          <CheckCircle2 className="w-3.5 h-3.5" /> Stellar Testnet
        </div>
      </motion.div>

      {/* Middle Glowing Aura Circle */}
      <div className="absolute w-[65%] h-[65%] rounded-full bg-surface/80 border border-border flex items-center justify-center shadow-card-glow backdrop-blur-sm">
        <div className="w-[85%] h-[85%] rounded-full bg-gradient-to-tr from-primary/20 via-surface to-primary/10 border border-primary/30 flex items-center justify-center" />
      </div>

      {/* Central Vault Isometric Graphic */}
      <motion.div 
        animate={{ y: [-8, 8, -8] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 w-44 h-44 rounded-3xl bg-gradient-to-b from-card to-surface border-2 border-primary/40 p-6 flex flex-col items-center justify-center text-center shadow-stellar-glow group cursor-pointer"
      >
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/40 flex items-center justify-center text-primary-glow mb-3 group-hover:scale-110 transition-transform">
          <Shield className="w-9 h-9" />
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-text-primary">
          <Lock className="w-3.5 h-3.5 text-success" />
          <span>RentVault Escrow</span>
        </div>
        <span className="text-[10px] text-text-muted font-mono mt-0.5">0x7B9...A92</span>
      </motion.div>

      {/* Floating Web3 Activity Chips */}
      <motion.div 
        animate={{ y: [-5, 5, -5], x: [3, -3, 3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-6 left-2 z-20 bg-card/90 backdrop-blur-md border border-border px-3.5 py-2 rounded-2xl shadow-lg flex items-center gap-2"
      >
        <div className="w-7 h-7 rounded-xl bg-success/10 border border-success/30 flex items-center justify-center text-success">
          <Coins className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[11px] text-text-muted">Deposit Locked</div>
          <div className="text-xs font-bold text-text-primary">2,500 XLM</div>
        </div>
      </motion.div>

      <motion.div 
        animate={{ y: [6, -6, 6], x: [-4, 4, -4] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute bottom-8 right-2 z-20 bg-card/90 backdrop-blur-md border border-border px-3.5 py-2 rounded-2xl shadow-lg flex items-center gap-2"
      >
        <div className="w-7 h-7 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary-glow">
          <Key className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[11px] text-text-muted">Freighter Wallet</div>
          <div className="text-xs font-bold text-success">Authenticated</div>
        </div>
      </motion.div>
    </div>
  );
};
