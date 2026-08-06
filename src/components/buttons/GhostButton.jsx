import React from 'react';
import { motion } from 'framer-motion';

export const GhostButton = ({ 
  children, 
  onClick, 
  type = 'button', 
  disabled = false,
  className = '',
  icon: Icon = null,
  fullWidth = false,
  ...props 
}) => {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative inline-flex items-center justify-center gap-2 
        px-5 py-3.5 rounded-full font-medium text-caption text-text-secondary 
        hover:text-text-primary hover:bg-surface/50
        transition-all duration-200 ease-out
        min-h-[44px] select-none cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5" />}
      <span>{children}</span>
    </motion.button>
  );
};
