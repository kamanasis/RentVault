import React from 'react';
import { StatusBadge } from '../status/StatusBadge';

export const AgreementStatusBadge = ({ status = 'Awaiting Deposit', className = '' }) => {
  const statusVariantMap = {
    'Draft': 'neutral',
    'Awaiting Deposit': 'warning',
    'Deposit Locked': 'primary',
    'Lease Active': 'success',
    'Lease Ended': 'warning',
    'Completed': 'success',
  };

  const variant = statusVariantMap[status] || 'neutral';

  return (
    <StatusBadge variant={variant} size="sm" className={className}>
      {status}
    </StatusBadge>
  );
};
