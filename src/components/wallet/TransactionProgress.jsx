import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../cards/Card';
import { PrimaryButton } from '../buttons/PrimaryButton';
import { SecondaryButton } from '../buttons/SecondaryButton';
import { 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Key, 
  Send, 
  ShieldCheck, 
  RotateCcw,
  X
} from 'lucide-react';
import { getSorobanContractId } from '../../services/soroban';

export const TransactionProgress = ({
  stage = 'idle', // 'preparing' | 'signing' | 'submitting' | 'confirming' | 'success' | 'failed'
  errorMessage = '',
  txResult = null,
  onRetry,
  onClose,
  className = '',
}) => {
  if (stage === 'idle') return null;

  const contractId = getSorobanContractId();

  const steps = [
    { key: 'preparing', title: 'Preparing Transaction', desc: 'Building XDR payload from Horizon RPC', icon: Send },
    { key: 'signing', title: 'Awaiting Freighter Signature', desc: 'Please sign the contract prompt in Freighter', icon: Key },
    { key: 'submitting', title: 'Submitting to Stellar', desc: 'Transmitting signed XDR to Testnet validators', icon: Send },
    { key: 'confirming', title: 'Confirming On-Chain', desc: 'Awaiting Soroban consensus ledger finality', icon: ShieldCheck },
    { key: 'success', title: 'Escrow Locked Successfully', desc: 'Security deposit safely locked in Soroban vault', icon: CheckCircle2 },
  ];

  const getStageIndex = () => {
    switch (stage) {
      case 'preparing': return 0;
      case 'signing': return 1;
      case 'submitting': return 2;
      case 'confirming': return 3;
      case 'success': return 4;
      case 'failed': return -1;
      default: return 0;
    }
  };

  const currentStepIdx = getStageIndex();
  const explorerUrl = txResult?.hash ? `https://testnet.steexp.com/tx/${txResult.hash}` : `https://testnet.steexp.com/contract/${contractId}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="max-w-md w-full"
      >
        <Card className={`p-6 md:p-8 space-y-6 bg-gradient-to-b from-card via-card to-surface border shadow-stellar-glow relative ${
          stage === 'failed' ? 'border-error/50' : stage === 'success' ? 'border-success/50' : 'border-primary/40'
        } ${className}`}>
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Header Spinner / Status Icon */}
          <div className="text-center space-y-3">
            <div className={`w-16 h-16 rounded-3xl border flex items-center justify-center mx-auto ${
              stage === 'failed' 
                ? 'bg-error/15 border-error/40 text-error' 
                : stage === 'success' 
                ? 'bg-success/15 border-success/40 text-success' 
                : 'bg-primary/15 border-primary/40 text-primary-glow animate-pulse'
            }`}>
              {stage === 'failed' ? (
                <AlertCircle className="w-8 h-8" />
              ) : stage === 'success' ? (
                <CheckCircle2 className="w-8 h-8 text-success" />
              ) : (
                <Loader2 className="w-8 h-8 animate-spin text-primary-glow" />
              )}
            </div>

            <div>
              <h3 className="text-h3 text-text-primary">
                {stage === 'failed' 
                  ? 'Transaction Failed' 
                  : stage === 'success' 
                  ? 'Escrow Locked Successfully' 
                  : 'Executing Soroban Transaction'}
              </h3>
              <p className="text-caption text-text-secondary mt-0.5">
                {stage === 'failed' 
                  ? 'The transaction could not be completed on Stellar Testnet.' 
                  : stage === 'success' 
                  ? 'Funds are locked in the Soroban smart contract vault.' 
                  : 'Please do not close your browser while transaction executes.'}
              </p>
            </div>
          </div>

          {/* Step Progress Tracker */}
          {stage !== 'failed' && (
            <div className="space-y-3 pt-1">
              {steps.map((s, idx) => {
                const isCompletedStep = currentStepIdx > idx || stage === 'success';
                const isCurrentStep = currentStepIdx === idx && stage !== 'success';
                const Icon = s.icon;

                return (
                  <div 
                    key={s.key} 
                    className={`p-3 rounded-2xl border flex items-center gap-3 transition-all text-xs ${
                      isCompletedStep 
                        ? 'bg-success/10 border-success/30 text-text-primary' 
                        : isCurrentStep 
                        ? 'bg-primary/10 border-primary/40 text-text-primary shadow-sm' 
                        : 'bg-surface/50 border-border/40 text-text-muted opacity-60'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center border flex-shrink-0 ${
                      isCompletedStep 
                        ? 'bg-success/20 border-success text-success' 
                        : isCurrentStep 
                        ? 'bg-primary/20 border-primary text-primary-glow' 
                        : 'bg-surface border-border/60 text-text-muted'
                    }`}>
                      {isCompletedStep ? (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      ) : isCurrentStep ? (
                        <Loader2 className="w-4 h-4 animate-spin text-primary-glow" />
                      ) : (
                        <Icon className="w-3.5 h-3.5" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-text-primary truncate">{s.title}</h4>
                      <p className="text-[11px] text-text-secondary truncate mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Error Diagnostics UI */}
          {stage === 'failed' && (
            <div className="p-4 bg-error/10 border border-error/30 rounded-2xl space-y-2 text-xs">
              <span className="font-semibold text-error block">Error Diagnostic Details:</span>
              <p className="text-text-secondary leading-relaxed font-mono text-[11px]">
                {errorMessage || 'Transaction execution or signature was cancelled.'}
              </p>
            </div>
          )}

          {/* Footer Actions & Explorer Link */}
          <div className="pt-2 border-t border-border/60 flex flex-col items-center gap-3">
            {stage === 'failed' && (
              <div className="flex items-center gap-3 w-full">
                {onClose && (
                  <SecondaryButton onClick={onClose} className="flex-1">
                    Close
                  </SecondaryButton>
                )}
                {onRetry && (
                  <PrimaryButton icon={RotateCcw} onClick={onRetry} className="flex-1">
                    Retry Transaction
                  </PrimaryButton>
                )}
              </div>
            )}

            {stage === 'success' && (
              <div className="w-full space-y-3">
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-surface hover:bg-surface-hover border border-border text-caption font-semibold text-text-primary transition-colors"
                >
                  <span>View Transaction on Stellar Expert</span>
                  <ExternalLink className="w-4 h-4 text-primary-glow" />
                </a>

                {onClose && (
                  <PrimaryButton onClick={onClose} className="w-full">
                    Done
                  </PrimaryButton>
                )}
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
