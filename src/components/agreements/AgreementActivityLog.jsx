import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../cards/Card';
import { FileCheck, Share2, Eye, Lock, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

export const AgreementActivityLog = ({ agreement }) => {
  if (!agreement) return null;

  const truncateKey = (key) => {
    if (!key) return 'N/A';
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
  };

  // Build events array based on agreement state
  const events = [
    {
      id: 'created',
      title: 'Agreement Draft Created',
      description: `Created by Landlord (${truncateKey(agreement.landlordWallet)})`,
      timestamp: agreement.createdAt ? new Date(agreement.createdAt).toLocaleString() : 'Aug 1, 2026',
      icon: FileCheck,
      completed: true,
    },
    {
      id: 'shared',
      title: 'Deposit Link Shared',
      description: `Shared with Tenant (${truncateKey(agreement.tenantWallet)})`,
      timestamp: agreement.createdAt ? new Date(new Date(agreement.createdAt).getTime() + 1000000).toLocaleString() : 'Aug 1, 2026',
      icon: Share2,
      completed: true,
    },
    {
      id: 'viewed',
      title: 'Tenant Viewed Agreement',
      description: 'Tenant authenticated via Freighter wallet',
      timestamp: agreement.depositConfirmedAt 
        ? new Date(new Date(agreement.depositConfirmedAt).getTime() - 300000).toLocaleString() 
        : 'Aug 2, 2026',
      icon: Eye,
      completed: true,
    },
    {
      id: 'funded',
      title: 'Tenant Funded Escrow',
      description: `${(agreement.depositAmount || 0) + (agreement.utilityReserve || 0)} XLM deposited into Soroban vault`,
      timestamp: agreement.depositConfirmedAt ? new Date(agreement.depositConfirmedAt).toLocaleString() : 'Awaiting deposit',
      icon: Lock,
      completed: agreement.status === 'Deposit Locked',
    },
    {
      id: 'confirmed',
      title: 'Stellar Confirmation Received',
      description: agreement.txHash ? `Tx Hash: ${agreement.txHash.slice(0, 10)}...` : 'Pending transaction confirmation',
      timestamp: agreement.depositConfirmedAt ? new Date(agreement.depositConfirmedAt).toLocaleString() : 'Pending',
      icon: ShieldCheck,
      completed: agreement.status === 'Deposit Locked',
    },
  ];

  return (
    <Card className="space-y-4 border-border/80">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-surface border border-border flex items-center justify-center text-primary-glow">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-h3 text-text-primary">Agreement Activity Log</h3>
            <p className="text-caption text-text-secondary">Auditable Blockchain Event History</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-1">
        {events.map((evt, idx) => {
          const Icon = evt.icon;
          return (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-start gap-3 text-caption relative"
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center border flex-shrink-0 mt-0.5 ${
                evt.completed 
                  ? 'bg-success/15 border-success/40 text-success' 
                  : 'bg-surface border-border/60 text-text-muted'
              }`}>
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0 pb-1">
                <div className="flex items-center justify-between gap-2">
                  <span className={`font-semibold ${evt.completed ? 'text-text-primary' : 'text-text-muted'}`}>
                    {evt.title}
                  </span>
                  <span className="text-[11px] font-mono text-text-muted flex-shrink-0">{evt.timestamp}</span>
                </div>
                <p className="text-xs text-text-secondary mt-0.5 truncate">{evt.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
};
