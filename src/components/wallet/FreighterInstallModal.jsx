import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ExternalLink, X, Zap } from 'lucide-react';
import { PrimaryButton } from '../buttons/PrimaryButton';
import { SecondaryButton } from '../buttons/SecondaryButton';
import { useWallet } from '../../context/WalletContext';

export const FreighterInstallModal = () => {
  const { showInstallModal, setShowInstallModal, connectWallet } = useWallet();

  if (!showInstallModal) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-stellar-glow space-y-6"
        >
          <button
            onClick={() => setShowInstallModal(false)}
            className="absolute top-4 right-4 p-2 text-text-muted hover:text-text-primary rounded-xl bg-surface border border-border"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-warning/10 border border-warning/30 text-warning flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-h3 text-text-primary">Freighter Wallet Required</h3>
            <p className="text-body text-text-secondary leading-relaxed">
              RentVault requires the Freighter browser extension to securely connect to the Stellar Testnet and sign Soroban smart contract transactions.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <a
              href="https://freighter.app"
              target="_blank"
              rel="noreferrer"
              className="block w-full"
            >
              <PrimaryButton fullWidth icon={ExternalLink}>
                Install Freighter Extension
              </PrimaryButton>
            </a>

            {/* Optional Demo Mode Fallback for testing environments without extension */}
            <SecondaryButton
              fullWidth
              icon={Zap}
              onClick={() => connectWallet(true)}
            >
              Use Demo Testnet Wallet
            </SecondaryButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
