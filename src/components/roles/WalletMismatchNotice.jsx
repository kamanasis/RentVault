import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../cards/Card';
import { Lock, AlertCircle, RefreshCw } from 'lucide-react';
import { SecondaryButton } from '../buttons/SecondaryButton';

export const WalletMismatchNotice = ({ requiredRole = 'tenant', connectedAddress }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 bg-warning/10 border border-warning/30 rounded-3xl space-y-3"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-2xl bg-warning/20 border border-warning/40 flex items-center justify-center text-warning flex-shrink-0 mt-0.5">
          <Lock className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-body font-semibold text-text-primary">
            {requiredRole === 'tenant' ? 'Tenant Wallet Authorization Required' : 'Landlord Wallet Authorization Required'}
          </h4>
          <p className="text-caption text-text-secondary leading-relaxed">
            {requiredRole === 'tenant'
              ? 'Only the assigned tenant wallet key can sign and execute the Soroban escrow deposit transaction for this rental agreement.'
              : 'Only the assigned landlord wallet key can modify agreement terms or issue lease settlement releases.'}
          </p>
          <p className="text-xs font-mono text-warning/90 pt-1">
            Connected Wallet: {connectedAddress ? `${connectedAddress.slice(0, 6)}...${connectedAddress.slice(-6)}` : 'None'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
