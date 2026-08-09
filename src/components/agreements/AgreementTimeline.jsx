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

  // Determine stage active index (0 to 6)
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

  // Percentage width of active progress line inside the track (0% to 100%)
  const progressPercent = isCompleted ? 100 : (activeStageIndex / 6) * 100;

  return (
    <Card className="p-6 md:p-7 space-y-6 border-border/80 shadow-stellar-glow">
      {/* Timeline Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/60">
        <div>
          <h3 className="text-h3 text-text-primary">Agreement Lifecycle Timeline</h3>
          <p className="text-caption text-text-secondary">On-chain Soroban escrow progression stage</p>
        </div>
        <span className={`text-xs font-mono font-semibold px-3.5 py-1 rounded-full border ${
          isCompleted 
            ? 'text-success bg-success/15 border-success/30' 
            : 'text-primary-glow bg-primary/10 border-primary/20'
        }`}>
          Stage {activeStageIndex + 1} of 7
        </span>
      </div>

      {/* Timeline Component Container */}
      <div className="relative pt-2 pb-2 overflow-x-auto scrollbar-none">
        <div className="relative min-w-[700px] md:min-w-0 py-2">
          
          {/* Layer 1: Background Track Line (Behind Nodes) */}
          <div className="absolute top-[22px] md:top-[24px] left-[7.14%] right-[7.14%] h-1 bg-border/60 rounded-full z-0">
            {/* Layer 2: Green Progress Line */}
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="h-full bg-success rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"
            />
          </div>

          {/* Layer 3: 7 Stage Equal Columns Grid */}
          <div className="relative z-10 grid grid-cols-7 w-full">
            {stages.map((stage, idx) => {
              const isReached = idx <= activeStageIndex;
              const isCurrent = idx === activeStageIndex;
              const Icon = stage.icon;

              return (
                <div key={stage.id} className="flex flex-col items-center text-center px-1">
                  {/* Node Circle (Layered above progress line with solid background) */}
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`
                      w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-card select-none cursor-pointer
                      ${isReached
                        ? 'border-success text-success shadow-[0_0_15px_rgba(34,197,94,0.35)]'
                        : 'border-border/80 text-text-muted hover:border-border'
                      }
                      ${isCurrent ? 'ring-4 ring-success/20' : ''}
                    `}
                  >
                    {isReached ? (
                      <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-success" />
                    ) : (
                      <Icon className="w-4 h-4 md:w-5 md:h-5 text-text-muted opacity-60" />
                    )}
                  </motion.div>

                  {/* Stage Label Typography */}
                  <span className={`
                    text-[12px] md:text-[13px] font-semibold leading-tight max-w-[100px] mt-3 transition-colors duration-200
                    ${isReached ? 'text-success' : 'text-text-muted'}
                  `}>
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </Card>
  );
};
