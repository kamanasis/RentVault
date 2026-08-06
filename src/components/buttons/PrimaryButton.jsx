import React from 'react';
import { motion } from 'framer-motion';

export const PrimaryButton = ({ 
  children, 
  onClick, 
  type = 'button', 
  disabled = false,
  className = '',
  icon: Icon = null,
  fullWidth = false,
  pulse = false,
  ariaLabel,
  ...props 
}) => {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.025, y: disabled ? 0 : -2 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel || (typeof children === 'string' ? children : 'Primary button')}
      className={`
        relative inline-flex items-center justify-center gap-2.5 
        px-7 py-3.5 rounded-full font-semibold text-caption text-white 
        bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB]
        shadow-stellar hover:shadow-stellar-glow
        transition-all duration-300 ease-out
        min-h-[44px] min-w-[140px] select-none cursor-pointer
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-glow focus-visible:ring-offset-2 focus-visible:ring-offset-background
        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
        ${pulse ? 'animate-[pulse_3s_infinite_easeInOut]' : ''}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5 text-white flex-shrink-0" />}
      <span className="tracking-wide">{children}</span>
    </motion.button>
  );
};
