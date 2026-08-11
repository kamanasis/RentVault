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

  // Determine active stage index (0 to 6)
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

  // Progress line percentage (0% to 100%) reaching from center of stage 1 (7.14%) to active stage center
  const progressPercent = isCompleted ? 100 : (activeStageIndex / 6) * 100;

  return (
    <Card className="p-6 md:p-8 space-y-6 border-border/80 shadow-stellar-glow">
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

      {/* Timeline Layout Container */}
      <div className="relative pt-3 pb-2 overflow-x-auto scrollbar-none">
        <div className="relative min-w-[760px] lg:min-w-0 py-2">
          
          {/* Layer 1: Background Gray Track Line (3px thickness, aligned at exact vertical center y=24px of 48px circle) */}
          <div className="absolute top-[24px] -translate-y-1/2 left-[7.14%] right-[7.14%] h-[3px] bg-border/80 rounded-full z-0">
            {/* Layer 2: Completed Solid Green Track Line (NO BLUE CONNECTORS) */}
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="h-full bg-success rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"
            />
          </div>

          {/* Layer 3: 7 Stage Equal Columns Grid (z-10 above track line) */}
          <div className="relative z-10 grid grid-cols-7 w-full">
            {stages.map((stage, idx) => {
              const isCompletedStage = idx < activeStageIndex || isCompleted;
              const isCurrentStage = idx === activeStageIndex && !isCompleted;
              const isPendingStage = idx > activeStageIndex && !isCompleted;
              const Icon = stage.icon;

              return (
                <div key={stage.id} className="flex flex-col items-center text-center px-1">
                  {/* Node Circle Container (48px x 48px, solid bg-card opacity 100 to cover background track line cleanly) */}
                  <div className="relative flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.08 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 select-none cursor-pointer bg-card
                        ${isCompletedStage
                          ? 'border-success text-success bg-gradient-to-b from-card via-card to-success/10 shadow-[0_0_15px_rgba(34,197,94,0.35)]'
                          : isCurrentStage
                          ? 'border-primary-glow text-primary-glow bg-gradient-to-b from-card via-card to-primary/20 ring-4 ring-primary/30 shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-pulse'
                          : 'border-border/80 text-text-muted bg-card opacity-75'
                        }
                      `}
                    >
                      {isCompletedStage ? (
                        <CheckCircle2 className="w-6 h-6 text-success" />
                      ) : isCurrentStage ? (
                        <Icon className="w-6 h-6 text-primary-glow" />
                      ) : (
                        <Icon className="w-5 h-5 text-text-muted" />
                      )}
                    </motion.div>
                  </div>

                  {/* Stage Label Typography (Fixed height container for uniform baseline alignment across 7 columns) */}
                  <div className="h-10 mt-3.5 flex items-start justify-center">
                    <span className={`
                      text-[12px] md:text-[13px] font-semibold leading-tight max-w-[105px] transition-colors duration-200
                      ${isCompletedStage
                        ? 'text-success'
                        : isCurrentStage
                        ? 'text-primary-glow font-bold'
                        : 'text-text-muted'
                      }
                    `}>
                      {stage.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </Card>
  );
};

// Export alias for AgreementLifecycleTimeline component compatibility
export const AgreementLifecycleTimeline = AgreementTimeline;
