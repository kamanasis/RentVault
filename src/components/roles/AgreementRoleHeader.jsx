import React from 'react';
import { RoleBadge } from './RoleBadge';
import { Shield, UserCheck, AlertTriangle, Key } from 'lucide-react';
import { Card } from '../cards/Card';

export const AgreementRoleHeader = ({ roleInfo, connectedAddress }) => {
  if (!roleInfo) return null;

  return (
    <Card className="p-4 bg-background/80 border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-caption">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center text-primary-glow flex-shrink-0">
          <Key className="w-4.5 h-4.5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted font-sans font-medium">Connected Address:</span>
            <span className="text-text-primary font-bold truncate max-w-[180px] sm:max-w-[280px]">
              {connectedAddress ? `${connectedAddress.slice(0, 6)}...${connectedAddress.slice(-6)}` : 'Disconnected'}
            </span>
          </div>
          <p className="text-xs text-text-muted font-sans mt-0.5">
            {roleInfo.isLandlord && 'Granted Landlord permissions: Term editing, sharing link, generating deposit URL.'}
            {roleInfo.isTenant && 'Granted Tenant permissions: Smart contract escrow deposit execution & refund tracking.'}
            {roleInfo.isUnauthorized && 'Read-only access. Connected wallet key does not match Landlord or Tenant key.'}
            {roleInfo.role === 'guest' && 'Guest view mode. Connect your wallet to access agreement permissions.'}
          </p>
        </div>
      </div>

      <RoleBadge role={roleInfo.role} />
    </Card>
  );
};
