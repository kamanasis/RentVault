import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Card } from '../cards/Card';

export const Accordion = ({
  title,
  subtitle,
  icon: Icon,
  badgeText,
  defaultOpen = false,
  children,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className={`p-0 overflow-hidden border-border/80 ${className}`}>
      {/* Header Bar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-surface/50 transition-colors cursor-pointer outline-none focus:bg-surface/50"
      >
        <div className="flex items-center gap-3 min-w-0">
          {Icon && (
            <div className="w-10 h-10 rounded-2xl bg-surface border border-border flex items-center justify-center text-primary-glow flex-shrink-0">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-h3 text-text-primary truncate">{title}</h3>
              {badgeText && (
                <span className="text-[10px] font-mono font-bold bg-primary/10 border border-primary/20 text-primary-glow px-2 py-0.5 rounded-full flex-shrink-0">
                  {badgeText}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-caption text-text-secondary truncate mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="p-2 rounded-xl bg-surface border border-border text-text-secondary flex-shrink-0 ml-2">
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </div>
      </button>

      {/* Expandable Body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="p-4 sm:p-6 border-t border-border/60 bg-background/40">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
