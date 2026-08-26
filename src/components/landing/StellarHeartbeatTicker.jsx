import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Cpu, Lock, Activity, Coins } from 'lucide-react';

export const StellarHeartbeatTicker = () => {
  const metrics = [
    {
      icon: Zap,
      label: 'Consensus Finality',
      value: '3.8s Instant',
      color: 'text-cyan-400',
      dotColor: 'bg-cyan-400',
    },
    {
      icon: Cpu,
      label: 'Smart Contract Engine',
      value: 'Soroban WASM (Protocol 20)',
      color: 'text-primary-glow',
      dotColor: 'bg-primary-glow',
    },
    {
      icon: Coins,
      label: 'Network Base Fee',
      value: '< 0.00001 XLM',
      color: 'text-success',
      dotColor: 'bg-success',
    },
    {
      icon: Lock,
      label: 'Custody Architecture',
      value: '100% Non-Custodial (SAC)',
      color: 'text-indigo-300',
      dotColor: 'bg-indigo-400',
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto my-6 p-1 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-primary/20 to-purple-500/20 shadow-xl">
      <div className="bg-card/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl px-4 py-3 sm:px-6 sm:py-3 flex flex-wrap items-center justify-between gap-4">
        
        {/* Heartbeat Status Indicator */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-success animate-ping absolute" />
            <span className="w-2.5 h-2.5 rounded-full bg-success relative" />
          </div>
          <span className="text-xs font-mono font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-success" />
            <span>Stellar Testnet Heartbeat</span>
          </span>
        </div>

        {/* Live Metrics Strip */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-xs font-mono">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div key={idx} className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${m.dotColor}`} />
                <span className="text-text-muted text-[11px]">{m.label}:</span>
                <span className={`font-bold ${m.color} flex items-center gap-1`}>
                  <Icon className="w-3.5 h-3.5" />
                  {m.value}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
