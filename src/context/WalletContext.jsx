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
  const [connectedAt, setConnectedAt] = useState(null);
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

  // Robust Freighter extension detection
  const checkFreighterInstalled = async () => {
    console.log('[RentVault Wallet] Checking Freighter extension installation...');
    try {
      // Check window object first for instant browser extension injection
      const windowHasFreighter = typeof window !== 'undefined' && Boolean(window.freighter || window.freighterApi);
      
      const res = await isConnected();
      console.log('[RentVault Wallet] isConnected() response:', res);
      
      const hasFreighter = windowHasFreighter || (typeof res === 'object' ? Boolean(res?.isConnected) : Boolean(res));
      setIsInstalled(hasFreighter);
      return hasFreighter;
    } catch (err) {
      console.warn('[RentVault Wallet] Freighter detection check failed:', err);
      // Fallback check on window object
      const windowHasFreighter = typeof window !== 'undefined' && Boolean(window.freighter || window.freighterApi);
      setIsInstalled(windowHasFreighter);
      return windowHasFreighter;
    }
  };

  // Restore session state on mount
  useEffect(() => {
    const savedAddress = sessionStorage.getItem('rentvault_wallet_address');
    const savedNetwork = sessionStorage.getItem('rentvault_wallet_network');
    const savedTime = sessionStorage.getItem('rentvault_wallet_connected_at');

    if (savedAddress) {
      setAddress(savedAddress);
      setNetwork(savedNetwork || 'TESTNET');
      setConnectedAt(savedTime ? parseInt(savedTime, 10) : Date.now());
      setConnected(true);
      console.log('[RentVault Wallet] Restored active wallet session:', savedAddress);
    }

    checkFreighterInstalled();
  }, []);

  // Connect Wallet Flow
  const connectWallet = async (useDemo = false) => {
    console.log('[RentVault Wallet] Starting wallet connection flow...');
    setLoading(true);
    setError(null);
    const now = Date.now();

    // Demo Mode Fallback for testing when extension is not installed
    if (useDemo) {
      console.log('[RentVault Wallet] Connecting via Demo Testnet Account...');
      const demoAddr = 'GB7X42F098A190B38812TESTNETRENTVAULTKEY99';
      setAddress(demoAddr);
      setNetwork('TESTNET');
      setConnectedAt(now);
      setConnected(true);
      sessionStorage.setItem('rentvault_wallet_address', demoAddr);
      sessionStorage.setItem('rentvault_wallet_network', 'TESTNET');
      sessionStorage.setItem('rentvault_wallet_connected_at', now.toString());
      setShowInstallModal(false);
      setShowNetworkModal(false);
      setLoading(false);
      return { success: true, address: demoAddr };
    }

    try {
      const installed = await checkFreighterInstalled();

      if (!installed) {
        console.warn('[RentVault Wallet] Freighter extension not detected in browser.');
        setShowInstallModal(true);
        setError('Freighter browser wallet is not installed.');
        setLoading(false);
        return { success: false, error: 'Freighter not installed' };
      }

      // Step 1: Request permission via setAllowed()
      console.log('[RentVault Wallet] Requesting wallet access via setAllowed()...');
      const allowedRes = await setAllowed();
      console.log('[RentVault Wallet] setAllowed() response:', allowedRes);

      const isUserAllowed = typeof allowedRes === 'object' ? allowedRes?.isAllowed !== false : Boolean(allowedRes);
      
      if (allowedRes?.error) {
        throw new Error(`Freighter Permission Error: ${allowedRes.error}`);
      }

      // Step 2: Retrieve public wallet address via getPublicKey()
      console.log('[RentVault Wallet] Retrieving public key via getPublicKey()...');
      const keyRes = await getPublicKey();
      console.log('[RentVault Wallet] getPublicKey() response:', keyRes);

      let pubKey = '';
      if (typeof keyRes === 'string') {
        pubKey = keyRes;
      } else if (keyRes && typeof keyRes === 'object') {
        if (keyRes.error) {
          throw new Error(keyRes.error);
        }
        pubKey = keyRes.address || keyRes.publicKey || keyRes.pubkey || '';
      }

      if (!pubKey || pubKey.trim() === '') {
        throw new Error('Wallet connection was cancelled or public key is unavailable.');
      }

      // Step 3: Retrieve active network via getNetwork()
      console.log('[RentVault Wallet] Retrieving active network via getNetwork()...');
      let currentNet = 'TESTNET';
      try {
        const netRes = await getNetwork();
        console.log('[RentVault Wallet] getNetwork() response:', netRes);
        if (typeof netRes === 'string') {
          currentNet = netRes;
        } else if (netRes && typeof netRes === 'object') {
          currentNet = netRes.network || netRes.networkName || 'TESTNET';
        }
      } catch (netErr) {
        console.warn('[RentVault Wallet] Could not determine network automatically, defaulting to TESTNET:', netErr);
      }

      // Step 4: Verify Stellar Testnet
      const isTestnet = currentNet.toUpperCase().includes('TESTNET');
      console.log(`[RentVault Wallet] Connected to ${currentNet}. Is Testnet: ${isTestnet}`);

      setAddress(pubKey);
      setNetwork(currentNet);
      setConnectedAt(now);
      setConnected(true);
      setError(null);
      sessionStorage.setItem('rentvault_wallet_address', pubKey);
      sessionStorage.setItem('rentvault_wallet_network', currentNet);
      sessionStorage.setItem('rentvault_wallet_connected_at', now.toString());

      if (!isTestnet) {
        setShowNetworkModal(true);
        console.warn('[RentVault Wallet] Connected to wrong network! User prompted to switch to Stellar Testnet.');
      }

      setLoading(false);
      return { success: true, address: pubKey };
    } catch (err) {
      console.error('[RentVault Wallet Error] Connection failed:', err);
      const errMsg = err?.message || 'Failed to connect Freighter wallet.';
      setError(errMsg);
      setLoading(false);
      return { success: false, error: errMsg };
    }
  };

  // Disconnect Flow
  const disconnectWallet = () => {
    console.log('[RentVault Wallet] Disconnecting wallet session...');
    setConnected(false);
    setAddress('');
    setNetwork('');
    setConnectedAt(null);
    setError(null);
    setShowInstallModal(false);
    setShowNetworkModal(false);
    sessionStorage.removeItem('rentvault_wallet_address');
    sessionStorage.removeItem('rentvault_wallet_network');
    sessionStorage.removeItem('rentvault_wallet_connected_at');
  };

  const clearError = () => setError(null);

  return (
    <WalletContext.Provider
      value={{
        connected,
        address,
        network,
        connectedAt,
        loading,
        error,
        clearError,
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
