import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Lock, 
  RefreshCw, 
  ShieldCheck, 
  Coins, 
  ArrowRight, 
  CheckCircle2, 
  Cpu, 
  Receipt, 
  Zap,
  Key
} from 'lucide-react';
import { PrimaryButton } from '../buttons/PrimaryButton';
import { useNavigate } from 'react-router-dom';

export const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  const steps = [
    {
      id: '01',
      tag: 'Step 1 • Digital Agreement',
      title: 'Define Lease Terms & Parties',
      subtitle: 'Landlord configures rent terms, security deposit, utility reserve, and tenant wallet address on Stellar Testnet.',
      cta: 'Explore Agreements',
      action: () => navigate('/dashboard'),
      mockupType: 'agreement',
    },
    {
      id: '02',
      tag: 'Step 2 • Soroban Escrow Lock',
      title: 'Lock Security Deposit in Vault',
      subtitle: 'Tenant signs the transaction using Freighter. Funds are transferred into the Soroban smart contract via Stellar Asset Contract (SAC).',
      cta: 'Test Escrow Deposit',
      action: () => navigate('/agreements/RV-2026-001/deposit'),
      mockupType: 'escrow',
    },
    {
      id: '03',
      tag: 'Step 3 • Transparent Settlement',
      title: 'Itemized Deductions & Instant Refund',
      subtitle: 'At lease maturity, utility deductions are itemized and verified. Remaining funds are instantly refunded to the tenant within 3.8 seconds.',
      cta: 'View Settlement Portal',
      action: () => navigate('/agreements/RV-2026-001/settlement'),
      mockupType: 'settlement',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-primary-glow font-semibold mb-2 block">
          Interactive Product Walkthrough
        </span>
        <h2 className="text-h1 text-text-primary mb-4 font-extrabold tracking-tight">
          How RentVault works
        </h2>
        <p className="text-body text-text-secondary">
          Step through the trustless rental lifecycle from initial agreement setup to automated on-chain refund release.
        </p>
      </div>

      {/* Main Interactive Centerpiece Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gradient-to-b from-card via-card/80 to-surface border border-border/80 rounded-3xl p-6 sm:p-10 shadow-2xl">
        
        {/* Left Column: Step Navigation Tabs */}
        <div className="lg:col-span-5 space-y-4">
          {steps.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <div
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-surface/95 border-primary shadow-stellar-glow'
                    : 'bg-surface/30 border-border/60 hover:bg-surface/60 hover:border-border'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-mono font-bold uppercase tracking-wider ${
                    isActive ? 'text-primary-glow' : 'text-text-muted'
                  }`}>
                    {step.tag}
                  </span>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-primary/20 text-primary-glow border border-primary/30' : 'bg-surface text-text-muted'
                  }`}>
                    {step.id}
                  </span>
                </div>

                <h3 className={`text-lg font-bold transition-colors ${
                  isActive ? 'text-text-primary' : 'text-text-secondary'
                }`}>
                  {step.title}
                </h3>

                <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                  {step.subtitle}
                </p>

                {isActive && (
                  <div className="pt-4 mt-3 border-t border-border/50 flex items-center gap-2 text-xs font-semibold text-primary-glow">
                    <span>{step.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Dynamic Live Device UI Mockup */}
        <div className="lg:col-span-7 flex justify-center p-2 sm:p-4">
          <div className="w-full max-w-md min-h-[380px] rounded-3xl bg-background/90 border border-primary/30 p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden backdrop-blur-xl">
            {/* Top Device Status Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-border/60 text-xs font-mono text-text-muted">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-text-primary font-bold">Stellar Testnet (Protocol 20)</span>
              </div>
              <span className="text-[11px] text-primary-glow">Soroban WASM</span>
            </div>

            {/* Dynamic Step Content Mockup with Animated Transitions */}
            <div className="py-6 flex-1 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {activeStep === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35 }}
                    className="w-full space-y-4"
                  >
                    <div className="p-4 rounded-2xl bg-surface/80 border border-border/80 space-y-3 font-mono text-xs">
                      <div className="flex justify-between items-center pb-2 border-b border-border/50 font-sans">
                        <span className="text-text-secondary font-medium">Agreement ID</span>
                        <span className="text-text-primary font-bold">RV-2026-001</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Landlord Key:</span>
                        <span className="text-primary-glow font-bold">GB7X...7Y6U</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Tenant Key:</span>
                        <span className="text-primary-glow font-bold">GDKX...4K2P</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Required Deposit:</span>
                        <span className="text-text-primary font-bold">1,200.00 XLM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Utility Reserve:</span>
                        <span className="text-text-primary font-bold">300.00 XLM</span>
                      </div>
                    </div>

                    <div className="p-3 bg-primary/10 rounded-xl border border-primary/25 flex items-center justify-between text-xs">
                      <span className="text-text-secondary flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-primary-glow" /> Dual Signature Required
                      </span>
                      <span className="text-success font-bold font-mono">Ready for Lock</span>
                    </div>
                  </motion.div>
                )}

                {activeStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35 }}
                    className="w-full space-y-4"
                  >
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/15 via-surface to-card border border-primary/40 text-center space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-surface border border-primary/40 flex items-center justify-center text-primary-glow mx-auto shadow-sm">
                        <Lock className="w-6 h-6 text-success" />
                      </div>
                      <div className="text-xs font-mono uppercase tracking-wider text-text-muted">
                        Locked in Soroban Contract Vault
                      </div>
                      <div className="text-2xl font-mono font-extrabold text-primary-glow">
                        1,500.00 XLM
                      </div>
                      <div className="text-[11px] text-text-secondary font-mono truncate">
                        Contract: CB2YAY734VGBLC4B3KGCDF...
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                      <div className="p-2.5 rounded-xl bg-surface/70 border border-border/80">
                        <span className="text-text-muted text-[10px] block">SAC Transfer</span>
                        <span className="text-success font-bold">Verified On-Chain</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-surface/70 border border-border/80">
                        <span className="text-text-muted text-[10px] block">Event Published</span>
                        <span className="text-primary-glow font-bold">("escrow","locked")</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35 }}
                    className="w-full space-y-4"
                  >
                    <div className="p-4 rounded-2xl bg-surface/80 border border-border/80 space-y-2.5 text-xs">
                      <div className="flex justify-between items-center pb-2 border-b border-border/50 font-bold text-text-primary">
                        <span>Itemized Deductions</span>
                        <span className="font-mono text-error">-165.00 XLM</span>
                      </div>
                      <div className="flex justify-between text-text-muted font-mono">
                        <span>⚡ Electricity / Power:</span>
                        <span className="text-error">-120.00 XLM</span>
                      </div>
                      <div className="flex justify-between text-text-muted font-mono">
                        <span>💧 Water Utilities:</span>
                        <span className="text-error">-45.00 XLM</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-border/50 font-bold">
                        <span className="text-text-primary">Net Refund to Tenant:</span>
                        <span className="font-mono text-success text-sm">+1,335.00 XLM</span>
                      </div>
                    </div>

                    <div className="p-3 bg-success/10 rounded-xl border border-success/30 flex items-center justify-between text-xs">
                      <span className="text-text-secondary flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-success" /> 3.8s Release Finality
                      </span>
                      <span className="text-success font-bold font-mono">Auto-Refund Ready</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Card Action */}
            <div className="pt-4 border-t border-border/60 flex items-center justify-between">
              <span className="text-xs text-text-muted">
                Interactive Simulation {activeStep + 1} of 3
              </span>
              <button
                type="button"
                onClick={steps[activeStep].action}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-glow transition-colors cursor-pointer shadow-sm"
              >
                <span>{steps[activeStep].cta}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
