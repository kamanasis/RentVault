import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

export const WalletErrorBanner = () => {
  const { error, clearError } = useWallet();

  if (!error) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4"
      >
        <div className="bg-error/15 border border-error/40 rounded-2xl p-4 flex items-center justify-between gap-4 text-error shadow-lg">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div className="text-caption font-medium">
              <strong className="font-semibold block sm:inline sm:mr-1">Wallet Connection Notice:</strong>
              <span>{error}</span>
            </div>
          </div>

          <button
            onClick={clearError}
            className="p-1 rounded-lg hover:bg-error/20 text-error/80 hover:text-error transition-colors cursor-pointer"
            aria-label="Dismiss error notification"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
