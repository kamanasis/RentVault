import React from 'react';
import { motion } from 'framer-motion';
import { ShieldX, Clock, AlertOctagon, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProblemStatement = () => {
  const risks = [
    {
      label: 'Zero Transparency',
      stat: '100%',
      headline: 'Personal Account Custody',
      detail: 'Traditional landlords hold security deposits in personal bank accounts with zero independent auditing, commingling tenant funds at will.',
      icon: ShieldX,
      color: 'text-error',
      bgColor: 'bg-error/10',
      borderColor: 'border-error/30',
    },
    {
      label: 'Endless Delays',
      stat: '30-90 Days',
      headline: 'Delayed Refund Cycles',
      detail: 'Tenants routinely wait weeks or months after moving out to recover their own money, creating intense moving friction and cash-flow stress.',
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/30',
    },
    {
      label: 'Arbitrary Deductions',
      stat: '42% Disputed',
      headline: 'Unverified Repair Bills',
      detail: 'Utility bills and wear-and-tear repairs are deducted arbitrarily without verifiable itemized proof or neutral dispute resolution mechanisms.',
      icon: AlertOctagon,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/30',
    },
  ];

  return (
    <div className="relative rounded-3xl bg-gradient-to-b from-card/95 via-background to-card/90 border border-border/80 p-8 sm:p-14 shadow-2xl overflow-hidden">
      {/* Ambient Darkened Radial Backdrop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-error/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Urgent Tone */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-widest text-error font-semibold mb-2 block flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping" /> The Real-World Problem
        </span>
        <h2 className="text-h1 text-text-primary mb-4 font-extrabold tracking-tight">
          Why traditional rental deposits fail
        </h2>
        <p className="text-body text-text-secondary leading-relaxed">
          Centralized custody forces tenants to surrender financial control with zero guarantees, turning move-outs into hostile negotiations.
        </p>
      </div>

      {/* 3 Urgent Risk Statements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {risks.map((r, idx) => {
          const Icon = r.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="p-7 rounded-2xl bg-surface/50 border border-border hover:border-error/40 transition-all duration-300 flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-11 h-11 rounded-xl ${r.bgColor} border ${r.borderColor} flex items-center justify-center ${r.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-error px-2.5 py-1 rounded-full bg-error/10 border border-error/20">
                    {r.stat}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-error transition-colors">
                  {r.headline}
                </h3>

                <p className="text-caption text-text-secondary leading-relaxed">
                  {r.detail}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Contrast Pivot Banner (RentVault Solution) */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/15 via-primary-glow/10 to-primary/5 border border-primary/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-primary-glow uppercase tracking-wider block">
            The Decentralized Remedy
          </span>
          <div className="text-sm font-bold text-text-primary">
            RentVault eliminates human custody with Stellar Consensus Protocol (SCP) & Soroban smart contracts.
          </div>
        </div>

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-glow transition-all shadow-stellar flex-shrink-0"
        >
          <span>Explore Verified Escrows</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
