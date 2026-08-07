import React from 'react';

export const Skeleton = ({ className = '', variant = 'text' }) => {
  const baseClasses = 'animate-pulse bg-surface/80 rounded-xl';

  if (variant === 'circle') {
    return <div className={`rounded-full ${baseClasses} ${className}`} />;
  }

  if (variant === 'card') {
    return <div className={`rounded-2xl border border-border/40 ${baseClasses} ${className}`} />;
  }

  return <div className={`${baseClasses} ${className}`} />;
};
