import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, Key, Shield, UserCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { PrimaryButton } from '../buttons/PrimaryButton';
import { SecondaryButton } from '../buttons/SecondaryButton';
import { useWallet } from '../../context/WalletContext';

export const SwitchWalletModal = () => {
  const { showSwitchModal, setShowSwitchModal, reconnectWallet, disconnectWallet, loading, address, truncateAddress } = useWallet();

  if (!showSwitchModal) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-card border border-primary/40 rounded-3xl p-6 sm:p-8 shadow-stellar-glow space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/30 text-primary-glow flex items-center justify-center">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-h3 text-text-primary">Switch Freighter Account</h3>
                <p className="text-caption text-text-secondary">Stellar Account Authorization</p>
              </div>
            </div>

            <button
              onClick={() => setShowSwitchModal(false)}
              className="p-2 text-text-muted hover:text-text-primary rounded-xl bg-surface border border-border transition-colors cursor-pointer"
              aria-label="Close switch account modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Active Account Banner */}
          <div className="p-3.5 bg-background/80 rounded-2xl border border-border/80 text-xs font-mono space-y-1">
            <span className="text-text-muted font-sans block">Currently Connected Account:</span>
            <span className="text-primary-glow font-bold truncate block">{address || 'No Account Selected'}</span>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="space-y-3">
            <h4 className="text-caption font-semibold text-text-primary uppercase tracking-wider">
              Step-by-Step Instructions
            </h4>

            <div className="space-y-2.5 text-xs text-text-secondary">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-surface/50 border border-border/40">
                <span className="w-5 h-5 rounded-full bg-primary/20 text-primary-glow font-bold flex items-center justify-center text-[11px] flex-shrink-0">
                  1
                </span>
                <span>Open your <strong>Freighter browser extension</strong> in your browser toolbar.</span>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-surface/50 border border-border/40">
                <span className="w-5 h-5 rounded-full bg-primary/20 text-primary-glow font-bold flex items-center justify-center text-[11px] flex-shrink-0">
                  2
                </span>
                <span>Select your <strong>Tenant account</strong> (or Landlord account) from the account dropdown.</span>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-surface/50 border border-border/40">
                <span className="w-5 h-5 rounded-full bg-primary/20 text-primary-glow font-bold flex items-center justify-center text-[11px] flex-shrink-0">
                  3
                </span>
                <span>Return to RentVault and click <strong>Reconnect Wallet</strong> below.</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <SecondaryButton 
              onClick={() => {
                setShowSwitchModal(false);
                disconnectWallet();
              }}
              className="w-full sm:w-auto text-xs"
            >
              Disconnect Session
            </SecondaryButton>

            <PrimaryButton
              icon={RefreshCw}
              onClick={reconnectWallet}
              disabled={loading}
              className="w-full sm:w-auto text-xs"
            >
              {loading ? 'Reconnecting...' : 'Reconnect Wallet'}
            </PrimaryButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
