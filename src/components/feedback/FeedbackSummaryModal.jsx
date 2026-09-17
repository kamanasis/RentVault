import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  X, 
  MessageSquare, 
  ThumbsUp, 
  Award, 
  TrendingUp, 
  UserCheck, 
  Filter,
  ExternalLink,
  Plus,
  Inbox
} from 'lucide-react';
import { fetchFeedbackEntries, getFeedbackMetrics } from '../../services/feedbackStore';
import { trackEvent } from '../../services/analytics';

export const FeedbackSummaryModal = ({ isOpen, onClose, onOpenSubmitModal }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({ averageRating: 0, totalCount: 0, csatScore: 0, categoryCounts: {} });
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');

  useEffect(() => {
    let isMounted = true;
    if (isOpen) {
      setIsLoading(true);
      trackEvent('feedback_viewed');
      fetchFeedbackEntries()
        .then((items) => {
          if (isMounted) {
            setFeedbacks(items);
            setMetrics(getFeedbackMetrics(items));
            setIsLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) setIsLoading(false);
        });
    }
    return () => { isMounted = false; };
  }, [isOpen]);

  if (!isOpen) return null;

  const categories = ['All', ...Object.keys(metrics.categoryCounts || {})];
  const filteredFeedbacks = activeCategoryFilter === 'All' 
    ? feedbacks 
    : feedbacks.filter((f) => (f.category || 'General') === activeCategoryFilter);

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
          className="relative w-full max-w-2xl max-h-[85vh] bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 flex flex-col overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.3)]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <span>User Feedback & Sentiment Report</span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-400/30">
                  Verified Real Feedback
                </span>
              </h3>
              <p className="text-xs text-text-muted">
                Aggregated ratings and field feedback collected from genuine testnet users.
              </p>
            </div>
          </div>

          {/* KPI Analytics Cards Ribbon */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {/* Metric 1: Average Rating */}
            <div className="bg-surface/60 border border-border/70 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] text-text-muted font-semibold uppercase tracking-wider mb-1">
                Average Rating
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-extrabold text-text-primary font-mono">
                  {metrics.totalCount > 0 ? metrics.averageRating : '0.0'}
                </span>
                <div className="flex text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
              </div>
              <span className="text-[9.5px] text-text-muted font-mono mt-0.5">out of 5.0</span>
            </div>

            {/* Metric 2: CSAT Score */}
            <div className="bg-surface/60 border border-border/70 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] text-text-muted font-semibold uppercase tracking-wider mb-1">
                CSAT Score
              </span>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                  {metrics.totalCount > 0 ? `${metrics.csatScore}%` : '0%'}
                </span>
                <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <span className="text-[9.5px] text-text-muted font-mono mt-0.5">Satisfied Ratings</span>
            </div>

            {/* Metric 3: Total Submissions */}
            <div className="bg-surface/60 border border-border/70 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] text-text-muted font-semibold uppercase tracking-wider mb-1">
                Total Reviews
              </span>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-extrabold text-cyan-400 font-mono">
                  {metrics.totalCount}
                </span>
                <UserCheck className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="text-[9.5px] text-text-muted font-mono mt-0.5">Real Submissions</span>
            </div>
          </div>

          {/* Controls Bar: Category Filter & Leave Feedback Button */}
          <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-border/40">
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              <span className="text-[10px] text-text-muted uppercase tracking-wider mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Category:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-semibold transition-all cursor-pointer ${
                    activeCategoryFilter === cat
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-surface/40 hover:bg-surface text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                onClose();
                if (onOpenSubmitModal) onOpenSubmitModal();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/20 hover:bg-primary/30 border border-primary/40 text-primary-glow text-[11px] font-bold transition-all cursor-pointer flex-shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Leave Feedback</span>
            </button>
          </div>

          {/* Scrollable Feedback Cards List or Empty State */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-text-muted font-mono">Loading feedback...</span>
              </div>
            ) : filteredFeedbacks.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 bg-surface/20 rounded-2xl border border-border/40 p-6">
                <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-text-muted">
                  <Inbox className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-text-primary">No Feedback Recorded Yet</h4>
                  <p className="text-xs text-text-muted max-w-sm">
                    Be the first testnet user to evaluate RentVault! Submit feedback to help harden the smart contract escrow protocol.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenSubmitModal) onOpenSubmitModal();
                  }}
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-glow text-white text-xs font-semibold shadow-stellar transition-all cursor-pointer"
                >
                  Submit First Feedback
                </button>
              </div>
            ) : (
              filteredFeedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="bg-surface/40 border border-border/60 rounded-2xl p-4 transition-all hover:border-primary/30"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-text-primary">{fb.name || 'Testnet User'}</span>
                        <span className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                          fb.role === 'Tenant' 
                            ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-400/30' 
                            : 'bg-indigo-500/15 text-indigo-400 border border-indigo-400/30'
                        }`}>
                          {fb.role}
                        </span>
                        {fb.agreementId && (
                          <span className="text-[9px] font-mono text-text-muted">
                            {fb.agreementId}
                          </span>
                        )}
                      </div>
                      {fb.wallet && (
                        <div className="text-[9px] font-mono text-text-muted truncate max-w-[280px]">
                          {fb.wallet}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <div className="flex text-amber-400">
                        {Array.from({ length: fb.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono font-bold text-amber-400">
                        {fb.rating}.0
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed mb-2">
                    "{fb.comment}"
                  </p>

                  <div className="flex items-center justify-between text-[9px] text-text-muted font-mono pt-2 border-t border-border/30">
                    <span className="px-2 py-0.5 rounded bg-surface border border-border/40">
                      {fb.category}
                    </span>
                    <span>{new Date(fb.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Note */}
          <div className="pt-3 mt-3 border-t border-border/50 flex items-center justify-between text-[10px] text-text-muted font-mono">
            <span>Verified Testnet Participant Feedback Loop</span>
            <button
              onClick={onClose}
              className="px-3 py-1 rounded-lg hover:bg-surface text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
