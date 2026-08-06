import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../cards/Card';
import { useWallet } from '../../context/WalletContext';
import { Coins, RefreshCw, Clock, Zap, ArrowUpRight, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const BalanceCard = () => {
  const navigate = useNavigate();
  const { 
    connected, 
    xlmBalance, 
    isFetchingBalance, 
    balanceUpdatedAt, 
    refreshBalance, 
    isUnfunded,
    fundTestnetAccount 
  } = useWallet();

  const [timeAgo, setTimeAgo] = useState('Updated just now');

  // Compute live relative update timestamp
  useEffect(() => {
    if (!balanceUpdatedAt) return;

    const updateTime = () => {
      const diffMs = Date.now() - balanceUpdatedAt;
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffMs / 60000);

      if (diffSecs < 10) {
        setTimeAgo('Updated just now');
      } else if (diffSecs < 60) {
        setTimeAgo(`Updated ${diffSecs}s ago`);
      } else if (diffMins === 1) {
        setTimeAgo('Updated 1m ago');
      } else {
        setTimeAgo(`Updated ${diffMins}m ago`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, [balanceUpdatedAt]);

  if (!connected) return null;

  return (
    <Card className="space-y-6 bg-gradient-to-br from-card via-card to-surface border border-primary/40 shadow-stellar-glow relative overflow-hidden group">
      {/* Subtle Glow Backdrop */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/15 transition-all" />

      <div className="flex items-center justify-between gap-4 pb-4 border-b border-border/80 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-success flex-shrink-0 shadow-sm">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-h3 text-text-primary">Stellar Wallet Balance</h3>
            <p className="text-caption text-text-secondary">Native Testnet Asset (XLM)</p>
          </div>
        </div>

        {/* Refresh Balance Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          onClick={refreshBalance}
          disabled={isFetchingBalance}
          aria-label="Refresh native XLM balance"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface hover:bg-surface-hover border border-border text-xs text-text-secondary hover:text-text-primary transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetchingBalance ? 'animate-spin text-primary-glow' : ''}`} />
          <span>{isFetchingBalance ? 'Syncing...' : 'Refresh'}</span>
        </motion.button>
      </div>

      {/* Live XLM Amount & Skeleton Loading */}
      <div className="relative z-10 space-y-2">
        <div className="flex items-baseline justify-between gap-4">
          <div className="flex items-baseline gap-2">
            {isFetchingBalance ? (
              <div className="h-12 w-48 bg-surface/80 rounded-2xl animate-pulse" />
            ) : (
              <motion.div 
                key={xlmBalance}
                initial={{ opacity: 0.5, y: -2 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-hero text-text-primary font-extrabold tracking-tight flex items-baseline gap-2"
              >
                <span>{xlmBalance}</span>
                <span className="text-h2 font-bold text-primary-glow">XLM</span>
              </motion.div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/payment')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary-glow hover:bg-primary/20 text-caption font-semibold transition-all cursor-pointer"
          >
            <span>Send Payment</span>
            <ArrowUpRight className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="flex items-center justify-between text-xs text-text-muted pt-1">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-primary-glow" />
            <span>{timeAgo}</span>
          </div>

          {isUnfunded && (
            <button
              onClick={fundTestnetAccount}
              disabled={isFetchingBalance}
              className="inline-flex items-center gap-1 text-xs text-warning hover:underline font-semibold cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Fund Account via Friendbot (10,000 XLM)</span>
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};
