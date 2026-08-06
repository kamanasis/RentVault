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
        px-6 py-3.5 rounded-full font-medium text-caption text-white 
        bg-gradient-to-r from-primary to-primary-hover
        shadow-stellar hover:shadow-stellar-glow
        transition-all duration-300 ease-out
        min-h-[44px] min-w-[120px] select-none cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5 text-white/90" />}
      <span>{children}</span>
    </motion.button>
  );
};
