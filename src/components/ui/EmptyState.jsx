import React from 'react';
import { Card } from '../cards/Card';
import { PrimaryButton } from '../buttons/PrimaryButton';
import { SecondaryButton } from '../buttons/SecondaryButton';
import { FileCheck } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = FileCheck,
  title = 'No Items Found',
  description = 'There are no records associated with your current filter or connected wallet address.',
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  className = '',
}) => {
  return (
    <Card className={`text-center py-12 px-6 space-y-4 max-w-xl mx-auto border-dashed ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-surface border border-border/80 text-primary-glow flex items-center justify-center mx-auto shadow-sm">
        <Icon className="w-7 h-7" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-h3 text-text-primary">{title}</h3>
        <p className="text-body text-text-secondary max-w-md mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      {(actionText || secondaryActionText) && (
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          {secondaryActionText && (
            <SecondaryButton onClick={onSecondaryAction}>
              {secondaryActionText}
            </SecondaryButton>
          )}

          {actionText && (
            <PrimaryButton onClick={onAction}>
              {actionText}
            </PrimaryButton>
          )}
        </div>
      )}
    </Card>
  );
};
