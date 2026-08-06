import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, AlertCircle, Send, ArrowRight } from 'lucide-react';
import { Card } from '../cards/Card';

export const TransactionStatus = ({ status, errorMsg }) => {
  if (status === 'idle') {
    return (
      <div className="p-4 bg-background/50 rounded-2xl border border-border/60 text-caption text-text-secondary flex items-center gap-3">
        <Send className="w-5 h-5 text-primary-glow flex-shrink-0" />
        <span>Ready to build and sign transaction on Stellar Testnet via Freighter.</span>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <Card className="p-6 text-center border-primary/40 space-y-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 text-primary-glow flex items-center justify-center mx-auto">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <div className="space-y-1">
          <h4 className="text-h3 text-text-primary">Processing Payment...</h4>
          <p className="text-caption text-text-secondary max-w-sm mx-auto">
            Please approve the transaction prompt in your Freighter extension and wait for Horizon confirmation.
          </p>
        </div>
      </Card>
    );
  }

  if (status === 'failure') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-5 bg-error/15 border border-error/40 rounded-3xl space-y-3 text-error"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-error/20 border border-error/40 flex items-center justify-center text-error flex-shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-body font-semibold">Transaction Failed</h4>
            <p className="text-caption text-error/90 mt-0.5">{errorMsg || 'Failed to submit payment transaction to Stellar Testnet.'}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
};
