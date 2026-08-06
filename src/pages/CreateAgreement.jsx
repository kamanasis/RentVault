import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/cards/Card';
import { InputField } from '../components/forms/InputField';
import { SelectField } from '../components/forms/SelectField';
import { PrimaryButton } from '../components/buttons/PrimaryButton';
import { SecondaryButton } from '../components/buttons/SecondaryButton';
import { Building, Wallet, Calendar, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CreateAgreement = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    propertyName: '',
    propertyAddress: '',
    tenantWallet: '',
    depositAmount: '',
    utilityReserve: '200',
    leaseStart: '',
    leaseEnd: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Phase 1 Placeholder: Agreement generated successfully. Redirecting to agreement view...');
    navigate('/agreement/AGR-DEMO-101');
  };

  return (
    <PageContainer className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-h1 text-text-primary mb-2">Create Digital Rental Agreement</h1>
        <p className="text-body text-text-secondary">
          Establish agreement terms and generate an escrow contract on the Stellar Testnet.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField 
              label="Property Name"
              name="propertyName"
              placeholder="e.g. Skyline Heights #301"
              icon={Building}
              value={formData.propertyName}
              onChange={handleChange}
              required
            />
            
            <InputField 
              label="Property Address"
              name="propertyAddress"
              placeholder="Full Street Address"
              value={formData.propertyAddress}
              onChange={handleChange}
              required
            />
          </div>

          <InputField 
            label="Tenant Stellar Wallet Address"
            name="tenantWallet"
            placeholder="G..."
            icon={Wallet}
            value={formData.tenantWallet}
            onChange={handleChange}
            helperText="Enter tenant's Stellar public key"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField 
              label="Security Deposit (XLM)"
              name="depositAmount"
              type="number"
              placeholder="e.g. 1500"
              value={formData.depositAmount}
              onChange={handleChange}
              required
            />

            <InputField 
              label="Utility Reserve (XLM)"
              name="utilityReserve"
              type="number"
              placeholder="e.g. 200"
              value={formData.utilityReserve}
              onChange={handleChange}
              helperText="Reserved for electricity/water settlement"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField 
              label="Lease Start Date"
              name="leaseStart"
              type="date"
              icon={Calendar}
              value={formData.leaseStart}
              onChange={handleChange}
              required
            />

            <InputField 
              label="Lease End Date"
              name="leaseEnd"
              type="date"
              icon={Calendar}
              value={formData.leaseEnd}
              onChange={handleChange}
              required
            />
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-end gap-4">
            <SecondaryButton onClick={() => navigate('/dashboard')}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" icon={ShieldCheck}>
              Generate Agreement ID
            </PrimaryButton>
          </div>
        </form>
      </Card>
    </PageContainer>
  );
};
