import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Section } from '../components/layout/Section';
import { StatusBadge } from '../components/status/StatusBadge';
import { WalletButton } from '../components/wallet/WalletButton';
import { HeroVisual } from '../components/landing/HeroVisual';
import { StellarHeartbeatTicker } from '../components/landing/StellarHeartbeatTicker';
import { BenefitStrip } from '../components/landing/BenefitStrip';
import { ProblemStatement } from '../components/landing/ProblemStatement';
import { HowItWorks } from '../components/landing/HowItWorks';
import { FeatureGrid } from '../components/landing/FeatureGrid';
import { AmbientEcosystem } from '../components/landing/AmbientEcosystem';
import { StellarSection } from '../components/landing/StellarSection';
import { TrustMetrics } from '../components/landing/TrustMetrics';
import { ArrowRight, ShieldCheck, Zap, Lock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Landing = () => {
  return (
    <PageContainer>
      {/* 1. Hero Section with Live Telemetry Chips */}
      <Section className="pt-2 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Small Stellar Protocol Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface/80 border border-primary/30 shadow-sm backdrop-blur-md">
              <StatusBadge variant="primary" size="sm">
                Stellar Protocol 20
              </StatusBadge>
              <span className="text-caption text-text-secondary font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Live on Testnet
              </span>
            </div>

            {/* Shimmering Hero Headline */}
            <h1 className="text-hero text-text-primary tracking-tight font-extrabold leading-[1.1]">
              Rental deposits,{' '}
              <span className="bg-gradient-to-r from-primary via-cyan-400 to-primary-glow bg-clip-text text-transparent animate-pulse">
                secured by smart contracts.
              </span>
            </h1>

            {/* Value Proposition Supporting Text */}
            <p className="text-body text-text-secondary text-lg leading-relaxed max-w-xl">
              RentVault is a <strong className="text-text-primary font-semibold">decentralized escrow</strong> platform powered by <strong className="text-text-primary font-semibold">Soroban WASM contracts</strong> on <strong className="text-text-primary font-semibold">Stellar</strong> to lock security deposits trustlessly and execute <strong className="text-text-primary font-semibold">instant settlement refunds</strong>.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <WalletButton pulse />
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 px-5 py-3 rounded-2xl bg-surface/90 border border-border/80 text-text-primary font-semibold text-caption hover:bg-surface hover:border-primary/40 transition-all shadow-sm"
              >
                <span>View Escrows</span>
                <ArrowRight className="w-4 h-4 text-primary-glow" />
              </Link>
            </div>

            {/* Trust Mini-Strip */}
            <div className="pt-4 flex items-center gap-6 text-xs text-text-muted">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-success" /> Non-Custodial
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-cyan-400" /> 3.8s Finality
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-primary-glow" /> Soroban SAC Vault
              </span>
            </div>
          </div>

          {/* Right Column: Officer Eva Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <HeroVisual />
          </div>

        </div>

        {/* 2. Live Stellar Protocol Heartbeat Telemetry Ticker */}
        <StellarHeartbeatTicker />
      </Section>

      {/* 3. Benefit Strip with Radial Magnetic Spotlight */}
      <Section className="py-10">
        <BenefitStrip />
      </Section>

      {/* 4. The Risks / Problem Statement (Dark Tonal Shift) */}
      <Section id="security" className="py-10">
        <ProblemStatement />
      </Section>

      {/* 5. Interactive "How It Works" Centerpiece with Live Mockups */}
      <Section id="how-it-works" className="py-10">
        <HowItWorks />
      </Section>

      {/* 6. Ambient Ecosystem Breathing Section (Daylight Restraint) */}
      <Section className="py-8">
        <AmbientEcosystem />
      </Section>

      {/* 7. Feature Grid */}
      <Section id="features" className="py-10">
        <FeatureGrid />
      </Section>

      {/* 8. Built for Stellar Foundation */}
      <Section id="stellar" className="py-10">
        <StellarSection />
      </Section>
    </PageContainer>
  );
};
