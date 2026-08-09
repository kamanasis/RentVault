import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Wallet, 
  FileText, 
  Share2, 
  Lock, 
  Zap, 
  ShieldCheck, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DemoGuideModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { agreements } = useAgreements();
  const { connected, address } = useWallet();

  if (!isOpen) return null;

  const normalizedAddress = (address || '').toLowerCase().trim();

  // Find demo agreement or first agreement
  const currentAgreement = agreements.find((a) => {
    const landlord = (a.landlordWallet || '').toLowerCase().trim();
    const tenant = (a.tenantWallet || '').toLowerCase().trim();
    return landlord === normalizedAddress || tenant === normalizedAddress;
  }) || agreements[0];

  const status = currentAgreement?.status || 'Draft';

  const demoSteps = [
    { id: '1', title: '1. Connect Wallet', desc: 'Authenticate Landlord or Tenant Freighter account', done: connected },
    { id: '2', title: '2. Create Agreement', desc: 'Specify security deposit (XLM), reserve, and dates', done: !!currentAgreement },
    { id: '3', title: '3. Share Agreement', desc: 'Copy agreement link for tenant wallet assignment', done: !!currentAgreement },
    { id: '4', title: '4. Tenant Escrow Deposit', desc: 'Tenant locks XLM into Soroban contract vault', done: status !== 'Awaiting Deposit' && status !== 'Draft' },
    { id: '5', title: '5. Escrow Locked', desc: 'Smart contract verifies 100% funding', done: status === 'Deposit Locked' || status === 'Lease Active' || status === 'Lease Ended' || status === 'Utility Settlement' || status === 'Refund Completed' },
    { id: '6', title: '6. Lease Active', desc: 'Rental occupancy period in progress', done: status === 'Lease Active' || status === 'Lease Ended' || status === 'Utility Settlement' || status === 'Refund Completed' },
    { id: '7', title: '7. Utility Settlement', desc: 'Landlord enters electricity/water bill deductions', done: status === 'Utility Settlement' || status === 'Refund Completed' },
    { id: '8', title: '8. Auto-Release Countdown', desc: '60s automated refund timer or tenant review', done: status === 'Refund Completed' },
    { id: '9', title: '9. Refund Completed', desc: 'Instant XLM refund paid back to tenant on Stellar', done: status === 'Refund Completed' },
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

          {/* Vertical Step Tracker */}
          <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
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

          <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <SecondaryButton onClick={onClose} className="w-full sm:w-auto">
              Close Guide
            </SecondaryButton>

            {currentAgreement ? (
              <PrimaryButton
                icon={ArrowRight}
                onClick={() => {
                  onClose();
                  navigate(`/agreements/${currentAgreement.id}`);
                }}
                className="w-full sm:w-auto"
              >
                Go to Active Agreement
              </PrimaryButton>
            ) : (
              <PrimaryButton
                icon={Play}
                onClick={() => {
                  onClose();
                  navigate('/agreements/new');
                }}
                className="w-full sm:w-auto"
              >
                Start Demo Workflow
              </PrimaryButton>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
