import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';
import { PrimaryButton } from '../buttons/PrimaryButton';
import { SecondaryButton } from '../buttons/SecondaryButton';
import { useWallet } from '../../context/WalletContext';

export const WrongNetworkModal = () => {
  const { showNetworkModal, setShowNetworkModal, connectWallet } = useWallet();

  if (!showNetworkModal) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-card border border-warning/40 rounded-3xl p-6 sm:p-8 shadow-stellar-glow space-y-6"
        >
          <button
            onClick={() => setShowNetworkModal(false)}
            className="absolute top-4 right-4 p-2 text-text-muted hover:text-text-primary rounded-xl bg-surface border border-border"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-warning/10 border border-warning/30 text-warning flex items-center justify-center">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-h3 text-text-primary">Wrong Network Detected</h3>
            <p className="text-body text-text-secondary leading-relaxed">
              Please switch your Freighter extension network settings to <strong className="text-warning">Stellar Testnet</strong> to interact with RentVault escrow smart contracts.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <PrimaryButton fullWidth icon={RefreshCw} onClick={() => connectWallet()}>
              Retry Connection
            </PrimaryButton>

            <SecondaryButton fullWidth onClick={() => setShowNetworkModal(false)}>
              Dismiss Warning
            </SecondaryButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
