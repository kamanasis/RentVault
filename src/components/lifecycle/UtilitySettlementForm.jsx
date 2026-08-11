import React, { useState } from 'react';
import { Card } from '../cards/Card';
import { InputField } from '../forms/InputField';
import { PrimaryButton } from '../buttons/PrimaryButton';
import { SecondaryButton } from '../buttons/SecondaryButton';
import { useAgreements } from '../../context/AgreementContext';
import { Zap, Droplets, Wrench, FileText, CheckCircle2, Coins, Wifi, AlertCircle } from 'lucide-react';

export const UtilitySettlementForm = ({ agreement }) => {
  const { submitUtilitySettlement } = useAgreements();

  const [electricity, setElectricity] = useState('1.25');
  const [water, setWater] = useState('0.50');
  const [internet, setInternet] = useState('0.00');
  const [maintenance, setMaintenance] = useState('0.00');
  const [other, setOther] = useState('0.00');
  const [notes, setNotes] = useState('Final utility settlement for August occupancy.');
  const [error, setError] = useState(null);

  if (!agreement) return null;

  const deposit = agreement.depositAmount || 0;
  const reserve = agreement.utilityReserve || 0;
  const totalEscrow = deposit + reserve;

  const numElec = Math.max(0, parseFloat(electricity) || 0);
  const numWater = Math.max(0, parseFloat(water) || 0);
  const numNet = Math.max(0, parseFloat(internet) || 0);
  const numMaint = Math.max(0, parseFloat(maintenance) || 0);
  const numOther = Math.max(0, parseFloat(other) || 0);

  const totalDeduction = numElec + numWater + numNet + numMaint + numOther;
  const finalRefund = Math.max(0, totalEscrow - totalDeduction);
  const isExceeded = totalDeduction > totalEscrow;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isExceeded) {
      setError(`Total deductions (${totalDeduction.toFixed(2)} XLM) cannot exceed available escrow balance (${totalEscrow} XLM).`);
      return;
    }
    setError(null);
    submitUtilitySettlement(agreement.id, {
      electricity: numElec,
      water: numWater,
      internet: numNet,
      maintenance: numMaint,
      other: numOther,
      notes,
    });
  };

  return (
    <Card className="space-y-6 border border-warning/40 shadow-stellar-glow">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-warning/15 border border-warning/30 text-warning flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-h3 text-text-primary">Utility Settlement Portal</h3>
            <p className="text-caption text-text-secondary">Landlord Deductions Submission</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-warning bg-warning/10 border border-warning/30 px-3 py-1 rounded-full">
          Landlord Only
        </span>
      </div>

      {error && (
        <div className="p-3 bg-error/15 border border-error/40 rounded-2xl text-xs text-error flex items-center gap-2 font-mono">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InputField
            label="Electricity Bill (XLM)"
            type="number"
            step="0.01"
            min="0"
            icon={Zap}
            value={electricity}
            onChange={(e) => {
              setElectricity(e.target.value);
              if (error) setError(null);
            }}
          />

          <InputField
            label="Water & Sewage (XLM)"
            type="number"
            step="0.01"
            min="0"
            icon={Droplets}
            value={water}
            onChange={(e) => {
              setWater(e.target.value);
              if (error) setError(null);
            }}
          />

          <InputField
            label="Internet / Fiber (XLM)"
            type="number"
            step="0.01"
            min="0"
            icon={Wifi}
            value={internet}
            onChange={(e) => {
              setInternet(e.target.value);
              if (error) setError(null);
            }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Maintenance / Cleaning (XLM)"
            type="number"
            step="0.01"
            min="0"
            icon={Wrench}
            value={maintenance}
            onChange={(e) => {
              setMaintenance(e.target.value);
              if (error) setError(null);
            }}
          />

          <InputField
            label="Other Deductions (XLM)"
            type="number"
            step="0.01"
            min="0"
            icon={Coins}
            value={other}
            onChange={(e) => {
              setOther(e.target.value);
              if (error) setError(null);
            }}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-caption text-text-secondary font-medium block">
            Settlement Breakdown Notes
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-surface border border-border text-text-primary rounded-2xl p-3 text-body outline-none focus:border-primary"
          />
        </div>

        {/* Live Calculation Box */}
        <div className="p-4 bg-background/80 rounded-2xl border border-border/80 space-y-2 font-mono text-caption">
          <div className="flex justify-between">
            <span className="text-text-muted font-sans">Total Escrow Locked:</span>
            <span className="text-text-primary font-bold">{totalEscrow} XLM</span>
          </div>
          <div className="flex justify-between text-warning">
            <span className="font-sans">Total Utility Deduction:</span>
            <span className="font-bold">-{totalDeduction.toFixed(2)} XLM</span>
          </div>
          <div className="pt-2 border-t border-border/60 flex justify-between text-h3 font-sans">
            <span className="text-text-primary font-bold">Final Tenant Refund:</span>
            <span className={`font-extrabold ${isExceeded ? 'text-error' : 'text-success'}`}>
              {finalRefund.toFixed(2)} XLM
            </span>
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-3">
          <PrimaryButton type="submit" icon={CheckCircle2} disabled={isExceeded}>
            Submit Settlement to Tenant
          </PrimaryButton>
        </div>
      </form>
    </Card>
  );
};
