import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit3, Building, Coins, Calendar, Lock, Check } from 'lucide-react';
import { InputField } from '../forms/InputField';
import { PrimaryButton } from '../buttons/PrimaryButton';
import { SecondaryButton } from '../buttons/SecondaryButton';
import { useAgreements } from '../../context/AgreementContext';

export const EditAgreementModal = ({ agreement, isOpen, onClose }) => {
  const { updateAgreement } = useAgreements();

  const isDepositLocked = agreement?.status === 'Deposit Locked';

  const [formData, setFormData] = useState({
    propertyName: agreement?.propertyName || '',
    propertyAddress: agreement?.propertyAddress || '',
    depositAmount: agreement?.depositAmount || 0,
    utilityReserve: agreement?.utilityReserve || 0,
    leaseStart: agreement?.leaseStart || '',
    leaseEnd: agreement?.leaseEnd || '',
    notes: agreement?.notes || '',
  });

  const [errors, setErrors] = useState({});

  if (!isOpen || !agreement) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.propertyName.trim()) newErrors.propertyName = 'Property Name is required.';
    if (!formData.propertyAddress.trim()) newErrors.propertyAddress = 'Property Address is required.';

    if (!isDepositLocked) {
      const dep = parseFloat(formData.depositAmount);
      if (isNaN(dep) || dep <= 0) newErrors.depositAmount = 'Deposit must be greater than 0 XLM.';
    }

    if (!formData.leaseStart) newErrors.leaseStart = 'Start date is required.';
    if (!formData.leaseEnd) newErrors.leaseEnd = 'End date is required.';
    if (formData.leaseStart && formData.leaseEnd && new Date(formData.leaseEnd) <= new Date(formData.leaseStart)) {
      newErrors.leaseEnd = 'Lease end date must be after lease start date.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validate()) return;

    updateAgreement(agreement.id, formData);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-card border border-primary/40 rounded-3xl p-6 sm:p-8 shadow-stellar-glow space-y-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/30 text-primary-glow flex items-center justify-center">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-h3 text-text-primary">Edit Agreement Terms</h3>
                <p className="text-caption text-text-secondary">Agreement ID: {agreement.id}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-text-muted hover:text-text-primary rounded-xl bg-surface border border-border transition-colors cursor-pointer"
              aria-label="Close edit terms modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {isDepositLocked && (
            <div className="p-3 bg-warning/10 border border-warning/30 rounded-2xl text-xs text-warning flex items-center gap-2 font-mono">
              <Lock className="w-4 h-4 flex-shrink-0" />
              <span>Financial terms (Security Deposit & Utility Reserve) are locked post-escrow deposit.</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Property Name"
                name="propertyName"
                value={formData.propertyName}
                onChange={handleChange}
                error={errors.propertyName}
                required
              />

              <InputField
                label="Property Address"
                name="propertyAddress"
                value={formData.propertyAddress}
                onChange={handleChange}
                error={errors.propertyAddress}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Security Deposit (XLM)"
                name="depositAmount"
                type="number"
                value={formData.depositAmount}
                onChange={handleChange}
                error={errors.depositAmount}
                disabled={isDepositLocked}
                helperText={isDepositLocked ? 'Locked post-deposit' : 'Primary deposit'}
                required
              />

              <InputField
                label="Utility Reserve (XLM)"
                name="utilityReserve"
                type="number"
                value={formData.utilityReserve}
                onChange={handleChange}
                error={errors.utilityReserve}
                disabled={isDepositLocked}
                helperText={isDepositLocked ? 'Locked post-deposit' : 'Reserved for utilities'}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Lease Start Date"
                name="leaseStart"
                type="date"
                value={formData.leaseStart}
                onChange={handleChange}
                error={errors.leaseStart}
                required
              />

              <InputField
                label="Lease End Date"
                name="leaseEnd"
                type="date"
                value={formData.leaseEnd}
                onChange={handleChange}
                error={errors.leaseEnd}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-caption text-text-secondary font-medium block">
                Additional Notes
              </label>
              <textarea
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                className="w-full bg-surface border border-border text-text-primary rounded-2xl p-3 text-body outline-none focus:border-primary"
              />
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
              <SecondaryButton onClick={onClose} type="button">
                Cancel
              </SecondaryButton>
              <PrimaryButton type="submit" icon={Check}>
                Save Changes
              </PrimaryButton>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
