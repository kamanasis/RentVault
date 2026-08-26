import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Receipt, Sparkles, ArrowRight } from 'lucide-react';
import { CardSpotlight } from '../ui/CardSpotlight';

export const BenefitStrip = () => {
  const benefits = [
    {
      number: '01',
      badge: 'Escrow Security',
      headline: 'Lock in Seconds',
      description: 'Tenants deposit funds directly into a neutral Soroban smart contract on Stellar. Zero personal account custody, zero commingling.',
      icon: ShieldCheck,
      spotlightColor: 'rgba(56, 189, 248, 0.18)',
      iconColor: 'text-cyan-400',
    },
    {
      number: '02',
      badge: 'Auditable Deductions',
      headline: 'Settle Transparently',
      description: 'Landlords submit itemized utility bills with digital documentation. Every line item is immutably validated before refund calculation.',
      icon: Receipt,
      spotlightColor: 'rgba(168, 85, 247, 0.18)',
      iconColor: 'text-purple-400',
    },
    {
      number: '03',
      badge: 'Zero Waiting',
      headline: 'Instant Refund Release',
      description: 'Once agreed or auto-approved, the contract triggers automated XLM settlement in 3–5 seconds directly to the tenant’s non-custodial wallet.',
      icon: Sparkles,
      spotlightColor: 'rgba(16, 185, 129, 0.18)',
      iconColor: 'text-success',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs uppercase tracking-widest text-primary-glow font-semibold mb-2 block">
          The RentVault Standard
        </span>
        <h2 className="text-h1 text-text-primary mb-3 font-extrabold tracking-tight">
          How modern rental deposits should work
        </h2>
        <p className="text-body text-text-secondary">
          Engineered to replace informal trust with mathematical, on-chain guarantees from move-in to final move-out.
        </p>
      </div>

      {/* 3 Stacking Benefit Blocks with Radial Magnetic Spotlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {benefits.map((b, idx) => {
          const Icon = b.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <CardSpotlight
                spotlightColor={b.spotlightColor}
                className="p-7 h-full flex flex-col justify-between group shadow-xl hover:border-primary/40"
              >
                <div>
                  {/* Top Row: Icon + Step Number */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-surface/90 border border-border/80 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                      <Icon className={`w-6 h-6 ${b.iconColor}`} />
                    </div>
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-surface/80 border border-border/60 text-text-muted">
                      {b.number}
                    </span>
                  </div>

                  {/* Badge */}
                  <span className="text-[11px] font-semibold text-primary-glow uppercase tracking-wider block mb-2">
                    {b.badge}
                  </span>

                  {/* Headline */}
                  <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-primary-glow transition-colors">
                    {b.headline}
                  </h3>

                  {/* Description */}
                  <p className="text-caption text-text-secondary leading-relaxed">
                    {b.description}
                  </p>
                </div>

                {/* Bottom Subtle Indicator */}
                <div className="pt-6 mt-6 border-t border-border/50 flex items-center justify-between text-xs text-text-muted group-hover:text-text-primary transition-colors">
                  <span>Stellar Smart Contract</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-primary-glow" />
                </div>
              </CardSpotlight>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
