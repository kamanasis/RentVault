import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../cards/Card';
import { 
  FileCheck, 
  Share2, 
  Eye, 
  Lock, 
  Play, 
  Clock, 
  Zap, 
  UserCheck, 
  Timer, 
  CheckCircle2 
} from 'lucide-react';

export const AgreementActivityTimeline = ({ agreement }) => {
  if (!agreement) return null;

  const status = agreement.status;
  const isLocked = status === 'Deposit Locked' || status === 'Lease Active' || status === 'Lease Ended' || status === 'Utility Settlement' || status === 'Approval Pending' || status === 'Refund Completed';
  const isActive = status === 'Lease Active' || status === 'Lease Ended' || status === 'Utility Settlement' || status === 'Approval Pending' || status === 'Refund Completed';
  const isEnded = status === 'Lease Ended' || status === 'Utility Settlement' || status === 'Approval Pending' || status === 'Refund Completed';
  const isSettled = status === 'Utility Settlement' || status === 'Approval Pending' || status === 'Refund Completed';
  const isCompleted = status === 'Refund Completed';

  const truncateKey = (key) => {
    if (!key) return 'N/A';
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
  };

  const timelineEvents = [
    {
      id: '1',
      title: 'Agreement Draft Created',
      description: `Created by Landlord (${truncateKey(agreement.landlordWallet)})`,
      icon: FileCheck,
      completed: true,
    },
    {
      id: '2',
      title: 'Deposit Link Shared',
      description: `Shared with Tenant (${truncateKey(agreement.tenantWallet)})`,
      icon: Share2,
      completed: true,
    },
    {
      id: '3',
      title: 'Tenant Viewed Agreement',
      description: 'Tenant authenticated via Freighter wallet',
      icon: Eye,
      completed: true,
    },
    {
      id: '4',
      title: 'Escrow Deposit Locked',
      description: isLocked ? `Locked ${(agreement.depositAmount || 0) + (agreement.utilityReserve || 0)} XLM in Soroban vault` : 'Awaiting tenant deposit',
      icon: Lock,
      completed: isLocked,
    },
    {
      id: '5',
      title: 'Lease Activated',
      description: isActive ? 'Rental occupancy period started' : 'Pending lease start',
      icon: Play,
      completed: isActive,
    },
    {
      id: '6',
      title: 'Lease Period Ended',
      description: isEnded ? 'Lease duration expired' : 'Occupancy ongoing',
      icon: Clock,
      completed: isEnded,
    },
    {
      id: '7',
      title: 'Utility Settlement Submitted',
      description: isSettled ? `Total Utility Deduction: ${agreement.totalDeduction || 0} XLM` : 'Awaiting landlord utility bill entry',
      icon: Zap,
      completed: isSettled,
    },
    {
      id: '8',
      title: 'Tenant Approved Refund',
      description: isCompleted ? 'Tenant reviewed and approved final refund' : 'Awaiting tenant review',
      icon: UserCheck,
      completed: isCompleted,
    },
    {
      id: '9',
      title: 'Auto-Release Executed',
      description: isCompleted ? '60s countdown auto-release timer completed' : 'Timer standby',
      icon: Timer,
      completed: isCompleted,
    },
    {
      id: '10',
      title: 'Refund Completed',
      description: isCompleted ? `Final Tenant Refund: ${agreement.finalRefundAmount || agreement.depositAmount} XLM on Stellar` : 'Escrow locked',
      icon: CheckCircle2,
      completed: isCompleted,
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
            <h3 className="text-h3 text-text-primary">Complete Lifecycle Activity Feed</h3>
            <p className="text-caption text-text-secondary">10-Stage Auditable Soroban Event History</p>
          </div>
        </div>
      </div>

      <div className="space-y-3.5 pt-1">
        {timelineEvents.map((evt, idx) => {
          const Icon = evt.icon;
          return (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="flex items-start gap-3 text-caption"
            >
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center border flex-shrink-0 mt-0.5 ${
                evt.completed 
                  ? 'bg-success/15 border-success/40 text-success' 
                  : 'bg-surface border-border/60 text-text-muted'
              }`}>
                <Icon className="w-3.5 h-3.5" />
              </div>

              <div className="flex-1 min-w-0 pb-1">
                <div className="flex items-center justify-between gap-2">
                  <span className={`font-semibold ${evt.completed ? 'text-text-primary' : 'text-text-muted'}`}>
                    {evt.title}
                  </span>
                  <span className="text-[10px] font-mono text-text-muted flex-shrink-0">Stage {evt.id}/10</span>
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
