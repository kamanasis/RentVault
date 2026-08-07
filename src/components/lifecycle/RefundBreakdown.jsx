import React from 'react';
import { Card } from '../cards/Card';
import { Coins, Zap, ShieldCheck } from 'lucide-react';

export const RefundBreakdown = ({ agreement }) => {
  if (!agreement) return null;

  const deposit = agreement.depositAmount || 0;
  const reserve = agreement.utilityReserve || 0;
  const totalEscrow = deposit + reserve;
  const deductions = agreement.utilityDeductions || {};
  const totalDeduction = agreement.totalDeduction || 0;

  const finalRefund = agreement.finalRefundAmount !== undefined 
    ? agreement.finalRefundAmount 
    : Math.max(0, totalEscrow - totalDeduction);

  return (
    <Card className="space-y-4 border border-success/40 bg-gradient-to-br from-card via-card to-surface shadow-stellar-glow">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-success/15 border border-success/30 text-success flex items-center justify-center">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-h3 text-text-primary">Transparent Refund Breakdown</h3>
            <p className="text-caption text-text-secondary">On-Chain Calculated Settlement</p>
          </div>
        </div>
      </div>

      <div className="space-y-2.5 font-mono text-caption">
        <div className="flex justify-between items-center text-body">
          <span className="text-text-secondary font-sans">Security Deposit:</span>
          <span className="font-bold text-text-primary">{deposit} XLM</span>
        </div>

        <div className="flex justify-between items-center text-body">
          <span className="text-text-secondary font-sans">Utility Reserve:</span>
          <span className="font-bold text-text-primary">{reserve} XLM</span>
        </div>

        {totalDeduction > 0 && (
          <div className="p-3 bg-warning/10 rounded-xl border border-warning/30 space-y-1 text-xs">
            <span className="text-warning font-semibold font-sans block mb-1">Itemized Deductions:</span>
            {deductions.electricity > 0 && <div className="flex justify-between"><span>Electricity:</span><span>-{deductions.electricity} XLM</span></div>}
            {deductions.water > 0 && <div className="flex justify-between"><span>Water & Sewage:</span><span>-{deductions.water} XLM</span></div>}
            {deductions.maintenance > 0 && <div className="flex justify-between"><span>Maintenance:</span><span>-{deductions.maintenance} XLM</span></div>}
            {deductions.other > 0 && <div className="flex justify-between"><span>Other:</span><span>-{deductions.other} XLM</span></div>}
            <div className="flex justify-between pt-1 border-t border-warning/30 font-bold text-warning">
              <span>Total Deductions:</span>
              <span>-{totalDeduction} XLM</span>
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-border flex justify-between items-center text-h2 font-sans">
          <span className="text-text-primary font-bold">Final Tenant Refund</span>
          <span className="font-extrabold text-success">{finalRefund.toFixed(2)} XLM</span>
        </div>
      </div>
    </Card>
  );
};
