import React from 'react';

export const StatusBadge = ({ 
  children, 
  variant = 'neutral',
  size = 'md',
  className = '' 
}) => {
  const variantStyles = {
    success: 'bg-success-bg text-success border-success/30',
    warning: 'bg-warning-bg text-warning border-warning/30',
    error: 'bg-error-bg text-error border-error/30',
    primary: 'bg-primary/10 text-primary-glow border-primary/30',
    neutral: 'bg-surface text-text-secondary border-border',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-caption',
    lg: 'px-4 py-1.5 text-body',
  };

  return (
    <span className={`
      inline-flex items-center gap-1.5 font-medium rounded-full border border-solid
      ${variantStyles[variant] || variantStyles.neutral}
      ${sizeStyles[size] || sizeStyles.md}
      ${className}
    `}>
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      <span>{children}</span>
    </span>
  );
};
