import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../cards/Card';
import { StatusBadge } from '../status/StatusBadge';
import { PrimaryButton } from '../buttons/PrimaryButton';
import { SecondaryButton } from '../buttons/SecondaryButton';
import { CheckCircle2, Copy, Check, ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TransactionHashCard = ({ 
  hash, 
  amount, 
  recipient, 
  ledger, 
  onReset 
}) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const copyHash = () => {
    if (!hash) return;
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const explorerUrl = `https://testnet.steexp.com/tx/${hash}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Card className="space-y-6 bg-gradient-to-br from-card via-card to-surface border border-success/40 shadow-stellar-glow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-success/15 border border-success/40 flex items-center justify-center text-success flex-shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-h3 text-text-primary">Payment Confirmed!</h3>
              <p className="text-caption text-text-secondary">Stellar Testnet Transaction Successful</p>
            </div>
          </div>
          <StatusBadge variant="success" size="md">
            Confirmed On-Chain
          </StatusBadge>
        </div>

        {/* Transaction Parameters Summary */}
        <div className="p-4 bg-background/80 rounded-2xl border border-border/80 space-y-3 font-mono text-caption">
          <div className="flex justify-between">
            <span className="text-text-muted">Amount Sent:</span>
            <span className="text-h3 font-bold text-success">{amount} XLM</span>
          </div>

          <div className="flex justify-between">
            <span className="text-text-muted">Recipient Key:</span>
            <span className="text-text-primary truncate max-w-[200px] sm:max-w-none">{recipient}</span>
          </div>

          {ledger && (
            <div className="flex justify-between">
              <span className="text-text-muted">Ledger Sequence:</span>
              <span className="text-primary-glow font-semibold">#{ledger}</span>
            </div>
          )}

          <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2">
            <span className="text-text-muted">Transaction Hash:</span>
            <div className="flex items-center gap-2">
              <span className="text-primary-glow font-semibold truncate max-w-[140px] sm:max-w-[260px]">{hash}</span>
              <button
                onClick={copyHash}
                className="p-1.5 rounded-lg bg-surface hover:bg-surface-hover border border-border text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                aria-label="Copy transaction hash"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <a
            href={explorerUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto"
          >
            <SecondaryButton icon={ExternalLink} fullWidth className="text-xs">
              View on Stellar Expert
            </SecondaryButton>
          </a>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {onReset && (
              <SecondaryButton onClick={onReset} className="w-full sm:w-auto">
                Send Another
              </SecondaryButton>
            )}
            <PrimaryButton icon={ArrowRight} onClick={() => navigate('/dashboard')} className="w-full sm:w-auto">
              Back to Dashboard
            </PrimaryButton>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
