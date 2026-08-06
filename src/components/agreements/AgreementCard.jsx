import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../cards/Card';
import { AgreementStatusBadge } from './AgreementStatusBadge';
import { Building, Calendar, Wallet, ArrowRight, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AgreementCard = ({ agreement }) => {
  const navigate = useNavigate();

  if (!agreement) return null;

  const truncateKey = (key) => {
    if (!key) return 'G...';
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
  };

  const totalEscrow = (agreement.depositAmount || 0) + (agreement.utilityReserve || 0);

  return (
    <Card hoverEffect className="flex flex-col justify-between space-y-5 border-border/80 group">
      <div className="space-y-4">
        {/* Header Row: ID & Status Badge */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-mono font-semibold text-primary-glow bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
            {agreement.id}
          </span>
          <AgreementStatusBadge status={agreement.status} />
        </div>

        {/* Property Name & Address */}
        <div>
          <h3 className="text-h3 text-text-primary group-hover:text-primary-glow transition-colors line-clamp-1">
            {agreement.propertyName}
          </h3>
          <p className="text-caption text-text-secondary mt-0.5 line-clamp-1">
            {agreement.propertyAddress}
          </p>
        </div>

        {/* Tenant & Landlord Wallets */}
        <div className="p-3 bg-background/60 rounded-2xl border border-border/60 text-xs space-y-1.5 font-mono">
          <div className="flex justify-between items-center">
            <span className="text-text-muted">Tenant Address:</span>
            <span className="text-text-primary font-semibold">{truncateKey(agreement.tenantWallet)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-muted">Lease Duration:</span>
            <span className="text-text-secondary font-sans font-medium text-[11px]">{agreement.leaseStart} → {agreement.leaseEnd}</span>
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-2.5 bg-surface/50 rounded-xl border border-border/40">
            <span className="text-[11px] text-text-muted block">Security Deposit</span>
            <span className="text-body font-bold text-text-primary">{agreement.depositAmount} XLM</span>
          </div>
          <div className="p-2.5 bg-surface/50 rounded-xl border border-border/40">
            <span className="text-[11px] text-text-muted block">Utility Reserve</span>
            <span className="text-body font-bold text-text-primary">{agreement.utilityReserve} XLM</span>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="pt-3 border-t border-border/60 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-text-muted uppercase tracking-wider block">Total Escrow</span>
          <span className="text-h3 font-bold text-primary-glow">{totalEscrow} XLM</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(`/agreements/${agreement.id}`)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/30 text-caption font-semibold text-primary-glow transition-all cursor-pointer"
        >
          <span>Open Agreement</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </Card>
  );
};
