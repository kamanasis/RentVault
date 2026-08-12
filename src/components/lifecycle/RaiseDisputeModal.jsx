import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../cards/Card';
import { PrimaryButton } from '../buttons/PrimaryButton';
import { SecondaryButton } from '../buttons/SecondaryButton';
import { AlertTriangle, X, Upload, FileText, CheckCircle2 } from 'lucide-react';

export const RaiseDisputeModal = ({ isOpen, onClose, onSubmit, agreement }) => {
  const [reason, setReason] = useState('Excessive Utility Deduction');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        reason,
        description: description.trim(),
      });
      onClose();
    } catch (err) {
      console.error('[RaiseDisputeModal] Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reasonOptions = [
    'Excessive Utility Deduction',
    'Unjustified Maintenance Charge',
    'Incorrect Meter Reading',
    'Unauthorized Property Expense',
    'Other Settlement Disagreement',
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-xl"
        >
          <Card className="p-6 sm:p-8 space-y-6 border-error/40 shadow-2xl bg-card">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-error/15 border border-error/40 flex items-center justify-center text-error">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-h3 text-text-primary">Raise Settlement Dispute</h3>
                  <p className="text-caption text-text-secondary">Agreement {agreement?.id}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-surface border border-border flex items-center justify-center text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Reason Dropdown */}
              <div className="space-y-1.5">
                <label className="text-caption font-semibold text-text-primary block">
                  Dispute Category / Reason
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-surface border border-border rounded-2xl px-4 py-3 text-caption text-text-primary outline-none focus:border-error transition-colors cursor-pointer"
                >
                  {reasonOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Detailed Description */}
              <div className="space-y-1.5">
                <label className="text-caption font-semibold text-text-primary block">
                  Detailed Explanation & Justification
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Explain why you are disputing the landlord's utility deduction proposal. Include expected values or billing errors..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-surface border border-border rounded-2xl p-4 text-caption text-text-primary placeholder:text-text-muted outline-none focus:border-error transition-colors resize-none"
                />
              </div>

              {/* Upload Optional Evidence Placeholder */}
              <div className="p-4 rounded-2xl border border-dashed border-border bg-background/60 text-center space-y-2">
                <Upload className="w-6 h-6 text-text-muted mx-auto" />
                <div className="text-xs text-text-secondary">
                  <span className="font-semibold text-primary-glow">Upload Evidence / Utility Bills</span> (Optional)
                </div>
                <p className="text-[10px] text-text-muted">PNG, JPG, PDF up to 10MB (Stored on Soroban IPFS Vault)</p>
              </div>

              {/* Warning Notice */}
              <div className="p-3.5 bg-error/10 border border-error/30 rounded-2xl text-xs text-error/90 leading-relaxed">
                <strong>Notice:</strong> Opening a dispute will immediately pause the 60s auto-release timer and lock the refund until both landlord and tenant resolve the dispute thread.
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <SecondaryButton type="button" onClick={onClose}>
                  Cancel
                </SecondaryButton>
                <PrimaryButton 
                  type="submit" 
                  icon={AlertTriangle}
                  className="bg-error hover:bg-error/90 text-white border-none"
                  disabled={isSubmitting || !description.trim()}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Dispute'}
                </PrimaryButton>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
