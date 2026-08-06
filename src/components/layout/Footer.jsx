import React from 'react';
import { Shield, Github, ExternalLink, Mail, FileText } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-border/60 bg-background/50 backdrop-blur-sm py-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-stellar">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-text-primary">RentVault</span>
            </div>
            <p className="text-body text-text-secondary max-w-sm leading-relaxed">
              Decentralized rental security deposit escrow platform built on Stellar Testnet and Soroban smart contracts.
            </p>
            <div className="flex items-center gap-2 text-xs text-success bg-success/10 border border-success/20 px-3 py-1.5 rounded-full w-fit">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Built on Stellar Testnet
            </div>
          </div>

          <div>
            <h4 className="text-caption font-semibold text-text-primary uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-caption text-text-secondary">
              <li><a href="#features" className="hover:text-primary-glow transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-primary-glow transition-colors">How It Works</a></li>
              <li><a href="#security" className="hover:text-primary-glow transition-colors">Security</a></li>
              <li><a href="/dashboard" className="hover:text-primary-glow transition-colors">Demo Dashboard</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-caption font-semibold text-text-primary uppercase tracking-wider mb-4">
              Resources & Links
            </h4>
            <ul className="space-y-2.5 text-caption text-text-secondary">
              <li>
                <a 
                  href="https://github.com/kamanasis/RentVault" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-primary-glow flex items-center gap-1.5"
                >
                  <Github className="w-4 h-4" /> GitHub Repository
                </a>
              </li>
              <li>
                <a 
                  href="https://soroban.stellar.org" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-primary-glow flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" /> Documentation
                </a>
              </li>
              <li>
                <a 
                  href="mailto:contact@rentvault.io" 
                  className="hover:text-primary-glow flex items-center gap-1.5"
                >
                  <Mail className="w-4 h-4" /> Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <div>
            © {new Date().getFullYear()} RentVault. Powered by Soroban Smart Contracts on Stellar.
          </div>
          <div className="flex items-center gap-6">
            <a 
              href="https://stellar.org" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1 text-text-secondary hover:text-primary-glow"
            >
              Stellar Ecosystem <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
