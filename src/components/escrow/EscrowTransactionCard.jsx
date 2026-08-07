import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../cards/Card';
import { StatusBadge } from '../status/StatusBadge';
import { PrimaryButton } from '../buttons/PrimaryButton';
import { SecondaryButton } from '../buttons/SecondaryButton';
import { CheckCircle2, Copy, Check, ExternalLink, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EscrowTransactionCard = ({
  agreementId,
  amountLocked,
  hash,
  contractId,
  ledger,
  timestamp,
}) => {
  const navigate = useNavigate();
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedContract, setCopiedContract] = useState(false);

  const copyText = (text, setCopied) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
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
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-h3 text-text-primary">Soroban Escrow Locked!</h3>
              <p className="text-caption text-text-secondary">On-Chain Deposit Execution Confirmed</p>
            </div>
          </div>
          <StatusBadge variant="success" size="md">
            Deposit Locked
          </StatusBadge>
        </div>

        {/* Transaction Summary Box */}
        <div className="p-4 bg-background/80 rounded-2xl border border-border/80 space-y-3 font-mono text-caption">
          <div className="flex justify-between items-center">
            <span className="text-text-muted">Agreement ID:</span>
            <span className="text-h3 font-bold text-primary-glow">{agreementId}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-text-muted font-sans font-medium">Total Amount Locked:</span>
            <span className="text-h2 font-extrabold text-success">{amountLocked} XLM</span>
          </div>

          {contractId && (
            <div className="flex justify-between items-center pt-2 border-t border-border/60">
              <span className="text-text-muted">Soroban Contract ID:</span>
              <div className="flex items-center gap-2">
                <span className="text-primary-glow font-semibold truncate max-w-[140px] sm:max-w-[200px]">{contractId}</span>
                <button
                  onClick={() => copyText(contractId, setCopiedContract)}
                  className="p-1 rounded bg-surface hover:bg-surface-hover border border-border text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                  aria-label="Copy contract ID"
                >
                  {copiedContract ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-text-muted">Transaction Hash:</span>
            <div className="flex items-center gap-2">
              <span className="text-primary-glow font-semibold truncate max-w-[140px] sm:max-w-[200px]">{hash}</span>
              <button
                onClick={() => copyText(hash, setCopiedHash)}
                className="p-1 rounded bg-surface hover:bg-surface-hover border border-border text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                aria-label="Copy transaction hash"
              >
                {copiedHash ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          <div className="flex justify-between text-xs text-text-muted pt-1">
            <span>Timestamp: {timestamp ? new Date(timestamp).toLocaleTimeString() : 'Just now'}</span>
            {ledger && <span>Ledger: #{ledger}</span>}
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
