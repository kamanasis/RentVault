import React from 'react';
import { Shield, Github, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-border/60 bg-background/50 backdrop-blur-sm py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-text-primary">RentVault</span>
            </div>
            <p className="text-body text-text-secondary max-w-sm">
              Decentralized security deposit escrow platform built on Stellar Testnet and Soroban smart contracts.
            </p>
          </div>

          <div>
            <h4 className="text-caption font-semibold text-text-primary uppercase tracking-wider mb-4">
              Platform Navigation
            </h4>
            <ul className="space-y-2 text-caption text-text-secondary">
              <li><a href="/" className="hover:text-primary-glow transition-colors">Home Landing</a></li>
              <li><a href="/dashboard" className="hover:text-primary-glow transition-colors">Dashboard</a></li>
              <li><a href="/agreement/create" className="hover:text-primary-glow transition-colors">Create Agreement</a></li>
              <li><a href="/transactions" className="hover:text-primary-glow transition-colors">Transaction Ledger</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-caption font-semibold text-text-primary uppercase tracking-wider mb-4">
              Stellar Ecosystem
            </h4>
            <ul className="space-y-2 text-caption text-text-secondary">
              <li className="flex items-center gap-1">
                <a href="https://stellar.org" target="_blank" rel="noreferrer" className="hover:text-primary-glow flex items-center gap-1">
                  Stellar Network <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li className="flex items-center gap-1">
                <a href="https://soroban.stellar.org" target="_blank" rel="noreferrer" className="hover:text-primary-glow flex items-center gap-1">
                  Soroban Smart Contracts <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li className="flex items-center gap-1">
                <a href="https://freighter.app" target="_blank" rel="noreferrer" className="hover:text-primary-glow flex items-center gap-1">
                  Freighter Wallet <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <div>
            © {new Date().getFullYear()} RentVault. Built for Stellar Smart Contract Hackathon.
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success animate-ping" />
              Stellar Testnet Operational
            </span>
            <a 
              href="https://github.com/kamanasis/RentVault" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1 text-text-secondary hover:text-text-primary"
            >
              <Github className="w-4 h-4" /> GitHub Repository
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
