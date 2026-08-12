import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../cards/Card';
import { PrimaryButton } from '../buttons/PrimaryButton';
import { SecondaryButton } from '../buttons/SecondaryButton';
import { InputField } from '../forms/InputField';
import { StatusBadge } from '../status/StatusBadge';
import { 
  AlertTriangle, 
  MessageSquare, 
  CheckCircle2, 
  RotateCcw, 
  Clock, 
  User, 
  Send,
  Coins,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const DisputeResolutionPanel = ({ 
  agreement, 
  roleInfo, 
  onLandlordRespond, 
  onTenantRespond 
}) => {
  if (!agreement || !agreement.dispute) return null;

  const dispute = agreement.dispute;
  const isLandlord = roleInfo?.isLandlord;
  const isTenant = roleInfo?.isTenant;

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'respond'
  const [responseAction, setResponseAction] = useState('revised_proposal'); // 'accept' | 'revised_proposal' | 'reject' | 'continue'
  const [message, setMessage] = useState('');
  const [revisedUtility, setRevisedUtility] = useState(
    agreement.totalDeduction ? String(agreement.totalDeduction / 2) : '50'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const truncateKey = (key) => {
    if (!key) return 'N/A';
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
  };

  const getStatusBadge = () => {
    switch (dispute.status) {
      case 'open':
        return <StatusBadge variant="error" size="md">Dispute Open (Awaiting Landlord Response)</StatusBadge>;
      case 'landlord_response':
        return <StatusBadge variant="warning" size="md">Landlord Responded (Awaiting Tenant Action)</StatusBadge>;
      case 'tenant_response':
        return <StatusBadge variant="error" size="md">Tenant Continued Dispute (Awaiting Landlord)</StatusBadge>;
      case 'resolved':
        return <StatusBadge variant="success" size="md">Dispute Resolved (Refund Unlocked)</StatusBadge>;
      default:
        return <StatusBadge variant="warning" size="md">Dispute Active</StatusBadge>;
    }
  };

  const handleSubmitLandlord = async (e) => {
    e.preventDefault();
    if (!message.trim() && responseAction !== 'accept') return;

    setIsSubmitting(true);
    try {
      await onLandlordRespond({
        action: responseAction,
        message: message.trim(),
        revisedUtility: parseFloat(revisedUtility) || 0,
      });
      setMessage('');
      setActiveTab('overview');
    } catch (err) {
      console.error('[DisputeResolutionPanel] Landlord response error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitTenant = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onTenantRespond({
        action: responseAction,
        message: message.trim(),
      });
      setMessage('');
      setActiveTab('overview');
    } catch (err) {
      console.error('[DisputeResolutionPanel] Tenant response error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const responses = Array.isArray(dispute.responses) ? dispute.responses : [];

  return (
    <Card className="p-6 space-y-6 border-error/40 shadow-stellar-glow bg-gradient-to-br from-card via-card to-background">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-error/15 border border-error/40 flex items-center justify-center text-error">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-h3 text-text-primary">Dispute Resolution Workspace</h3>
            <p className="text-caption text-text-secondary">Stage 7 of 8 • Multi-Party Settlement Negotiation</p>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {/* Primary Dispute Claims Details */}
      <div className="p-4 rounded-2xl bg-error/10 border border-error/30 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-error">
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> Dispute Opened by Tenant
          </span>
          <span className="font-mono text-[11px] text-text-muted">
            {dispute.openedAt ? new Date(dispute.openedAt).toLocaleString() : 'Recently'}
          </span>
        </div>
        <div className="space-y-1 pt-1">
          <div className="text-caption font-bold text-text-primary">
            Category: <span className="text-error">{dispute.reason}</span>
          </div>
          <p className="text-body text-text-secondary leading-relaxed bg-background/60 p-3 rounded-xl border border-border/40">
            "{dispute.description}"
          </p>
        </div>
      </div>

      {/* Conversation Response Thread */}
      <div className="space-y-3">
        <h4 className="text-caption font-semibold text-text-primary flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4 text-primary-glow" /> Conversation Thread ({responses.length + 1} Messages)
        </h4>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {/* Original Claim */}
          <div className="p-3.5 bg-surface/80 rounded-2xl border border-border/60 space-y-1">
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span className="font-semibold text-text-primary flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-success" /> Tenant Claim ({truncateKey(agreement.tenantWallet)})
              </span>
              <span className="font-mono text-[10px]">{dispute.openedAt ? new Date(dispute.openedAt).toLocaleTimeString() : ''}</span>
            </div>
            <p className="text-caption text-text-secondary">{dispute.description}</p>
          </div>

          {/* Response History */}
          {responses.map((resp, idx) => (
            <motion.div
              key={resp.id || idx}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3.5 rounded-2xl border space-y-1.5 ${
                resp.role === 'landlord'
                  ? 'bg-primary/10 border-primary/40 ml-4'
                  : 'bg-success/10 border-success/40 mr-4'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-text-primary flex items-center gap-1">
                  <User className={`w-3.5 h-3.5 ${resp.role === 'landlord' ? 'text-primary-glow' : 'text-success'}`} />
                  {resp.role === 'landlord' ? 'Landlord Response' : 'Tenant Follow-Up'} ({truncateKey(resp.by)})
                </span>
                <span className="font-mono text-[10px] text-text-muted">
                  {resp.timestamp ? new Date(resp.timestamp).toLocaleTimeString() : ''}
                </span>
              </div>

              {resp.action === 'accept' && (
                <div className="text-xs font-semibold text-success flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Accepted Tenant Claim
                </div>
              )}
              {resp.action === 'revised_proposal' && (
                <div className="text-xs font-semibold text-primary-glow flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5" /> Proposed Revised Utility Deduction: {resp.proposedUtilityDeduction} XLM
                </div>
              )}
              {resp.action === 'reject' && (
                <div className="text-xs font-semibold text-error flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Rejected Claim (Maintained Original Deduction)
                </div>
              )}

              {resp.message && (
                <p className="text-caption text-text-secondary">{resp.message}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Interactive Response Form (Landlord or Tenant) */}
      {dispute.status !== 'resolved' && (
        <div className="pt-4 border-t border-border space-y-4">
          {/* Landlord Controls */}
          {isLandlord && (dispute.status === 'open' || dispute.status === 'tenant_response') && (
            <form onSubmit={handleSubmitLandlord} className="space-y-4 bg-background/60 p-4 rounded-2xl border border-primary/30">
              <h4 className="text-caption font-semibold text-text-primary">Respond as Landlord</h4>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setResponseAction('revised_proposal')}
                  className={`px-3.5 py-2 rounded-xl text-caption font-semibold transition-all cursor-pointer ${
                    responseAction === 'revised_proposal'
                      ? 'bg-primary text-white'
                      : 'bg-surface text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Propose Revised Settlement
                </button>
                <button
                  type="button"
                  onClick={() => setResponseAction('accept')}
                  className={`px-3.5 py-2 rounded-xl text-caption font-semibold transition-all cursor-pointer ${
                    responseAction === 'accept'
                      ? 'bg-success text-white'
                      : 'bg-surface text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Accept Tenant Claim (0 Utility)
                </button>
                <button
                  type="button"
                  onClick={() => setResponseAction('reject')}
                  className={`px-3.5 py-2 rounded-xl text-caption font-semibold transition-all cursor-pointer ${
                    responseAction === 'reject'
                      ? 'bg-error text-white'
                      : 'bg-surface text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Reject Claim
                </button>
              </div>

              {responseAction === 'revised_proposal' && (
                <InputField
                  label="New Proposed Utility Deduction (XLM)"
                  type="number"
                  step="0.01"
                  min="0"
                  max={(agreement.depositAmount || 0) + (agreement.utilityReserve || 0)}
                  value={revisedUtility}
                  onChange={(e) => setRevisedUtility(e.target.value)}
                />
              )}

              <div className="space-y-1">
                <label className="text-caption font-semibold text-text-primary block">Message / Note to Tenant</label>
                <textarea
                  rows={2}
                  placeholder="Provide rationale for your response or revised deduction..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-surface border border-border rounded-xl p-3 text-caption text-text-primary outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <div className="flex justify-end">
                <PrimaryButton icon={Send} type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting Response...' : 'Submit Response to Tenant'}
                </PrimaryButton>
              </div>
            </form>
          )}

          {/* Tenant Controls */}
          {isTenant && dispute.status === 'landlord_response' && (
            <form onSubmit={handleSubmitTenant} className="space-y-4 bg-background/60 p-4 rounded-2xl border border-success/30">
              <h4 className="text-caption font-semibold text-text-primary">Respond to Landlord Proposal</h4>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setResponseAction('accept')}
                  className={`px-3.5 py-2 rounded-xl text-caption font-semibold transition-all cursor-pointer ${
                    responseAction === 'accept'
                      ? 'bg-success text-white'
                      : 'bg-surface text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Accept Revised Settlement
                </button>
                <button
                  type="button"
                  onClick={() => setResponseAction('continue')}
                  className={`px-3.5 py-2 rounded-xl text-caption font-semibold transition-all cursor-pointer ${
                    responseAction === 'continue'
                      ? 'bg-error text-white'
                      : 'bg-surface text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Continue Dispute
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-caption font-semibold text-text-primary block">Message to Landlord</label>
                <textarea
                  rows={2}
                  placeholder="State your acceptance or additional comments..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-surface border border-border rounded-xl p-3 text-caption text-text-primary outline-none focus:border-success transition-colors resize-none"
                />
              </div>

              <div className="flex justify-end">
                <PrimaryButton icon={Send} type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Response to Landlord'}
                </PrimaryButton>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Resolved Confirmation Notice */}
      {dispute.status === 'resolved' && (
        <div className="p-4 bg-success/15 border border-success/40 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-success" />
            <div>
              <h4 className="text-caption font-bold text-text-primary">Dispute Resolved!</h4>
              <p className="text-xs text-text-secondary">Refund release is now unlocked for tenant authorization.</p>
            </div>
          </div>
          <span className="text-h3 font-extrabold text-success font-mono">
            {agreement.finalRefundAmount !== undefined ? agreement.finalRefundAmount : agreement.depositAmount} XLM
          </span>
        </div>
      )}
    </Card>
  );
};
