import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../cards/Card';
import { StatusBadge } from '../status/StatusBadge';
import { PrimaryButton } from '../buttons/PrimaryButton';
import { SecondaryButton } from '../buttons/SecondaryButton';
import { CheckCircle2, Copy, Check, ExternalLink, ArrowRight, Coins } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RefundConfirmationCard = ({ agreement }) => {
  const navigate = useNavigate();
  const [copiedHash, setCopiedHash] = useState(false);

  if (!agreement) return null;

  const refundAmount = agreement.finalRefundAmount !== undefined 
    ? agreement.finalRefundAmount 
    : (agreement.depositAmount || 0);

  const hash = agreement.refundTxHash || agreement.txHash || '8f92a10e2b4c129d39f4011029419082001';
  const explorerUrl = `https://testnet.steexp.com/tx/${hash}`;

  const copyText = () => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

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
              <h3 className="text-h3 text-text-primary">Escrow Refund Completed!</h3>
              <p className="text-caption text-text-secondary">Stellar Testnet Settlement Execution Complete</p>
            </div>
          </div>
          <StatusBadge variant="success" size="md">
            Refund Completed
          </StatusBadge>
        </div>

        {/* Financial Refund Banner */}
        <div className="p-4 bg-background/80 rounded-2xl border border-border/80 space-y-3 font-mono text-caption">
          <div className="flex justify-between items-center font-sans">
            <span className="text-text-muted">Agreement ID:</span>
            <span className="text-h3 font-bold text-primary-glow">{agreement.id}</span>
          </div>

          <div className="flex justify-between items-center font-sans">
            <span className="text-text-muted font-medium">Refunded to Tenant Wallet:</span>
            <span className="text-h2 font-extrabold text-success">{refundAmount.toFixed(2)} XLM</span>
          </div>

          <div className="p-3 bg-surface/60 rounded-xl border border-border/60 space-y-1 text-xs">
            <span className="text-text-muted font-sans block">Tenant Public Key Address:</span>
            <span className="text-text-primary truncate font-semibold block">{agreement.tenantWallet}</span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-border/60">
            <span className="text-text-muted font-sans">Stellar Refund Tx Hash:</span>
            <div className="flex items-center gap-2">
              <span className="text-primary-glow font-semibold truncate max-w-[140px] sm:max-w-[200px]">{hash}</span>
              <button
                onClick={copyText}
                className="p-1 rounded bg-surface hover:bg-surface-hover border border-border text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                aria-label="Copy refund hash"
              >
                {copiedHash ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex justify-between text-xs text-text-muted pt-1 font-sans">
            <span>Refund Date: {agreement.refundApprovedAt ? new Date(agreement.refundApprovedAt).toLocaleTimeString() : 'Just now'}</span>
            <span className="text-success font-semibold">On-Chain Finality</span>
          </div>
        </div>

        {/* Action Buttons */}
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

          <PrimaryButton icon={ArrowRight} onClick={() => navigate('/dashboard')} className="w-full sm:w-auto">
            Return to Dashboard
          </PrimaryButton>
        </div>
      </Card>
    </motion.div>
  );
};
