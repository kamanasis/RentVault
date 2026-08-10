import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../cards/Card';
import { PrimaryButton } from '../buttons/PrimaryButton';
import { SecondaryButton } from '../buttons/SecondaryButton';
import { useAgreements } from '../../context/AgreementContext';
import { useWallet } from '../../context/WalletContext';
import { 
  CheckCircle2, 
  X, 
  Play, 
  ArrowRight, 
  Plus, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DemoGuideModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { agreements } = useAgreements();
  const { connected, address } = useWallet();

  if (!isOpen) return null;

  const normalizedAddress = (address || '').toLowerCase().trim();

  // Participating agreements for connected wallet
  const userAgreements = connected
    ? agreements.filter((a) => {
        const landlord = (a.landlordWallet || '').toLowerCase().trim();
        const tenant = (a.tenantWallet || '').toLowerCase().trim();
        return landlord === normalizedAddress || tenant === normalizedAddress;
      })
    : agreements;

  // Active agreement priority selection:
  // 1. Lease Active
  // 2. Deposit Locked
  // 3. Utility Settlement / Lease Ended
  // 4. Awaiting Deposit
  // 5. Most recently created
  const activeAgreement = userAgreements.find((a) => a.status === 'Lease Active')
    || userAgreements.find((a) => a.status === 'Deposit Locked')
    || userAgreements.find((a) => a.status === 'Utility Settlement' || a.status === 'Lease Ended')
    || userAgreements.find((a) => a.status === 'Awaiting Deposit')
    || (userAgreements.length > 0 ? userAgreements[0] : null);

  const status = activeAgreement?.status || 'Draft';
  const hasAgreements = userAgreements.length > 0;

  const demoSteps = [
    { 
      id: '1', 
      title: '1. Connect Wallet', 
      desc: 'Authenticate Landlord or Tenant Freighter account', 
      done: connected 
    },
    { 
      id: '2', 
      title: '2. Create Agreement', 
      desc: 'Specify security deposit (XLM), reserve, and dates', 
      done: hasAgreements 
    },
    { 
      id: '3', 
      title: '3. Share Agreement', 
      desc: 'Copy agreement link for tenant wallet assignment', 
      done: hasAgreements 
    },
    { 
      id: '4', 
      title: '4. Tenant Escrow Deposit', 
      desc: 'Tenant locks XLM into Soroban contract vault', 
      done: hasAgreements && status !== 'Awaiting Deposit' 
    },
    { 
      id: '5', 
      title: '5. Escrow Locked', 
      desc: 'Smart contract verifies 100% funding', 
      done: hasAgreements && (status === 'Deposit Locked' || status === 'Lease Active' || status === 'Lease Ended' || status === 'Utility Settlement' || status === 'Refund Completed') 
    },
    { 
      id: '6', 
      title: '6. Lease Active', 
      desc: 'Rental occupancy period in progress', 
      done: hasAgreements && (status === 'Lease Active' || status === 'Lease Ended' || status === 'Utility Settlement' || status === 'Refund Completed') 
    },
    { 
      id: '7', 
      title: '7. Utility Settlement', 
      desc: 'Landlord enters electricity/water bill deductions', 
      done: hasAgreements && (status === 'Lease Ended' || status === 'Utility Settlement' || status === 'Refund Completed') 
    },
    { 
      id: '8', 
      title: '8. Auto-Release Countdown', 
      desc: '60s automated refund timer or tenant review', 
      done: hasAgreements && (status === 'Utility Settlement' || status === 'Refund Completed') 
    },
    { 
      id: '9', 
      title: '9. Refund Completed', 
      desc: 'Instant XLM refund paid back to tenant on Stellar', 
      done: hasAgreements && status === 'Refund Completed' 
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="max-w-xl w-full"
      >
        <Card className="p-6 md:p-8 space-y-6 bg-gradient-to-b from-card via-card to-surface border border-primary/40 shadow-stellar-glow relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/50 text-primary-glow flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-h2 text-text-primary">Stellar (Stella) Presentation Guide</h2>
              <p className="text-caption text-text-secondary">3-Minute End-to-End Soroban Escrow Showcase</p>
            </div>
          </div>

          {/* Empty State Banner if user has no agreements */}
          {connected && !hasAgreements && (
            <div className="p-4 bg-primary/10 border border-primary/30 rounded-2xl flex items-center gap-3 text-caption text-text-primary">
              <AlertCircle className="w-5 h-5 text-primary-glow flex-shrink-0" />
              <span>Create your first agreement to begin the Stella demonstration.</span>
            </div>
          )}

          {/* Vertical Step Tracker */}
          <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1 scrollbar-thin">
            {demoSteps.map((step) => (
              <div
                key={step.id}
                className={`p-3 rounded-2xl border flex items-center justify-between gap-3 text-caption transition-all ${
                  step.done
                    ? 'bg-success/10 border-success/30 text-text-primary'
                    : 'bg-background/60 border-border/60 text-text-secondary'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center border font-mono text-xs ${
                    step.done
                      ? 'bg-success/20 border-success text-success'
                      : 'bg-surface border-border text-text-muted'
                  }`}>
                    {step.done ? <CheckCircle2 className="w-4 h-4" /> : step.id}
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary">{step.title}</h4>
                    <p className="text-xs text-text-secondary">{step.desc}</p>
                  </div>
                </div>

                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  step.done ? 'bg-success/20 text-success' : 'bg-surface text-text-muted'
                }`}>
                  {step.done ? 'COMPLETED' : 'PENDING'}
                </span>
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <SecondaryButton onClick={onClose} className="w-full sm:w-auto">
              Close Guide
            </SecondaryButton>

            {activeAgreement ? (
              <PrimaryButton
                icon={ArrowRight}
                onClick={() => {
                  onClose();
                  navigate(`/agreements/${activeAgreement.id}`);
                }}
                className="w-full sm:w-auto"
              >
                Go to Active Agreement ({activeAgreement.id})
              </PrimaryButton>
            ) : (
              <PrimaryButton
                icon={Plus}
                onClick={() => {
                  onClose();
                  navigate('/agreements/new');
                }}
                className="w-full sm:w-auto"
              >
                Create Agreement
              </PrimaryButton>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
