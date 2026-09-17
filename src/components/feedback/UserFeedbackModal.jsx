import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  X, 
  MessageSquare, 
  CheckCircle2, 
  Send, 
  User, 
  Building, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { saveFeedbackEntry } from '../../services/feedbackStore';
import { trackEvent } from '../../services/analytics';

export const UserFeedbackModal = ({ isOpen, onClose, onSuccess }) => {
  const { connected, address, truncateAddress } = useWallet();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [easeOfUse, setEaseOfUse] = useState(5);
  const [role, setRole] = useState('Tenant');
  const [category, setCategory] = useState('UX & Interface');
  const [comment, setComment] = useState('');
  const [confusingPart, setConfusingPart] = useState('');
  const [problemEncountered, setProblemEncountered] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [showDetailedPrompts, setShowDetailedPrompts] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    'UX & Interface',
    'Escrow Speed',
    'Dispute Settlement',
    'Smart Contract Security',
    'Wallet Onboarding',
    'Feature Request'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || submitting) return;

    setSubmitting(true);
    try {
      await saveFeedbackEntry({
        name: connected ? `Stellar User (${truncateAddress(address)})` : 'Web3 Tester',
        role,
        wallet: address || null,
        rating,
        easeOfUse,
        category,
        comment: comment.trim(),
        confusingPart: confusingPart.trim() || null,
        problemEncountered: problemEncountered.trim() || null,
        suggestion: suggestion.trim() || null,
      });
      trackEvent('user_feedback_submitted', { role, category, rating, easeOfUse });
      setSubmitted(true);

      if (onSuccess) onSuccess();
      setTimeout(() => {
        setSubmitted(false);
        setComment('');
        setConfusingPart('');
        setProblemEncountered('');
        setSuggestion('');
        setShowDetailedPrompts(false);
        onClose();
      }, 1600);
    } catch {
      // Handled inside saveFeedbackEntry
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-background/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {submitted ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-12 flex flex-col items-center text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shadow-[0_0_25px_rgba(52,211,153,0.3)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-text-primary">Thank You for Your Feedback!</h3>
              <p className="text-sm text-text-secondary max-w-xs">
                Your review has been recorded to RentVault's public telemetry & verified feedback registry.
              </p>
            </motion.div>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-primary/20 border border-primary/40 text-primary-glow flex items-center justify-center shadow-stellar">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    <span>Submit User Feedback</span>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-primary/15 text-primary-glow border border-primary/30">
                      Community Review
                    </span>
                  </h3>
                  <p className="text-xs text-text-muted">
                    Help us refine the decentralized rental deposit escrow experience.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 max-h-[62vh] overflow-y-auto pr-1">
                {/* Rating & Ease of Use Side-by-Side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Star Rating */}
                  <div className="bg-surface/40 p-3 rounded-2xl border border-border/50">
                    <label className="block text-[10.5px] font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                      Overall Experience
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const active = (hoverRating || rating) >= star;
                        return (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                            className="p-0.5 rounded-lg hover:scale-110 transition-transform cursor-pointer focus:outline-none"
                          >
                            <Star
                              className={`w-5 h-5 transition-colors ${
                                active
                                  ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]'
                                  : 'text-slate-600'
                              }`}
                            />
                          </button>
                        );
                      })}
                      <span className="text-[11px] font-mono font-bold text-amber-400 ml-1.5">
                        {rating}/5
                      </span>
                    </div>
                  </div>

                  {/* Ease of Use */}
                  <div className="bg-surface/40 p-3 rounded-2xl border border-border/50">
                    <label className="block text-[10.5px] font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                      Ease of Use
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setEaseOfUse(val)}
                          className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                            easeOfUse === val
                              ? 'bg-cyan-500 text-white shadow-sm'
                              : 'bg-surface text-text-secondary hover:text-text-primary'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                      <span className="text-[10px] font-mono text-text-muted ml-1">
                        {easeOfUse >= 4 ? 'Intuitive' : easeOfUse === 3 ? 'Moderate' : 'Difficult'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Role Picker */}
                <div>
                  <label className="block text-[10.5px] font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                    Your Primary Perspective
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'Tenant', icon: User },
                      { id: 'Landlord', icon: Building },
                      { id: 'Evaluator', icon: ShieldCheck },
                    ].map((r) => {
                      const Icon = r.icon;
                      const isSelected = role === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setRole(r.id)}
                          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-primary/20 border-primary-glow text-primary-glow shadow-sm'
                              : 'bg-surface/50 border-border text-text-secondary hover:text-text-primary'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{r.id}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Category Dropdown */}
                <div>
                  <label className="block text-[10.5px] font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                    Feedback Focus Area
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary-glow transition-colors cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-card text-text-primary">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Primary Feedback Textarea */}
                <div>
                  <label className="block text-[10.5px] font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                    Your Experience & Impressions <span className="text-primary-glow">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe your overall experience with deposit locking, wallet connection, or UI usability..."
                    className="w-full bg-surface border border-border rounded-xl p-3 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-glow transition-all resize-none"
                    required
                  />
                </div>

                {/* Detailed Diagnostic Prompts Toggle */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowDetailedPrompts(!showDetailedPrompts)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{showDetailedPrompts ? 'Hide Diagnostic Questions' : '+ Add Detailed Diagnostics (Friction, Errors, Ideas)'}</span>
                  </button>
                </div>

                {showDetailedPrompts && (
                  <div className="space-y-3 p-3 bg-surface/30 rounded-2xl border border-border/50 text-left">
                    <div>
                      <label className="block text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-1">
                        What was confusing or caused friction?
                      </label>
                      <input
                        type="text"
                        value={confusingPart}
                        onChange={(e) => setConfusingPart(e.target.value)}
                        placeholder="e.g. Unclear when deposit was fully confirmed, role permissions..."
                        className="w-full bg-surface border border-border rounded-xl px-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-1">
                        Did you encounter any errors or failed transactions?
                      </label>
                      <input
                        type="text"
                        value={problemEncountered}
                        onChange={(e) => setProblemEncountered(e.target.value)}
                        placeholder="e.g. Freighter popup closed, Friendbot timeout, wrong balance..."
                        className="w-full bg-surface border border-border rounded-xl px-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-1">
                        What feature would you like next?
                      </label>
                      <input
                        type="text"
                        value={suggestion}
                        onChange={(e) => setSuggestion(e.target.value)}
                        placeholder="e.g. Email notifications, USDC deposits, multi-sig escrow..."
                        className="w-full bg-surface border border-border rounded-xl px-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                )}

                {/* Submit Action */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/40">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting || !comment.trim()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-stellar hover:shadow-stellar-glow transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Recording...' : 'Submit Feedback'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
