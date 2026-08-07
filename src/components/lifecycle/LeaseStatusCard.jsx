import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../cards/Card';
import { StatusBadge } from '../status/StatusBadge';
import { PrimaryButton } from '../buttons/PrimaryButton';
import { SecondaryButton } from '../buttons/SecondaryButton';
import { ShieldCheck, Calendar, Clock, Play, AlertCircle, ArrowRight } from 'lucide-react';
import { useAgreements } from '../../context/AgreementContext';

export const LeaseStatusCard = ({ agreement, isLandlord }) => {
  const { activateLease, endLease } = useAgreements();

  if (!agreement) return null;

  const status = agreement.status;

  if (status === 'Deposit Locked') {
    return (
      <Card className="p-6 bg-gradient-to-r from-primary/15 via-card to-card border border-primary/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/50 text-primary-glow flex items-center justify-center shadow-stellar-glow">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-h3 text-text-primary">Escrow Funded & Verified</h3>
              <p className="text-caption text-text-secondary">Ready for Lease Activation</p>
            </div>
          </div>
          <StatusBadge variant="primary" size="md">
            Deposit Locked
          </StatusBadge>
        </div>

        <p className="text-body text-text-secondary">
          Security deposit of <strong className="text-text-primary font-mono">{(agreement.depositAmount || 0) + (agreement.utilityReserve || 0)} XLM</strong> is safely locked in the Soroban smart contract vault.
        </p>

        <div className="pt-2 flex justify-end">
          <PrimaryButton 
            icon={Play} 
            onClick={() => activateLease(agreement.id)}
          >
            Activate Lease Period
          </PrimaryButton>
        </div>
      </Card>
    );
  }

  if (status === 'Lease Active') {
    return (
      <Card className="p-6 bg-gradient-to-r from-success/15 via-card to-card border border-success/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-success/20 border border-success/50 text-success flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-h3 text-text-primary">Lease Period Currently Active</h3>
              <p className="text-caption text-text-secondary">Ongoing Rental Occupancy</p>
            </div>
          </div>
          <StatusBadge variant="success" size="md" className="animate-pulse">
            Lease Active
          </StatusBadge>
        </div>

        <div className="p-4 bg-background/80 rounded-2xl border border-border/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-success" />
            <span className="text-caption text-text-secondary">Occupancy Progress:</span>
          </div>
          <span className="text-body font-bold text-success">Active Lease Period</span>
        </div>

        <div className="pt-2 flex justify-end">
          <SecondaryButton 
            icon={ArrowRight} 
            onClick={() => endLease(agreement.id)}
          >
            Trigger Lease End & Settlement
          </SecondaryButton>
        </div>
      </Card>
    );
  }

  if (status === 'Lease Ended') {
    return (
      <Card className="p-6 bg-gradient-to-r from-warning/15 via-card to-card border border-warning/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-warning/20 border border-warning/50 text-warning flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-h3 text-text-primary">Lease Period Ended</h3>
              <p className="text-caption text-text-secondary">Utility Settlement Required</p>
            </div>
          </div>
          <StatusBadge variant="warning" size="md">
            Lease Ended
          </StatusBadge>
        </div>
        <p className="text-body text-text-secondary">
          {isLandlord 
            ? 'The rental occupancy period has ended. Please submit utility deductions below.' 
            : 'The lease period has ended. Waiting for landlord utility bill submission.'}
        </p>
      </Card>
    );
  }

  return null;
};
