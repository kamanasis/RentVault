import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X, ShieldCheck } from 'lucide-react';

export const ToastContainer = ({ toasts = [], onRemove }) => {
  if (!toasts || toasts.length === 0) return null;

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-error flex-shrink-0" />;
      case 'stellar':
        return <ShieldCheck className="w-5 h-5 text-primary-glow flex-shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-primary-glow flex-shrink-0" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-success/40 bg-card/95';
      case 'error':
        return 'border-error/40 bg-card/95';
      case 'stellar':
        return 'border-primary/40 bg-card/95';
      default:
        return 'border-border/80 bg-card/95';
    }
  };

  return (
    <div 
      aria-live="polite"
      className="fixed top-20 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, x: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`pointer-events-auto relative p-4 rounded-2xl border ${getBorderColor(toast.type)} shadow-stellar-glow backdrop-blur-md flex items-start gap-3`}
          >
            {getToastIcon(toast.type)}

            <div className="flex-1 min-w-0 pr-2">
              {toast.title && (
                <h4 className="text-caption font-semibold text-text-primary leading-tight">
                  {toast.title}
                </h4>
              )}
              <p className="text-xs text-text-secondary mt-0.5 leading-normal">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => onRemove(toast.id)}
              className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface transition-colors cursor-pointer"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
