import React from 'react';
import { FeatureCard } from '../cards/FeatureCard';
import { 
  ShieldCheck, 
  Timer, 
  Receipt, 
  GitCommit, 
  Layers, 
  Search 
} from 'lucide-react';

export const FeatureGrid = () => {
  const features = [
    {
      title: 'Smart Escrow',
      desc: 'Immutable Soroban smart contracts manage deposit custody without centralized intermediaries.',
      icon: ShieldCheck,
      badge: 'Soroban WASM',
    },
    {
      title: 'Auto-Release Timer',
      desc: 'Automatic refund countdown protects tenants against inactive landlords post-lease completion.',
      icon: Timer,
      badge: 'Time-Lock',
    },
    {
      title: 'Utility Settlement',
      desc: 'Deduct final electricity, water, or repair charges directly from the reserved escrow balance.',
      icon: Receipt,
      badge: 'Reserve Allocator',
    },
    {
      title: 'On-Chain Timeline',
      desc: 'Interactive step-by-step visual tracker recording every milestone on the Stellar ledger.',
      icon: GitCommit,
      badge: 'Visual Ledger',
    },
    {
      title: 'Multi-Wallet Support',
      desc: 'Seamless integration with Freighter Wallet and native Stellar secret keys on Testnet.',
      icon: Layers,
      badge: 'Freighter API',
    },
    {
      title: 'Transparent Transactions',
      desc: 'Every agreement, deposit, deduction, and refund is auditably logged via Horizon API.',
      icon: Search,
      badge: 'Horizon Verified',
    },
  ];

  return (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-primary-glow font-semibold mb-2 block">
          Platform Architecture
        </span>
        <h2 className="text-h1 text-text-primary mb-4">
          Core Escrow Capabilities
        </h2>
        <p className="text-body text-text-secondary">
          Everything required for trustless rental deposit management built on Stellar Testnet.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((f, idx) => (
          <FeatureCard 
            key={idx}
            icon={f.icon}
            title={f.title}
            description={f.desc}
            badge={f.badge}
          />
        ))}
      </div>
    </div>
  );
};
