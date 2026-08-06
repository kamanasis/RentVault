import React from 'react';
import { Card } from './Card';
import { StatusBadge } from '../status/StatusBadge';

export const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon: Icon = null,
  caption,
  className = '' 
}) => {
  return (
    <Card hoverEffect className={`flex flex-col justify-between ${className}`}>
      <div className="flex items-center justify-between gap-4 mb-4">
        <span className="text-caption text-text-secondary font-medium">{title}</span>
        {Icon && (
          <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-primary-glow flex-shrink-0">
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      <div>
        <div className="text-h2 font-bold text-text-primary tracking-tight mb-2">
          {value}
        </div>
        <div className="flex items-center gap-2">
          {change && (
            <StatusBadge 
              variant={changeType === 'positive' ? 'success' : changeType === 'negative' ? 'error' : 'neutral'}
              size="sm"
            >
              {change}
            </StatusBadge>
          )}
          {caption && (
            <span className="text-xs text-text-muted">{caption}</span>
          )}
        </div>
      </div>
    </Card>
  );
};
