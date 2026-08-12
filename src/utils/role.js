/**
 * Evaluate agreement access role based on connected wallet public key
 * Enforces uppercase trimmed string comparison for robust cross-browser matching
 * Returns { role: 'landlord' | 'tenant' | 'unauthorized' | 'guest', isLandlord, isTenant, isUnauthorized }
 */
export const evaluateAgreementRole = (connectedAddress, agreement) => {
  if (!connectedAddress || connectedAddress.trim() === '') {
    return {
      role: 'guest',
      isLandlord: false,
      isTenant: false,
      isUnauthorized: false,
      label: 'Guest Mode',
    };
  }

  if (!agreement) {
    return {
      role: 'guest',
      isLandlord: false,
      isTenant: false,
      isUnauthorized: false,
      label: 'Guest Mode',
    };
  }

  const normalizedConnected = connectedAddress.trim().toUpperCase();
  const normalizedLandlord = (agreement.landlordWallet || '').trim().toUpperCase();
  const normalizedTenant = (agreement.tenantWallet || '').trim().toUpperCase();

  const isLandlord = normalizedConnected === normalizedLandlord;
  const isTenant = normalizedConnected === normalizedTenant;

  if (isLandlord) {
    return {
      role: 'landlord',
      isLandlord: true,
      isTenant: false,
      isUnauthorized: false,
      label: 'Viewing as Landlord',
    };
  }

  if (isTenant) {
    return {
      role: 'tenant',
      isLandlord: false,
      isTenant: true,
      isUnauthorized: false,
      label: 'Viewing as Tenant',
    };
  }

  return {
    role: 'unauthorized',
    isLandlord: false,
    isTenant: false,
    isUnauthorized: true,
    label: 'Unauthorized Wallet',
  };
};
