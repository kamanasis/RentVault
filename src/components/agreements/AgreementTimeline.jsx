import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, ShieldCheck, Lock, FileCheck, ArrowRightLeft, ShieldAlert } from 'lucide-react';
import { Card } from '../cards/Card';

export const AgreementTimeline = ({ currentStatus = 'Awaiting Deposit' }) => {
  const stages = [
    { id: 'created', label: 'Agreement Created', icon: FileCheck },
    { id: 'awaiting', label: 'Awaiting Deposit', icon: Clock },
    { id: 'locked', label: 'Deposit Locked', icon: Lock },
    { id: 'active', label: 'Lease Active', icon: ShieldCheck },
    { id: 'ended', label: 'Lease Ended', icon: Clock },
    { id: 'settlement', label: 'Utility Settlement', icon: ArrowRightLeft },
    { id: 'dispute', label: 'Dispute Resolution', icon: ShieldAlert },
    { id: 'completed', label: 'Refund Completed', icon: CheckCircle2 },
  ];

  const isCompleted = currentStatus === 'Refund Completed';
  const isDisputeActive = 
    currentStatus === 'dispute_open' || 
    currentStatus === 'dispute_landlord_response' || 
    currentStatus === 'dispute_tenant_response' || 
    currentStatus === 'dispute_resolved';

  // Determine active stage index (0 to 7)
  const activeStageIndex = isCompleted
    ? 7
    : isDisputeActive
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

  // Progress line percentage (0% to 100%)
  const progressPercent = isCompleted ? 100 : (activeStageIndex / 7) * 100;

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
            : isDisputeActive
            ? 'text-error bg-error/15 border-error/30'
            : 'text-primary-glow bg-primary/10 border-primary/20'
        }`}>
          Stage {activeStageIndex + 1} of 8
        </span>
      </div>

      {/* Timeline Layout Container */}
      <div className="relative pt-2 pb-2 overflow-x-auto scrollbar-none">
        <div className="relative min-w-[840px] lg:min-w-0 py-2 space-y-3.5">
          
          {/* Row 1: Dedicated Node Circle & Connector Line Container (Fixed 48px height) */}
          <div className="relative h-12 flex items-center">
            
            {/* Layer 1: Background Gray Track Line */}
            <div className="absolute top-1/2 -translate-y-1/2 left-[6.25%] right-[6.25%] h-[3px] bg-border/80 rounded-full z-0">
              {/* Layer 2: Completed Solid Green Track Line */}
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className={`h-full rounded-full ${
                  isDisputeActive 
                    ? 'bg-gradient-to-r from-success via-warning to-error shadow-[0_0_8px_rgba(239,68,68,0.6)]' 
                    : 'bg-success shadow-[0_0_8px_rgba(34,197,94,0.6)]'
                }`}
              />
            </div>

            {/* Layer 3: 8 Stage Circle Nodes */}
            <div className="relative z-10 grid grid-cols-8 w-full">
              {stages.map((stage, idx) => {
                const isCompletedStage = idx < activeStageIndex || isCompleted;
                const isCurrentStage = idx === activeStageIndex && !isCompleted;
                const Icon = stage.icon;

                return (
                  <div key={stage.id} className="flex justify-center items-center">
                    {/* Circle Node */}
                    <motion.div
                      whileHover={{ scale: 1.08 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 select-none cursor-pointer bg-card
                        ${isCompletedStage
                          ? 'border-success text-success bg-gradient-to-b from-card via-card to-success/10 shadow-[0_0_15px_rgba(34,197,94,0.35)]'
                          : isCurrentStage
                          ? isDisputeActive
                            ? 'border-error text-error bg-gradient-to-b from-card via-card to-error/20 ring-4 ring-error/30 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse'
                            : 'border-primary-glow text-primary-glow bg-gradient-to-b from-card via-card to-primary/20 ring-4 ring-primary/30 shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-pulse'
                          : 'border-border/80 text-text-muted bg-card opacity-75'
                        }
                      `}
                    >
                      {isCompletedStage ? (
                        <CheckCircle2 className="w-6 h-6 text-success" />
                      ) : isCurrentStage ? (
                        <Icon className={`w-6 h-6 ${isDisputeActive ? 'text-error' : 'text-primary-glow'}`} />
                      ) : (
                        <Icon className="w-5 h-5 text-text-muted" />
                      )}
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Row 2: Stage Labels Grid */}
          <div className="grid grid-cols-8 w-full">
            {stages.map((stage, idx) => {
              const isCompletedStage = idx < activeStageIndex || isCompleted;
              const isCurrentStage = idx === activeStageIndex && !isCompleted;

              return (
                <div key={stage.id} className="flex justify-center text-center px-1">
                  <span className={`
                    text-[11px] md:text-[12px] font-semibold leading-tight max-w-[95px] transition-colors duration-200
                    ${isCompletedStage
                      ? 'text-success'
                      : isCurrentStage
                      ? isDisputeActive
                        ? 'text-error font-bold'
                        : 'text-primary-glow font-bold'
                      : 'text-text-muted'
                    }
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

export const AgreementLifecycleTimeline = AgreementTimeline;
