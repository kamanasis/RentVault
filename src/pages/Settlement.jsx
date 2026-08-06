import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/cards/Card';
import { InputField } from '../components/forms/InputField';
import { StatusBadge } from '../components/status/StatusBadge';
import { PrimaryButton } from '../components/buttons/PrimaryButton';
import { SecondaryButton } from '../components/buttons/SecondaryButton';
import { Calculator, Zap, Droplet, Wrench, ShieldCheck } from 'lucide-react';

export const Settlement = () => {
  const { id = 'AGR-2026-9041' } = useParams();
  const navigate = useNavigate();

  const [bills, setBills] = useState({
    electricity: '45',
    water: '25',
    repairs: '0',
  });

  const totalDeposit = 2500;
  const totalDeductions = (parseFloat(bills.electricity) || 0) + (parseFloat(bills.water) || 0) + (parseFloat(bills.repairs) || 0);
  const finalRefund = totalDeposit - totalDeductions;

  return (
    <PageContainer className="max-w-4xl">
      <div className="mb-8">
        <StatusBadge variant="warning" className="mb-3">Phase 3: Utility Settlement</StatusBadge>
        <h1 className="text-h1 text-text-primary mb-2">Utility Deductions & Settlement</h1>
        <p className="text-body text-text-secondary">
          Calculate final utility bill deductions from the deposit reserve and authorize tenant refund release.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 space-y-6">
          <h3 className="text-h3 text-text-primary border-b border-border pb-3">Itemized Utility Deductions</h3>

          <div className="space-y-4">
            <InputField 
              label="Electricity Bill (XLM)"
              name="electricity"
              type="number"
              icon={Zap}
              value={bills.electricity}
              onChange={(e) => setBills({ ...bills, electricity: e.target.value })}
            />

            <InputField 
              label="Water & Sanitation Bill (XLM)"
              name="water"
              type="number"
              icon={Droplet}
              value={bills.water}
              onChange={(e) => setBills({ ...bills, water: e.target.value })}
            />

            <InputField 
              label="Maintenance & Repairs (XLM)"
              name="repairs"
              type="number"
              icon={Wrench}
              value={bills.repairs}
              onChange={(e) => setBills({ ...bills, repairs: e.target.value })}
            />
          </div>
        </Card>

        <Card className="space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-h3 text-text-primary border-b border-border pb-3">Refund Summary</h3>

            <div className="space-y-3 mt-4 text-caption">
              <div className="flex justify-between">
                <span className="text-text-muted">Total Deposit Locked:</span>
                <span className="font-semibold text-text-primary">{totalDeposit} XLM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Total Bill Deductions:</span>
                <span className="font-semibold text-error">-{totalDeductions} XLM</span>
              </div>

              <div className="pt-4 border-t border-border">
                <span className="text-caption text-text-muted block">Final Tenant Refund</span>
                <span className="text-h2 font-bold text-success">{finalRefund} XLM</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-border">
            <PrimaryButton 
              fullWidth 
              icon={ShieldCheck}
              onClick={() => {
                alert('Phase 1 Placeholder: Settlement approved. Redirecting to completion screen...');
                navigate(`/agreement/${id}/completed`);
              }}
            >
              Approve Settlement
            </PrimaryButton>
            <SecondaryButton fullWidth onClick={() => navigate(`/agreement/${id}`)}>
              Back to Agreement
            </SecondaryButton>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};
