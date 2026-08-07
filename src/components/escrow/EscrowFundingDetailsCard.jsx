import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../cards/Card';
import { StatusBadge } from '../status/StatusBadge';
import { ShieldCheck, Copy, Check, ExternalLink, UserCheck, Clock, Coins } from 'lucide-react';

export const EscrowFundingDetailsCard = ({ agreement }) => {
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedTenant, setCopiedTenant] = useState(false);

  if (!agreement || agreement.status !== 'Deposit Locked') return null;

  const totalEscrow = (agreement.depositAmount || 0) + (agreement.utilityReserve || 0);
  const explorerUrl = agreement.txHash ? `https://testnet.steexp.com/tx/${agreement.txHash}` : '#';

  const copyText = (text, setCopied) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="space-y-4 border border-success/40 bg-gradient-to-br from-card via-card to-surface shadow-stellar-glow">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-success/15 border border-success/30 text-success flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-h3 text-text-primary">Escrow Funding Details</h3>
            <p className="text-caption text-text-secondary">On-Chain Soroban Deposit Attribution</p>
          </div>
        </div>
        <StatusBadge variant="success" size="sm">
          Verified On-Chain
        </StatusBadge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-caption">
        {/* Funded By */}
        <div className="p-3 bg-background/80 rounded-xl border border-border/60 space-y-1">
          <div className="flex justify-between items-center text-text-muted text-xs font-sans">
            <span>Funded By (Tenant Wallet):</span>
            <button
              onClick={() => copyText(agreement.tenantWallet, setCopiedTenant)}
              className="text-primary-glow hover:underline inline-flex items-center gap-1 text-xs cursor-pointer font-sans"
            >
              {copiedTenant ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
              <span>{copiedTenant ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="text-text-primary truncate font-semibold">{agreement.tenantWallet}</div>
        </div>

        {/* Amount */}
        <div className="p-3 bg-background/80 rounded-xl border border-border/60 space-y-1">
          <span className="text-text-muted text-xs block font-sans">Total Amount Funded</span>
          <div className="text-h3 font-extrabold text-success">{totalEscrow} XLM</div>
        </div>
      </div>

      {/* Transaction Hash & Timestamp */}
      <div className="p-3 bg-background/80 rounded-xl border border-border/60 space-y-2 font-mono text-xs">
        {agreement.txHash && (
          <div className="flex items-center justify-between gap-2">
            <span className="text-text-muted font-sans">Stellar Tx Hash:</span>
            <div className="flex items-center gap-2">
              <span className="text-primary-glow font-semibold truncate max-w-[160px] sm:max-w-[240px]">
                {agreement.txHash}
              </span>
              <button
                onClick={() => copyText(agreement.txHash, setCopiedHash)}
                className="p-1 rounded bg-surface hover:bg-surface-hover border border-border text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                aria-label="Copy hash"
              >
                {copiedHash ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center text-text-muted pt-1 border-t border-border/40 font-sans">
          <span>Funding Timestamp:</span>
          <span className="text-text-primary font-medium font-mono">
            {agreement.depositConfirmedAt ? new Date(agreement.depositConfirmedAt).toLocaleString() : 'Recent'}
          </span>
        </div>
      </div>

      {/* Explorer Link */}
      {agreement.txHash && (
        <div className="pt-1 text-right">
          <a
            href={explorerUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-primary-glow hover:underline font-semibold cursor-pointer"
          >
            <span>View on Stellar Expert Explorer</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </Card>
  );
};
