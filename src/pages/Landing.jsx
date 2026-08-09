import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Section } from '../components/layout/Section';
import { StatusBadge } from '../components/status/StatusBadge';
import { WalletButton } from '../components/wallet/WalletButton';
import { HeroVisual } from '../components/landing/HeroVisual';
import { TrustMetrics } from '../components/landing/TrustMetrics';
import { ProblemStatement } from '../components/landing/ProblemStatement';
import { HowItWorks } from '../components/landing/HowItWorks';
import { FeatureGrid } from '../components/landing/FeatureGrid';
import { StellarSection } from '../components/landing/StellarSection';

export const Landing = () => {
  return (
    <PageContainer>
      {/* 1. Two-Column Hero Section */}
      <Section className="pt-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Small Stellar Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface/90 border border-primary/30 shadow-sm">
              <StatusBadge variant="primary" size="sm">
                Built on Stellar Testnet
              </StatusBadge>
              <span className="text-caption text-text-secondary font-medium">
                • Powered by Soroban
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-hero text-text-primary tracking-tight font-extrabold leading-[1.1]">
              Rental deposits, <span className="bg-gradient-to-r from-primary via-primary-glow to-white bg-clip-text text-transparent">secured by smart contracts.</span>
            </h1>

            {/* Value Proposition Hero Supporting Text */}
            <p className="text-body text-text-secondary text-lg leading-relaxed max-w-xl">
              RentVault is a <strong className="text-text-primary font-semibold">decentralized escrow</strong> platform built on the <strong className="text-text-primary font-semibold">Stellar Testnet</strong> using <strong className="text-text-primary font-semibold">Soroban smart contracts</strong> to lock security deposits and execute <strong className="text-text-primary font-semibold">automatic deposit release</strong> upon lease completion.
            </p>

            {/* Wallet Primary Action Control */}
            <div className="flex items-center gap-4 pt-2">
              <WalletButton pulse />
            </div>
          </div>

          {/* Right Column Visual Illustration */}
          <div className="lg:col-span-5 flex justify-center">
            <HeroVisual />
          </div>

        </div>
      </Section>

      {/* 2. Trust Metrics Section */}
      <Section className="py-8">
        <TrustMetrics />
      </Section>

      {/* 3. Problem Statement Section */}
      <Section id="security" className="py-16">
        <ProblemStatement />
      </Section>

      {/* 4. How It Works 4-Step Timeline */}
      <Section id="how-it-works" className="py-16">
        <HowItWorks />
      </Section>

      {/* 5. 6-Card Feature Grid */}
      <Section id="features" className="py-16">
        <FeatureGrid />
      </Section>

      {/* 6. Built for Stellar Section */}
      <Section id="stellar" className="py-16">
        <StellarSection />
      </Section>
    </PageContainer>
  );
};
