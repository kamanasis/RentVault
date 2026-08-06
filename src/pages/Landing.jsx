import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Section } from '../components/layout/Section';
import { PrimaryButton } from '../components/buttons/PrimaryButton';
import { SecondaryButton } from '../components/buttons/SecondaryButton';
import { StatusBadge } from '../components/status/StatusBadge';
import { HeroVisual } from '../components/landing/HeroVisual';
import { TrustMetrics } from '../components/landing/TrustMetrics';
import { ProblemStatement } from '../components/landing/ProblemStatement';
import { HowItWorks } from '../components/landing/HowItWorks';
import { FeatureGrid } from '../components/landing/FeatureGrid';
import { StellarSection } from '../components/landing/StellarSection';
import { Wallet, Play, Shield, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      {/* 1. Two-Column Hero Section */}
      <Section className="pt-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Small Stellar Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface/80 border border-primary/30 shadow-sm">
              <StatusBadge variant="primary" size="sm">
                Built on Stellar Testnet
              </StatusBadge>
              <span className="text-caption text-text-secondary">
                • Powered by Soroban
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-hero text-text-primary tracking-tight font-extrabold leading-[1.1]">
              Rental deposits, <span className="bg-gradient-to-r from-primary via-primary-glow to-white bg-clip-text text-transparent">secured by smart contracts.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-body text-text-secondary text-lg leading-relaxed max-w-xl">
              RentVault locks rental security deposits in Soroban-powered escrow contracts on the Stellar blockchain, automatically enforcing lease terms, transparent utility bill deductions, and instant refunds.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <PrimaryButton 
                icon={Wallet} 
                onClick={() => alert('Phase 2 Placeholder: Freighter Wallet connection will be integrated in Phase 3!')}
              >
                Connect Freighter Wallet
              </PrimaryButton>

              <SecondaryButton 
                icon={Play}
                onClick={() => navigate('/dashboard')}
              >
                Watch 3-min Demo
              </SecondaryButton>
            </div>
          </div>

          {/* Right Column Isometric Visual Illustration */}
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
