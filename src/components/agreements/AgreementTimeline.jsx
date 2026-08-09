import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, ShieldCheck, Lock, FileCheck, ArrowRightLeft } from 'lucide-react';
import { Card } from '../cards/Card';

export const AgreementTimeline = ({ currentStatus = 'Awaiting Deposit' }) => {
  const stages = [
    { id: 'created', label: 'Agreement Created', icon: FileCheck },
    { id: 'awaiting', label: 'Awaiting Deposit', icon: Clock },
    { id: 'locked', label: 'Deposit Locked', icon: Lock },
    { id: 'active', label: 'Lease Active', icon: ShieldCheck },
    { id: 'ended', label: 'Lease Ended', icon: Clock },
    { id: 'settlement', label: 'Utility Settlement', icon: ArrowRightLeft },
    { id: 'completed', label: 'Refund Completed', icon: CheckCircle2 },
  ];

  const isCompleted = currentStatus === 'Refund Completed';

  // Determine stage active index
  const activeStageIndex = isCompleted
    ? 6
    : currentStatus === 'Utility Settlement'
    ? 5
    : currentStatus === 'Lease Ended'
    ? 4
    : currentStatus === 'Lease Active'
    ? 3
    : currentStatus === 'Deposit Locked'
    ? 2
    : currentStatus === 'Awaiting Deposit'
    ? 1
    : 0;

  const progressPercent = isCompleted ? 100 : (activeStageIndex / 6) * 100;

  return (
    <Card className="p-6 space-y-6 border-border/80">
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div>
          <h3 className="text-h3 text-text-primary">Agreement Lifecycle Timeline</h3>
          <p className="text-caption text-text-secondary">On-chain Soroban escrow progression stage</p>
        </div>
        <span className={`text-xs font-mono font-semibold px-3 py-1 rounded-full ${
          isCompleted 
            ? 'text-success bg-success/15 border border-success/30' 
            : 'text-primary-glow bg-primary/10 border border-primary/20'
        }`}>
          Stage {activeStageIndex + 1} of 7
        </span>
      </div>

      {/* Timeline Nodes */}
      <div className="relative pt-2 pb-4 overflow-x-auto scrollbar-none">
        {/* Connecting Progress Line */}
        <div className="absolute top-7 left-6 right-6 h-0.5 bg-border/60 z-0">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-success"
          />
        </div>

        <div className="relative z-10 flex items-center justify-between min-w-[640px] px-2">
          {stages.map((stage, idx) => {
            const isReached = idx <= activeStageIndex;
            const Icon = stage.icon;

            return (
              <div key={stage.id} className="flex flex-col items-center text-center space-y-2 max-w-[90px]">
                {/* Node Circle */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.08 }}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all ${
                    isReached
                      ? 'bg-success/20 border-success/60 text-success shadow-sm shadow-success/20'
                      : 'bg-surface border-border/80 text-text-muted'
                  }`}
                >
                  {isReached ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <Icon className="w-4 h-4 text-text-muted" />
                  )}
                </motion.div>

                {/* Stage Title */}
                <span className={`text-[11px] font-medium leading-tight ${
                  isReached ? 'text-success font-semibold' : 'text-text-muted'
                }`}>
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
