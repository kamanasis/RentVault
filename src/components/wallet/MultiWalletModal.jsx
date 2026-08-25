import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Wallet, 
  CheckCircle2, 
  ExternalLink, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Smartphone,
  Globe,
  Download
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { WALLET_OPTIONS } from '../../utils/walletProviders';

export const MultiWalletModal = () => {
  const { 
    showWalletModal, 
    setShowWalletModal, 
    connectWithWallet, 
    loading, 
    errorState, 
    clearError,
    fundTestnetAccount
  } = useWallet();

  const [selectedWalletId, setSelectedWalletId] = useState('freighter');

  if (!showWalletModal) return null;

  const handleSelectWallet = async (wallet) => {
    setSelectedWalletId(wallet.id);
    clearError();
    await connectWithWallet(wallet.id);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-card border border-primary/40 rounded-3xl p-6 sm:p-8 shadow-stellar-glow space-y-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/30 text-primary-glow flex items-center justify-center">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-h3 text-text-primary">Connect Stellar Wallet</h3>
                  <span className="text-[10px] font-mono font-bold bg-primary/20 text-primary-glow px-2 py-0.5 rounded-full uppercase">
                    StellarWalletsKit
                  </span>
                </div>
                <p className="text-caption text-text-secondary">
                  Select your preferred wallet to authenticate on Stellar Testnet
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setShowWalletModal(false);
                clearError();
              }}
              className="p-2 text-text-muted hover:text-text-primary rounded-xl bg-surface border border-border transition-colors cursor-pointer"
              aria-label="Close wallet selection modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Error Notice if Present */}
          {errorState && (
            <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
              errorState.code === 'WALLET_NOT_FOUND' 
                ? 'bg-warning/10 border-warning/30 text-warning'
                : errorState.code === 'INSUFFICIENT_BALANCE'
                ? 'bg-error/10 border-error/30 text-error'
                : 'bg-error/10 border-error/30 text-error'
            }`}>
              <div className="flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>[{errorState.code}] {errorState.title}</span>
              </div>
              <p className="text-text-secondary">{errorState.message}</p>
              
              {/* Action Buttons for Errors */}
              <div className="pt-1 flex items-center gap-2">
                {errorState.code === 'WALLET_NOT_FOUND' && errorState.downloadUrl && (
                  <a
                    href={errorState.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white font-semibold text-xs hover:bg-primary-hover transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download {errorState.walletName || 'Wallet'}</span>
                  </a>
                )}
                {errorState.code === 'INSUFFICIENT_BALANCE' && (
                  <button
                    onClick={fundTestnetAccount}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-success text-white font-semibold text-xs hover:bg-success/90 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Fund with Friendbot (+10,000 XLM)</span>
                  </button>
                )}
                <button
                  onClick={() => connectWithWallet('demo')}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface border border-border text-text-primary text-xs hover:bg-surface/80 transition-colors cursor-pointer"
                >
                  <span>Use Demo Wallet</span>
                  <ArrowRight className="w-3 h-3 text-primary-glow" />
                </button>
              </div>
            </div>
          )}

          {/* Wallet List Grid */}
          <div className="space-y-3">
            <h4 className="text-caption font-semibold text-text-secondary uppercase tracking-wider">
              Available Stellar Wallets
            </h4>

            <div className="grid grid-cols-1 gap-2.5">
              {WALLET_OPTIONS.map((wallet) => {
                const isSelected = selectedWalletId === wallet.id;
                return (
                  <motion.div
                    key={wallet.id}
                    whileHover={{ scale: 1.01, x: 2 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleSelectWallet(wallet)}
                    className={`
                      p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4
                      ${isSelected 
                        ? 'bg-primary/15 border-primary shadow-stellar-glow text-text-primary' 
                        : 'bg-surface/60 border-border/80 hover:bg-surface hover:border-primary/40 text-text-secondary hover:text-text-primary'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Icon */}
                      <div className="w-10 h-10 rounded-2xl bg-card border border-border flex items-center justify-center flex-shrink-0 text-primary-glow overflow-hidden p-1.5">
                        {wallet.iconUrl ? (
                          <img 
                            src={wallet.iconUrl} 
                            alt={wallet.name} 
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentNode.innerHTML = '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>';
                            }}
                          />
                        ) : (
                          <Sparkles className="w-5 h-5 text-success" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-body font-semibold text-text-primary truncate">
                            {wallet.name}
                          </span>
                          {wallet.isRecommended && (
                            <span className="text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Primary
                            </span>
                          )}
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                            wallet.badgeVariant === 'success' 
                              ? 'bg-success/15 border-success/30 text-success' 
                              : 'bg-surface border-border text-text-muted'
                          }`}>
                            {wallet.badge}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary truncate mt-0.5">
                          {wallet.tagline}
                        </p>
                      </div>
                    </div>

                    {/* Action Icon */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {loading && isSelected ? (
                        <span className="text-xs text-primary-glow font-medium animate-pulse">Connecting...</span>
                      ) : (
                        <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary-glow transition-colors" />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Testnet Note */}
          <div className="p-3.5 bg-surface/50 border border-border/60 rounded-2xl flex items-center justify-between text-xs text-text-secondary">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary-glow" />
              <span>Stellar Testnet (Protocol 20) • Non-Custodial Key Signatures</span>
            </div>
            <a
              href="https://developers.stellar.org/docs/tools/developer-tools/wallets"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary-glow inline-flex items-center gap-1 font-semibold"
            >
              <span>Docs</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
