import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../cards/Card';
import { NetworkBadge } from './NetworkBadge';
import { SecondaryButton } from '../buttons/SecondaryButton';
import { useWallet } from '../../context/WalletContext';
import { Copy, Check, Wallet, ShieldCheck, Key, ExternalLink, Clock, RefreshCw } from 'lucide-react';

export const WalletCard = () => {
  const { connected, address, network, connectedAt, openSwitchModal, disconnectWallet } = useWallet();
  const [copied, setCopied] = useState(false);
  const [timeAgo, setTimeAgo] = useState('Connected just now');

  // Compute live relative time
  useEffect(() => {
    if (!connectedAt) return;

    const updateTimeAgo = () => {
      const diffMs = Date.now() - connectedAt;
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) {
        setTimeAgo('Connected just now');
      } else if (diffMins === 1) {
        setTimeAgo('Connected 1 minute ago');
      } else if (diffMins < 60) {
        setTimeAgo(`Connected ${diffMins} minutes ago`);
      } else {
        const diffHours = Math.floor(diffMins / 60);
        setTimeAgo(`Connected ${diffHours} hour${diffHours > 1 ? 's' : ''} ago`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 60000);
    return () => clearInterval(interval);
  }, [connectedAt]);

  const copyToClipboard = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!connected) return null;

  const explorerUrl = `https://testnet.steexp.com/account/${address}`;

  return (
    <Card className="space-y-6 bg-gradient-to-br from-card via-card to-surface border border-primary/30 shadow-stellar-glow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-primary-glow">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-h3 text-text-primary">Connected Wallet</h3>
            <p className="text-caption text-text-secondary">Freighter Cryptographic Session</p>
          </div>
        </div>
        <NetworkBadge network={network} />
      </div>

      {/* Wallet Address Row & Copy Button */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-caption text-text-muted font-mono uppercase tracking-wider block">
            Public Key Address
          </label>
          
          {/* Live Connection Timestamp */}
          <div className="flex items-center gap-1.5 text-xs text-text-muted font-medium">
            <Clock className="w-3.5 h-3.5 text-primary-glow" />
            <span>{timeAgo}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 p-3.5 bg-background/80 rounded-2xl border border-border/80 font-mono text-caption text-text-primary overflow-hidden">
          <span className="truncate">{address}</span>
          
          {/* Enhanced Animated Copy Address Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={copyToClipboard}
            aria-label="Copy public wallet address to clipboard"
            className={`
              inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-sans text-xs font-semibold
              transition-all duration-200 cursor-pointer flex-shrink-0 select-none
              focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-glow
              ${copied 
                ? 'bg-success/15 border border-success/40 text-success shadow-sm' 
                : 'bg-surface hover:bg-surface-hover border border-border text-text-secondary hover:text-text-primary'
              }
            `}
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span
                  key="copied"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-1 text-success"
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Copied!</span>
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Address</span>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Action Shortcuts & Switch Wallet Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 border-t border-border/60">
        
        {/* Open Stellar Explorer Button */}
        <motion.a
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          href={explorerUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Open Stellar Expert Testnet Explorer in a new tab"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-medium text-caption text-text-primary bg-surface hover:bg-surface-hover border border-border hover:border-primary/50 shadow-sm hover:shadow-stellar transition-all duration-200 cursor-pointer"
        >
          <span>Open Stellar Explorer</span>
          <ExternalLink className="w-4 h-4 text-primary-glow" />
        </motion.a>

        {/* Phase 6.6 Switch Wallet & Disconnect Controls */}
        <div className="flex items-center gap-2 justify-end">
          <SecondaryButton 
            icon={RefreshCw} 
            onClick={openSwitchModal}
            className="text-xs"
          >
            Switch Wallet
          </SecondaryButton>

          <SecondaryButton 
            onClick={disconnectWallet}
            className="text-xs"
          >
            Disconnect
          </SecondaryButton>
        </div>

      </div>
    </Card>
  );
};
