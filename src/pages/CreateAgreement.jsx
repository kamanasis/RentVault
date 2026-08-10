import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/cards/Card';
import { InputField } from '../components/forms/InputField';
import { PrimaryButton } from '../components/buttons/PrimaryButton';
import { SecondaryButton } from '../components/buttons/SecondaryButton';
import { useAgreements } from '../context/AgreementContext';
import { useWallet } from '../context/WalletContext';
import { AUTO_RELEASE_PRESETS } from '../utils/autoRelease';
import { Building, Wallet, Calendar, ShieldCheck, ArrowLeft, Coins, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as StellarSdk from '@stellar/stellar-sdk';

export const CreateAgreement = () => {
  const navigate = useNavigate();
  const { createAgreement } = useAgreements();
  const { address } = useWallet();

  const [formData, setFormData] = useState({
    propertyName: '',
    propertyAddress: '',
    tenantWallet: '',
    depositAmount: '1500',
    utilityReserve: '200',
    leaseStart: new Date().toISOString().split('T')[0],
    leaseEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    autoReleasePreset: '7_days',
    customAutoReleaseDuration: '12',
    customAutoReleaseUnit: 'hours',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.propertyName || formData.propertyName.trim() === '') {
      newErrors.propertyName = 'Property Name is required.';
    }

    if (!formData.propertyAddress || formData.propertyAddress.trim() === '') {
      newErrors.propertyAddress = 'Property Address is required.';
    }

    if (!formData.tenantWallet || formData.tenantWallet.trim() === '') {
      newErrors.tenantWallet = 'Tenant Stellar wallet address is required.';
    } else if (!StellarSdk.StrKey.isValidEd25519PublicKey(formData.tenantWallet.trim())) {
      newErrors.tenantWallet = 'Invalid Stellar public key format (must start with G and be 56 characters long).';
    }

    const numDeposit = parseFloat(formData.depositAmount);
    if (!formData.depositAmount || isNaN(numDeposit) || numDeposit <= 0) {
      newErrors.depositAmount = 'Security deposit must be greater than 0 XLM.';
    }

    const numReserve = parseFloat(formData.utilityReserve);
    if (formData.utilityReserve !== '' && (isNaN(numReserve) || numReserve < 0)) {
      newErrors.utilityReserve = 'Utility reserve must be greater than or equal to 0 XLM.';
    }

    if (!formData.leaseStart) {
      newErrors.leaseStart = 'Lease start date is required.';
    }

    if (!formData.leaseEnd) {
      newErrors.leaseEnd = 'Lease end date is required.';
    } else if (formData.leaseStart && new Date(formData.leaseEnd) <= new Date(formData.leaseStart)) {
      newErrors.leaseEnd = 'Lease end date must be after lease start date.';
    }

    if (formData.autoReleasePreset === 'custom') {
      const numCustom = parseFloat(formData.customAutoReleaseDuration);
      if (!formData.customAutoReleaseDuration || isNaN(numCustom) || numCustom <= 0) {
        newErrors.customAutoReleaseDuration = 'Custom duration must be greater than 0.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newAgreement = createAgreement(formData);
    navigate(`/agreements/${newAgreement.id}`);
  };

  return (
    <PageContainer className="max-w-4xl">
      <div className="mb-8">
        <button
          onClick={() => navigate('/agreements')}
          className="inline-flex items-center gap-1.5 text-caption font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Agreements
        </button>
        <h1 className="text-h1 text-text-primary mb-1">Create Digital Rental Agreement</h1>
        <p className="text-body text-text-secondary">
          Establish property details, security deposit terms, auto-release policy, and tenant wallet assignments before escrow locking.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Property Information */}
          <div className="space-y-4">
            <h3 className="text-h3 text-text-primary flex items-center gap-2 pb-2 border-b border-border">
              <Building className="w-5 h-5 text-primary-glow" /> 1. Property Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Property Name"
                name="propertyName"
                placeholder="e.g. Skyline Heights #301"
                icon={Building}
                value={formData.propertyName}
                onChange={handleChange}
                error={errors.propertyName}
                required
              />

              <InputField
                label="Property Full Address"
                name="propertyAddress"
                placeholder="e.g. 742 Evergreen Terrace, Sector 4"
                value={formData.propertyAddress}
                onChange={handleChange}
                error={errors.propertyAddress}
                required
              />
            </div>
          </div>

          {/* Section 2: Tenant Information */}
          <div className="space-y-4">
            <h3 className="text-h3 text-text-primary flex items-center gap-2 pb-2 border-b border-border">
              <Wallet className="w-5 h-5 text-primary-glow" /> 2. Tenant Information
            </h3>
            <InputField
              label="Tenant Stellar Wallet Address"
              name="tenantWallet"
              placeholder="e.g. GDKX89A190B38812TESTNETTENANTKEY99881..."
              icon={Wallet}
              value={formData.tenantWallet}
              onChange={handleChange}
              error={errors.tenantWallet}
              helperText="Enter tenant's 56-character Stellar public key starting with 'G'"
              required
            />
          </div>

          {/* Section 3: Financial Terms */}
          <div className="space-y-4">
            <h3 className="text-h3 text-text-primary flex items-center gap-2 pb-2 border-b border-border">
              <Coins className="w-5 h-5 text-primary-glow" /> 3. Financial Terms (Escrow XLM)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Security Deposit Amount (XLM)"
                name="depositAmount"
                type="number"
                step="1"
                placeholder="e.g. 1500"
                icon={Coins}
                value={formData.depositAmount}
                onChange={handleChange}
                error={errors.depositAmount}
                helperText="Primary deposit locked in Soroban smart contract"
                required
              />

              <InputField
                label="Utility Reserve Amount (XLM)"
                name="utilityReserve"
                type="number"
                step="1"
                placeholder="e.g. 200"
                icon={Coins}
                value={formData.utilityReserve}
                onChange={handleChange}
                error={errors.utilityReserve}
                helperText="Reserved for final electricity, water, or repair settlement"
                required
              />
            </div>
          </div>

          {/* Section 4: Lease Period */}
          <div className="space-y-4">
            <h3 className="text-h3 text-text-primary flex items-center gap-2 pb-2 border-b border-border">
              <Calendar className="w-5 h-5 text-primary-glow" /> 4. Lease Period
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Lease Start Date"
                name="leaseStart"
                type="date"
                icon={Calendar}
                value={formData.leaseStart}
                onChange={handleChange}
                error={errors.leaseStart}
                required
              />

              <InputField
                label="Lease End Date"
                name="leaseEnd"
                type="date"
                icon={Calendar}
                value={formData.leaseEnd}
                onChange={handleChange}
                error={errors.leaseEnd}
                required
              />
            </div>
          </div>

          {/* Section 5: Landlord Controlled Auto-Release Policy */}
          <div className="space-y-4">
            <h3 className="text-h3 text-text-primary flex items-center gap-2 pb-2 border-b border-border">
              <Clock className="w-5 h-5 text-primary-glow" /> 5. Auto-Release Policy (Landlord Controlled)
            </h3>
            <p className="text-caption text-text-secondary">
              Configure when deposit funds are automatically released to the tenant if no manual settlement occurs after lease completion.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-caption text-text-secondary font-medium block">
                  Select Auto-Release Duration
                </label>
                <select
                  name="autoReleasePreset"
                  value={formData.autoReleasePreset}
                  onChange={handleChange}
                  className="w-full bg-surface border border-border text-text-primary rounded-2xl px-4 py-3 text-caption outline-none cursor-pointer hover:border-primary/50 transition-colors"
                >
                  {AUTO_RELEASE_PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              {formData.autoReleasePreset === 'custom' && (
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    label="Duration Number"
                    name="customAutoReleaseDuration"
                    type="number"
                    min="1"
                    value={formData.customAutoReleaseDuration}
                    onChange={handleChange}
                    error={errors.customAutoReleaseDuration}
                    required
                  />

                  <div className="space-y-2">
                    <label className="text-caption text-text-secondary font-medium block">
                      Duration Unit
                    </label>
                    <select
                      name="customAutoReleaseUnit"
                      value={formData.customAutoReleaseUnit}
                      onChange={handleChange}
                      className="w-full bg-surface border border-border text-text-primary rounded-2xl px-4 py-3 text-caption outline-none cursor-pointer hover:border-primary/50 transition-colors"
                    >
                      <option value="minutes">Minutes</option>
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                      <option value="weeks">Weeks</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 6: Additional Notes */}
          <div className="space-y-2">
            <label className="text-caption text-text-secondary font-medium block">
              6. Additional Lease Terms / Notes (Optional)
            </label>
            <textarea
              name="notes"
              rows={3}
              placeholder="e.g. Special clauses, pet policies, or inspection requirements..."
              value={formData.notes}
              onChange={handleChange}
              className="w-full bg-surface border border-border text-text-primary rounded-2xl p-4 text-body placeholder:text-text-muted transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-end gap-4">
            <SecondaryButton onClick={() => navigate('/agreements')} className="w-full sm:w-auto">
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" icon={ShieldCheck} className="w-full sm:w-auto min-w-[180px]">
              Generate Agreement ID
            </PrimaryButton>
          </div>
        </form>
      </Card>
    </PageContainer>
  );
};
