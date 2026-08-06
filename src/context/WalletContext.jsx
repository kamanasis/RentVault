import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  isConnected,
  isAllowed,
  setAllowed,
  getPublicKey,
  getNetwork
} from '@stellar/freighter-api';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInstalled, setIsInstalled] = useState(true);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showNetworkModal, setShowNetworkModal] = useState(false);

  // Helper to format public key: GB7X...42F0
  const truncateAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  // Safe wrapper for Freighter detection
  const checkFreighterInstalled = async () => {
    try {
      const res = await isConnected();
      const hasFreighter = typeof res === 'object' ? Boolean(res?.isConnected) : Boolean(res);
      setIsInstalled(hasFreighter);
      return hasFreighter;
    } catch (err) {
      setIsInstalled(false);
      return false;
    }
  };

  // Restore session state on mount
  useEffect(() => {
    const savedAddress = sessionStorage.getItem('rentvault_wallet_address');
    const savedNetwork = sessionStorage.getItem('rentvault_wallet_network');

    if (savedAddress) {
      setAddress(savedAddress);
      setNetwork(savedNetwork || 'TESTNET');
      setConnected(true);
    }

    checkFreighterInstalled();
  }, []);

  // Connect Wallet Flow
  const connectWallet = async (useDemo = false) => {
    setLoading(true);
    setError(null);

    // If user opts for Demo Testnet Wallet (e.g. without extension installed)
    if (useDemo) {
      const demoAddr = 'GB7X42F098A190B38812TESTNETRENTVAULTKEY99';
      setAddress(demoAddr);
      setNetwork('TESTNET');
      setConnected(true);
      sessionStorage.setItem('rentvault_wallet_address', demoAddr);
      sessionStorage.setItem('rentvault_wallet_network', 'TESTNET');
      setShowInstallModal(false);
      setLoading(false);
      return { success: true, address: demoAddr };
    }

    try {
      const installed = await checkFreighterInstalled();

      if (!installed) {
        setShowInstallModal(true);
        setLoading(false);
        return { success: false, error: 'Freighter not installed' };
      }

      // Request permission
      await setAllowed();

      // Fetch public key
      const keyRes = await getPublicKey();
      const pubKey = typeof keyRes === 'object' ? keyRes.address || keyRes.publicKey : keyRes;

      if (!pubKey) {
        throw new Error('User rejected connection or public key unavailable.');
      }

      // Fetch network
      const netRes = await getNetwork();
      const currentNet = (typeof netRes === 'object' ? netRes.network : netRes) || 'TESTNET';

      // Check if Testnet
      const isTestnet = currentNet.toUpperCase().includes('TESTNET');

      setAddress(pubKey);
      setNetwork(currentNet);
      setConnected(true);
      sessionStorage.setItem('rentvault_wallet_address', pubKey);
      sessionStorage.setItem('rentvault_wallet_network', currentNet);

      if (!isTestnet) {
        setShowNetworkModal(true);
      }

      setLoading(false);
      return { success: true, address: pubKey };
    } catch (err) {
      console.error('Freighter connection error:', err);
      const errMsg = err?.message || 'Failed to connect Freighter wallet.';
      setError(errMsg);
      setLoading(false);
      return { success: false, error: errMsg };
    }
  };

  // Disconnect Flow
  const disconnectWallet = () => {
    setConnected(false);
    setAddress('');
    setNetwork('');
    setError(null);
    setShowInstallModal(false);
    setShowNetworkModal(false);
    sessionStorage.removeItem('rentvault_wallet_address');
    sessionStorage.removeItem('rentvault_wallet_network');
  };

  return (
    <WalletContext.Provider
      value={{
        connected,
        address,
        network,
        loading,
        error,
        isInstalled,
        showInstallModal,
        setShowInstallModal,
        showNetworkModal,
        setShowNetworkModal,
        connectWallet,
        disconnectWallet,
        truncateAddress,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
