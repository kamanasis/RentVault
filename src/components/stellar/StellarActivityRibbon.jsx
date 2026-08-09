import React from 'react';
import { Card } from '../cards/Card';
import { ShieldCheck, ExternalLink, Activity } from 'lucide-react';
import { getSorobanContractId } from '../../services/soroban';

export const StellarActivityRibbon = () => {
  const contractId = getSorobanContractId();
  const truncateKey = (key) => `${key.slice(0, 8)}...${key.slice(-6)}`;
  const explorerUrl = `https://testnet.steexp.com/contract/${contractId}`;

  return (
    <Card className="p-4 bg-surface/80 border-border/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/30 text-primary-glow flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-success animate-ping" />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-success border-2 border-background" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-caption font-semibold text-text-primary">Stellar Testnet On-Chain Status</h4>
            <span className="text-[10px] font-mono font-bold bg-success/15 border border-success/30 text-success px-2 py-0.5 rounded-full">
              Soroban Active
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">
            Contract ID: <span className="font-mono text-primary-glow">{truncateKey(contractId)}</span> — Consensus Ledger Active
          </p>
        </div>
      </div>

      <a
        href={explorerUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-background hover:bg-surface border border-border text-xs font-semibold text-text-secondary hover:text-text-primary transition-all cursor-pointer flex-shrink-0"
      >
        <span>View on Explorer</span>
        <ExternalLink className="w-3.5 h-3.5 text-primary-glow" />
      </a>
    </Card>
  );
};
