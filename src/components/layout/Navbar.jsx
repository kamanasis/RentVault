import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WalletButton } from '../wallet/WalletButton';
import { NetworkBadge } from '../wallet/NetworkBadge';
import { useWallet } from '../../context/WalletContext';
import { Shield, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();
  const { connected, network } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = location.pathname === '/';

  const navLinks = [
    { name: 'Features', href: isHome ? '#features' : '/#features' },
    { name: 'How It Works', href: isHome ? '#how-it-works' : '/#how-it-works' },
    { name: 'Security', href: isHome ? '#security' : '/#security' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Stellar Docs', href: 'https://soroban.stellar.org', external: true },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-glow rounded-xl p-1">
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
          <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1 bg-surface/60 px-3 py-1.5 rounded-full border border-border/60 backdrop-blur-sm">
            {navLinks.map((link, idx) => {
              if (link.external) {
                return (
                  <a
                    key={idx}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-full text-caption font-medium text-text-secondary hover:text-text-primary hover:bg-surface transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-glow"
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
                      location.pathname === link.href ? 'bg-primary text-white font-semibold' : 'text-text-secondary hover:text-text-primary hover:bg-surface'
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
                  className="px-4 py-2 rounded-full text-caption font-medium text-text-secondary hover:text-text-primary hover:bg-surface transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-glow"
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Right Header Controls */}
          <div className="hidden md:flex items-center gap-4">
            <NetworkBadge network={network || 'TESTNET'} />
            <WalletButton pulse={!connected} />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-surface border border-border text-text-secondary hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-glow"
            aria-label="Toggle navigation menu"
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
            <NetworkBadge network={network || 'TESTNET'} />
          </div>

          <nav aria-label="Mobile Navigation" className="flex flex-col gap-2">
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

          <WalletButton pulse={!connected} fullWidth />
        </div>
      )}
    </header>
  );
};
