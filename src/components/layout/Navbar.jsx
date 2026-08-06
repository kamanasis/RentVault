import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PrimaryButton } from '../buttons/PrimaryButton';
import { StatusBadge } from '../status/StatusBadge';
import { Shield, Wallet, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = location.pathname === '/';

  const navLinks = [
    { name: 'Features', href: isHome ? '#features' : '/#features' },
    { name: 'How It Works', href: isHome ? '#how-it-works' : '/#how-it-works' },
    { name: 'Security', href: isHome ? '#security' : '/#security' },
    { name: 'Stellar Docs', href: 'https://soroban.stellar.org', external: true },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/40 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-primary-glow flex items-center justify-center text-white shadow-stellar group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-text-primary group-hover:text-primary-glow transition-colors">
                RentVault
              </span>
              <span className="text-[10px] uppercase tracking-widest text-text-muted font-medium">
                Stellar Escrow
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-surface/50 px-3 py-1.5 rounded-full border border-border/50 backdrop-blur-sm">
            {navLinks.map((link, idx) => {
              if (link.external) {
                return (
                  <a
                    key={idx}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-full text-caption font-medium text-text-secondary hover:text-text-primary hover:bg-surface/80 transition-all"
                  >
                    {link.name}
                  </a>
                );
              }
              return (
                <a
                  key={idx}
                  href={link.href}
                  className="px-4 py-2 rounded-full text-caption font-medium text-text-secondary hover:text-text-primary hover:bg-surface/80 transition-all"
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Right Header Controls */}
          <div className="hidden md:flex items-center gap-4">
            <StatusBadge variant="primary" size="sm">
              Stellar Testnet
            </StatusBadge>
            
            <PrimaryButton 
              icon={Wallet}
              onClick={() => alert('Phase 2 Placeholder: Freighter Wallet connection will be integrated in Phase 3!')}
            >
              Connect Freighter Wallet
            </PrimaryButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-surface border border-border text-text-secondary hover:text-text-primary"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-card/95 backdrop-blur-xl border-b border-border px-4 py-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <span className="text-caption text-text-secondary">Network</span>
            <StatusBadge variant="primary" size="sm">Stellar Testnet</StatusBadge>
          </div>

          <nav className="flex flex-col gap-2">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                target={link.external ? '_blank' : '_self'}
                rel={link.external ? 'noreferrer' : ''}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-2xl text-body font-medium text-text-secondary hover:bg-surface hover:text-text-primary"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <PrimaryButton 
            icon={Wallet}
            fullWidth
            onClick={() => {
              setMobileMenuOpen(false);
              alert('Phase 2 Placeholder: Freighter Wallet connection will be integrated in Phase 3!');
            }}
          >
            Connect Freighter Wallet
          </PrimaryButton>
        </div>
      )}
    </header>
  );
};
