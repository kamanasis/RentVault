import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Copy, Check, ArrowUpRight, ArrowDownLeft, ShieldCheck, Clock } from 'lucide-react';
import { StatusBadge } from '../status/StatusBadge';
import { SecondaryButton } from '../buttons/SecondaryButton';

export const TransactionDetailModal = ({ tx, onClose }) => {
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedSender, setCopiedSender] = useState(false);
  const [copiedRecipient, setCopiedRecipient] = useState(false);

  if (!tx) return null;

  const explorerUrl = `https://testnet.steexp.com/tx/${tx.hash}`;

  const copyToClipboard = (text, setCopiedState) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-stellar-glow space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
                tx.direction === 'sent' ? 'bg-error/10 border-error/30 text-error' : 'bg-success/10 border-success/30 text-success'
              }`}>
                {tx.direction === 'sent' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-h3 text-text-primary capitalize">
                  {tx.direction === 'sent' ? 'Payment Sent' : 'Payment Received'}
                </h3>
                <p className="text-caption text-text-secondary">Stellar Testnet Horizon Operation</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-text-muted hover:text-text-primary rounded-xl bg-surface border border-border transition-colors cursor-pointer"
              aria-label="Close transaction details modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Amount Showcase */}
          <div className="text-center py-4 bg-surface/50 rounded-2xl border border-border/80 space-y-1">
            <span className="text-caption text-text-muted uppercase tracking-wider block">Transaction Amount</span>
            <div className={`text-hero font-extrabold ${tx.direction === 'sent' ? 'text-text-primary' : 'text-success'}`}>
              {tx.direction === 'sent' ? '-' : '+'}{tx.amount} <span className="text-h2 font-bold text-primary-glow">XLM</span>
            </div>
            <StatusBadge variant="success" size="sm" className="mt-1">
              Confirmed on Horizon RPC
            </StatusBadge>
          </div>

          {/* Detailed Transaction Parameters */}
          <div className="space-y-3 font-mono text-caption">
            {/* Hash */}
            <div className="p-3 bg-background/80 rounded-xl border border-border/60 space-y-1">
              <div className="flex justify-between items-center text-text-muted text-xs">
                <span>Transaction Hash:</span>
                <button 
                  onClick={() => copyToClipboard(tx.hash, setCopiedHash)}
                  className="flex items-center gap-1 text-primary-glow hover:underline text-xs"
                >
                  {copiedHash ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedHash ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="text-text-primary truncate font-semibold">{tx.hash}</div>
            </div>

            {/* Sender */}
            <div className="p-3 bg-background/80 rounded-xl border border-border/60 space-y-1">
              <div className="flex justify-between items-center text-text-muted text-xs">
                <span>Sender Public Key:</span>
                <button 
                  onClick={() => copyToClipboard(tx.sender, setCopiedSender)}
                  className="flex items-center gap-1 text-primary-glow hover:underline text-xs"
                >
                  {copiedSender ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSender ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="text-text-primary truncate font-semibold">{tx.sender}</div>
            </div>

            {/* Recipient */}
            <div className="p-3 bg-background/80 rounded-xl border border-border/60 space-y-1">
              <div className="flex justify-between items-center text-text-muted text-xs">
                <span>Recipient Public Key:</span>
                <button 
                  onClick={() => copyToClipboard(tx.recipient, setCopiedRecipient)}
                  className="flex items-center gap-1 text-primary-glow hover:underline text-xs"
                >
                  {copiedRecipient ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedRecipient ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="text-text-primary truncate font-semibold">{tx.recipient}</div>
            </div>

            {/* Fee & Timestamp */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-background/80 rounded-xl border border-border/60">
                <span className="text-text-muted block mb-0.5">Base Fee Paid</span>
                <span className="text-text-primary font-semibold">{tx.fee || '100 stroops'}</span>
              </div>
              <div className="p-3 bg-background/80 rounded-xl border border-border/60">
                <span className="text-text-muted block mb-0.5">Timestamp</span>
                <span className="text-text-primary font-semibold">
                  {tx.timestamp ? new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
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

            <SecondaryButton onClick={onClose} fullWidth className="sm:w-auto text-xs">
              Close Details
            </SecondaryButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
