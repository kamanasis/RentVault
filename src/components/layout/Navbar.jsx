import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WalletButton } from '../wallet/WalletButton';
import { NetworkBadge } from '../wallet/NetworkBadge';
import { useWallet } from '../../context/WalletContext';
import { Shield, Menu, X, MessageSquare, Users } from 'lucide-react';
import { FeedbackSummaryModal } from '../feedback/FeedbackSummaryModal';
import { UserFeedbackModal } from '../feedback/UserFeedbackModal';
import { UserOnboardingRegistry } from '../onboarding/UserOnboardingRegistry';

export const Navbar = () => {
  const location = useLocation();
  const { connected, network } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Phase 1: User Feedback Engine Modals State
  const [feedbackSummaryOpen, setFeedbackSummaryOpen] = useState(false);
  const [submitFeedbackOpen, setSubmitFeedbackOpen] = useState(false);

  // Phase 2: Onboarded Users & Interaction Ledger Modal State
  const [registryOpen, setRegistryOpen] = useState(false);

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: isHome ? '#features' : '/#features' },
    { name: 'How It Works', href: isHome ? '#how-it-works' : '/#how-it-works' },
    { name: 'Security', href: isHome ? '#security' : '/#security' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Stellar Docs', href: 'https://soroban.stellar.org', external: true },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'backdrop-blur-2xl bg-background/60 border-b border-white/[0.08] shadow-2xl shadow-black/30' 
        : 'backdrop-blur-lg bg-gradient-to-b from-background/60 via-background/20 to-transparent border-b border-white/[0.04]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-glow rounded-2xl p-1.5 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary via-primary-glow to-cyan-400 flex items-center justify-center text-white shadow-stellar group-hover:scale-105 group-hover:shadow-stellar-glow transition-all">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-text-primary group-hover:text-primary-glow transition-colors">
                RentVault
              </span>
              <span className="text-[9px] uppercase tracking-widest text-cyan-400/80 font-mono font-semibold">
                Stellar Escrow
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links Floating Capsule */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1 bg-surface/30 hover:bg-surface/45 px-3.5 py-1.5 rounded-full border border-white/[0.08] shadow-lg shadow-black/20 backdrop-blur-xl transition-all">
            {navLinks.map((link, idx) => {
              if (link.external) {
                return (
                  <a
                    key={idx}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-full text-caption font-medium text-text-secondary hover:text-text-primary hover:bg-white/[0.06] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-glow"
                  >
                    {link.name}
                  </a>
                );
              }
              if (link.href.startsWith('/')) {
                return (
                  <Link
                    key={idx}
                    to={link.href}
                    className={`px-4 py-2 rounded-full text-caption font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-glow ${
                      location.pathname === link.href 
                        ? 'bg-gradient-to-r from-primary to-primary-glow text-white font-bold shadow-stellar' 
                        : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.06]'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              }
              return (
                <a
                  key={idx}
                  href={link.href}
                  className="px-4 py-2 rounded-full text-caption font-medium text-text-secondary hover:text-text-primary hover:bg-white/[0.06] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-glow"
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Right Header Controls */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Phase 2: 10+ Onboarded Users Ledger Quick Trigger */}
            <button
              onClick={() => setRegistryOpen(true)}
              title="10+ Onboarded Users & Verified Ledger"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono text-cyan-400 bg-surface/30 hover:bg-surface/60 border border-cyan-400/30 backdrop-blur-xl transition-all cursor-pointer shadow-sm"
            >
              <Users className="w-3.5 h-3.5" />
              <span>10+ Users</span>
            </button>

            {/* Phase 1: User Feedback Quick Trigger */}
            <button
              onClick={() => setFeedbackSummaryOpen(true)}
              title="User Feedback & Ratings"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono text-amber-400 bg-surface/30 hover:bg-surface/60 border border-amber-400/30 backdrop-blur-xl transition-all cursor-pointer shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Feedback</span>
            </button>

            <NetworkBadge network={network || 'TESTNET'} />
            <WalletButton pulse={!connected} />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-2xl bg-surface/40 border border-white/[0.08] text-text-secondary hover:text-text-primary backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-glow"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-card/90 backdrop-blur-2xl border-b border-white/[0.08] px-4 py-6 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <span className="text-caption text-text-secondary">Network</span>
            <NetworkBadge network={network || 'TESTNET'} />
          </div>

          {/* Quick Triggers in Mobile Menu */}
          <div className="grid grid-cols-2 gap-2 py-1 border-b border-border/40">
            <button
              onClick={() => { setMobileMenuOpen(false); setRegistryOpen(true); }}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-surface/40 border border-border/50 text-xs font-mono text-cyan-400"
            >
              <Users className="w-4 h-4" />
              <span>10+ Users</span>
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); setFeedbackSummaryOpen(true); }}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-surface/40 border border-border/50 text-xs font-mono text-amber-400"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Feedback</span>
            </button>
          </div>

          <nav aria-label="Mobile Navigation" className="flex flex-col gap-2">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                target={link.external ? '_blank' : '_self'}
                rel={link.external ? 'noreferrer' : ''}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-2xl text-body font-medium text-text-secondary hover:bg-white/[0.08] hover:text-text-primary transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="pt-2 flex justify-center">
            <WalletButton pulse={!connected} />
          </div>
        </div>
      )}

      {/* Phase 1: Feedback Modals */}
      <FeedbackSummaryModal 
        isOpen={feedbackSummaryOpen} 
        onClose={() => setFeedbackSummaryOpen(false)} 
        onOpenSubmitModal={() => setSubmitFeedbackOpen(true)}
      />
      <UserFeedbackModal 
        isOpen={submitFeedbackOpen} 
        onClose={() => setSubmitFeedbackOpen(false)} 
        onSuccess={() => setFeedbackSummaryOpen(true)}
      />

      {/* Phase 2: Onboarded Users Ledger Modal */}
      <UserOnboardingRegistry 
        isOpen={registryOpen} 
        onClose={() => setRegistryOpen(false)} 
      />
    </header>
  );
};
