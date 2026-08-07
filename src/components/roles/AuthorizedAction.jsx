import React from 'react';

export const AuthorizedAction = ({ 
  isAllowed = false, 
  fallback = null, 
  children 
}) => {
  if (!isAllowed) {
    return fallback || null;
  }

  return <>{children}</>;
};
