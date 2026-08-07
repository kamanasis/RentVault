import React from 'react';
import { StatusBadge } from '../status/StatusBadge';
import { Shield, UserCheck, Lock, User } from 'lucide-react';

export const RoleBadge = ({ role = 'guest', className = '' }) => {
  if (role === 'landlord') {
    return (
      <StatusBadge variant="primary" size="md" className={`gap-1.5 ${className}`}>
        <Shield className="w-3.5 h-3.5" />
        <span>Viewing as Landlord</span>
      </StatusBadge>
    );
  }

  if (role === 'tenant') {
    return (
      <StatusBadge variant="success" size="md" className={`gap-1.5 ${className}`}>
        <UserCheck className="w-3.5 h-3.5" />
        <span>Viewing as Tenant</span>
      </StatusBadge>
    );
  }

  if (role === 'unauthorized') {
    return (
      <StatusBadge variant="warning" size="md" className={`gap-1.5 ${className}`}>
        <Lock className="w-3.5 h-3.5 text-warning" />
        <span>Unauthorized Wallet</span>
      </StatusBadge>
    );
  }

  return (
    <StatusBadge variant="neutral" size="md" className={`gap-1.5 ${className}`}>
      <User className="w-3.5 h-3.5" />
      <span>Guest View</span>
    </StatusBadge>
  );
};
