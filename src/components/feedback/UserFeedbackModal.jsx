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

export const UserFeedbackModal = ({ isOpen, onClose, onSuccess }) => {
  const { connected, address, truncateAddress } = useWallet();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [role, setRole] = useState('Tenant');
  const [category, setCategory] = useState('UX');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    'UX & Interface',
    'Escrow Speed',
    'Dispute Settlement',
    'Smart Contract Security',
    'Wallet Onboarding'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      saveFeedbackEntry({
        name: connected ? `Stellar User (${truncateAddress(address)})` : 'Web3 Tester',
        role,
        wallet: address || 'GUEST_EVALUATOR_KEY',
        rating,
        category,
        comment: comment.trim(),
      });
      setSubmitting(false);
      setSubmitted(true);

      if (onSuccess) onSuccess();
      setTimeout(() => {
        setSubmitted(false);
        setComment('');
        onClose();
      }, 1600);
    }, 400);
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

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Star Rating */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                    Overall Experience Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active = (hoverRating || rating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className="p-1 rounded-xl hover:scale-110 transition-transform cursor-pointer focus:outline-none"
                        >
                          <Star
                            className={`w-7 h-7 transition-colors ${
                              active
                                ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                                : 'text-slate-600'
                            }`}
                          />
                        </button>
                      );
                    })}
                    <span className="text-xs font-mono font-bold text-amber-400 ml-2">
                      {rating} / 5 Stars
                    </span>
                  </div>
                </div>

                {/* Role Picker */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
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
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                    Feedback Focus Area
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-surface border border-border rounded-xl px-3.5 py-2 text-xs text-text-primary focus:outline-none focus:border-primary-glow transition-colors cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-card text-text-primary">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Comment Textarea */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                    Review / Notes
                  </label>
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe your experience with deposit locking, finality speed, or UI usability..."
                    className="w-full bg-surface border border-border rounded-2xl p-3.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-glow transition-all resize-none"
                    required
                  />
                </div>

                {/* Submit Action */}
                <div className="flex items-center justify-end gap-3 pt-2">
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
