import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../cards/Card';
import { StatusBadge } from '../status/StatusBadge';
import { Clock, Loader2, Lock, ShieldCheck, AlertCircle, CheckCircle2, LockKeyhole } from 'lucide-react';

export const EscrowStatusCard = ({ status = 'Awaiting Deposit', errorMessage }) => {
  if (status === 'Refund Completed') {
    return (
      <Card className="p-6 bg-success/10 border-success/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-success/20 border border-success/50 text-success flex items-center justify-center">
              <LockKeyhole className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-h3 text-text-primary">Escrow Closed</h3>
              <p className="text-caption text-text-secondary">Agreement Successfully Settled</p>
            </div>
          </div>
          <StatusBadge variant="success" size="md">
            Contract Finalized
          </StatusBadge>
        </div>
        <p className="text-body text-text-secondary">
          No further actions available. All security deposit funds have been released according to Soroban smart contract terms.
        </p>
      </Card>
    );
  }

  if (status === 'Locking Escrow') {
    return (
      <Card className="p-6 bg-primary/10 border-primary/40 space-y-4 text-center">
        <div className="w-14 h-14 rounded-3xl bg-primary/20 border border-primary/50 text-primary-glow flex items-center justify-center mx-auto shadow-stellar-glow">
          <Loader2 className="w-7 h-7 animate-spin" />
        </div>
        <div className="space-y-1">
          <h3 className="text-h3 text-text-primary">Locking Escrow on Soroban...</h3>
          <p className="text-caption text-text-secondary max-w-md mx-auto">
            Please approve the smart contract transaction in your Freighter wallet extension. Do not close this window.
          </p>
        </div>
        <StatusBadge variant="primary" size="md" className="animate-pulse">
          Signing & Submitting Transaction...
        </StatusBadge>
      </Card>
    );
  }

  const isLockedState = 
    status === 'Deposit Locked' || 
    status === 'Lease Active' || 
    status === 'Lease Ended' || 
    status === 'Utility Settlement' || 
    status === 'Approval Pending' || 
    status === 'Dispute Pending';

  if (isLockedState) {
    return (
      <Card className="p-6 bg-success/10 border-success/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-success/20 border border-success/50 text-success flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-h3 text-text-primary">Escrow Deposit Locked!</h3>
              <p className="text-caption text-text-secondary">Soroban Smart Contract Vault Verified</p>
            </div>
          </div>
          <StatusBadge variant="success" size="md">
            On-Chain Locked
          </StatusBadge>
        </div>
        <p className="text-body text-text-secondary">
          Security XLM deposit is safely held in the Soroban escrow contract on Stellar Testnet. Funds will remain locked until lease completion or mutual agreement release.
        </p>
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
            <h4 className="text-body font-semibold">Escrow Transaction Error</h4>
            <p className="text-caption text-error/90 mt-0.5">{errorMessage || 'Failed to complete Soroban smart contract deposit transaction.'}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Default: Awaiting Deposit
  return (
    <Card className="p-6 bg-warning/10 border-warning/30 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-warning font-semibold text-caption">
          <Clock className="w-4 h-4" />
          <span>Escrow Status: Awaiting Deposit</span>
        </div>
        <StatusBadge variant="warning" size="sm">
          Action Required
        </StatusBadge>
      </div>
      <p className="text-body text-text-secondary">
        The tenant has not deposited the required security XLM into the Soroban escrow vault yet.
      </p>
    </Card>
  );
};
