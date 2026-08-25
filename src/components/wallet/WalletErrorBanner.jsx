import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, Download, Sparkles, RefreshCw } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

export const WalletErrorBanner = () => {
  const { error, errorState, clearError, fundTestnetAccount, openWalletModal } = useWallet();

  if (!error && !errorState) return null;

  const code = errorState?.code || 'ERROR';
  const message = errorState?.message || error;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4"
      >
        <div className={`border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg ${
          code === 'WALLET_NOT_FOUND'
            ? 'bg-warning/15 border-warning/40 text-warning'
            : code === 'INSUFFICIENT_BALANCE'
            ? 'bg-error/15 border-error/40 text-error'
            : 'bg-error/15 border-error/40 text-error'
        }`}>
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 sm:mt-0" />
            <div className="text-caption font-medium min-w-0">
              <span className="font-mono font-bold uppercase text-[11px] px-2 py-0.5 rounded-full mr-2 bg-background/50 border border-current">
                {code}
              </span>
              <span>{message}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {code === 'WALLET_NOT_FOUND' && errorState?.downloadUrl && (
              <a
                href={errorState.downloadUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white font-semibold text-xs hover:bg-primary-hover transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Get Extension</span>
              </a>
            )}

            {code === 'INSUFFICIENT_BALANCE' && (
              <button
                onClick={fundTestnetAccount}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-success text-white font-semibold text-xs hover:bg-success/90 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Fund Account (+10,000 XLM)</span>
              </button>
            )}

            {code === 'USER_REJECTED' && (
              <button
                onClick={openWalletModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-border text-text-primary font-semibold text-xs hover:bg-surface/80 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            )}

            <button
              onClick={clearError}
              className="p-1.5 rounded-lg hover:bg-black/10 text-current/80 hover:text-current transition-colors cursor-pointer"
              aria-label="Dismiss error notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
