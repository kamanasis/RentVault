import React from 'react';
import { StatusBadge } from '../status/StatusBadge';

export const NetworkBadge = ({ network = 'TESTNET', className = '' }) => {
  const isTestnet = network.toUpperCase().includes('TESTNET');

  return (
    <StatusBadge 
      variant={isTestnet ? 'primary' : 'warning'}
      size="sm"
      className={className}
    >
      {isTestnet ? 'Stellar Testnet' : 'Wrong Network'}
    </StatusBadge>
  );
};
