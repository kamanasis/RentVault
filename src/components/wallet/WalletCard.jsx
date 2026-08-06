import React, { useState } from 'react';
import { Card } from '../cards/Card';
import { NetworkBadge } from './NetworkBadge';
import { useWallet } from '../../context/WalletContext';
import { Copy, Check, Wallet, ShieldCheck, Key } from 'lucide-react';

export const WalletCard = () => {
  const { connected, address, network } = useWallet();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!connected) return null;

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

      <div className="space-y-2">
        <label className="text-caption text-text-muted font-mono uppercase tracking-wider block">
          Public Key Address
        </label>
        <div className="flex items-center justify-between gap-2 p-3.5 bg-background/80 rounded-2xl border border-border/80 font-mono text-caption text-text-primary overflow-hidden">
          <span className="truncate">{address}</span>
          <button
            onClick={copyToClipboard}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface hover:bg-surface-hover border border-border text-xs text-text-secondary hover:text-text-primary transition-colors cursor-pointer flex-shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-success" />
                <span className="text-success font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2 text-caption">
        <div className="flex items-center gap-2 text-text-secondary">
          <ShieldCheck className="w-4 h-4 text-success" />
          <span>Freighter Authenticated</span>
        </div>
        <div className="flex items-center gap-2 text-text-secondary">
          <Key className="w-4 h-4 text-primary-glow" />
          <span>Non-Custodial Session</span>
        </div>
      </div>
    </Card>
  );
};
