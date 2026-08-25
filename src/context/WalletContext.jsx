import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  isConnected,
  isAllowed,
  setAllowed,
  getAddress,
  getNetwork
} from '@stellar/freighter-api';
import { fetchAccountBalance, fetchAccountTransactions, fundAccountWithFriendbot } from '../services/stellar';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState('');
  const [connectedAt, setConnectedAt] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Standardized Error State: { code: 'WALLET_NOT_FOUND' | 'USER_REJECTED' | 'INSUFFICIENT_BALANCE' | 'GENERIC_ERROR', title, message, downloadUrl, walletName }
  const [error, setError] = useState(null);
  const [errorState, setErrorState] = useState(null);

  // Multi-wallet Modal State
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [selectedWalletProvider, setSelectedWalletProvider] = useState('freighter');

  const [isInstalled, setIsInstalled] = useState(true);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);

  // Live Balance State
  const [xlmBalance, setXlmBalance] = useState('0.00');
  const [rawBalance, setRawBalance] = useState(0);
  const [isFetchingBalance, setIsFetchingBalance] = useState(false);
  const [balanceUpdatedAt, setBalanceUpdatedAt] = useState(null);
  const [isUnfunded, setIsUnfunded] = useState(false);

  // Live Transactions State
  const [transactions, setTransactions] = useState([]);
  const [isFetchingTransactions, setIsFetchingTransactions] = useState(false);

  // Helper to format public key: GB7X...42F0
  const truncateAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  // Robust Freighter extension detection
  const checkFreighterInstalled = async () => {
    try {
      const windowHasFreighter = typeof window !== 'undefined' && Boolean(window.freighter || window.freighterApi);
      const res = await isConnected();
      const hasFreighter = windowHasFreighter || (typeof res === 'object' ? Boolean(res?.isConnected) : Boolean(res));
      setIsInstalled(hasFreighter);
      return hasFreighter;
    } catch (err) {
      const windowHasFreighter = typeof window !== 'undefined' && Boolean(window.freighter || window.freighterApi);
      setIsInstalled(windowHasFreighter);
      return windowHasFreighter;
    }
  };

  // Fetch live account balance from Horizon Testnet
  const fetchBalance = useCallback(async (targetAddress) => {
    const pubKey = targetAddress || address;
    if (!pubKey) return;

    setIsFetchingBalance(true);
    try {
      const data = await fetchAccountBalance(pubKey);
      setXlmBalance(data.balance);
      setRawBalance(data.raw);
      setIsUnfunded(data.isUnfunded);
      setBalanceUpdatedAt(Date.now());
    } catch (err) {
      console.warn('[WalletContext] Balance fetch error:', err);
    } finally {
      setIsFetchingBalance(false);
    }
  }, [address]);

  // Fetch recent transactions from Horizon Testnet
  const fetchTransactions = useCallback(async (targetAddress, limit = 10) => {
    const pubKey = targetAddress || address;
    if (!pubKey) return [];

    setIsFetchingTransactions(true);
    try {
      const txs = await fetchAccountTransactions(pubKey, limit);
      setTransactions(txs);
      return txs;
    } catch (err) {
      console.warn('[WalletContext] Transactions fetch error:', err);
      return [];
    } finally {
      setIsFetchingTransactions(false);
    }
  }, [address]);

  // Refresh balance & transactions trigger
  const refreshBalance = useCallback(async () => {
    if (address) {
      await Promise.all([fetchBalance(address), fetchTransactions(address, 10)]);
    }
  }, [address, fetchBalance, fetchTransactions]);

  // Fund unfunded account via Friendbot
  const fundTestnetAccount = async () => {
    if (!address) return;
    setIsFetchingBalance(true);
    try {
      await fundAccountWithFriendbot(address);
      await refreshBalance();
      setError(null);
      setErrorState(null);
    } catch (err) {
      setError(err?.message || 'Failed to fund account via Friendbot.');
    } finally {
      setIsFetchingBalance(false);
    }
  };

  // Restore session state on mount
  useEffect(() => {
    const savedAddress = sessionStorage.getItem('rentvault_wallet_address');
    const savedNetwork = sessionStorage.getItem('rentvault_wallet_network');
    const savedTime = sessionStorage.getItem('rentvault_wallet_connected_at');
    const savedProvider = sessionStorage.getItem('rentvault_wallet_provider');

    if (savedAddress) {
      setAddress(savedAddress);
      setNetwork(savedNetwork || 'TESTNET');
      setConnectedAt(savedTime ? parseInt(savedTime, 10) : Date.now());
      setSelectedWalletProvider(savedProvider || 'freighter');
      setConnected(true);
      fetchBalance(savedAddress);
      fetchTransactions(savedAddress, 10);
    }

    checkFreighterInstalled();
  }, [fetchBalance, fetchTransactions]);

  // Active account change polling listener for Freighter
  useEffect(() => {
    if (!connected || !address || address.startsWith('GB7X42F098A190B38812TESTNETRENTVAULTKEY99')) return;

    const interval = setInterval(async () => {
      try {
        const res = await getAddress();
        let activeKey = '';
        if (typeof res === 'string') {
          activeKey = res;
        } else if (res && typeof res === 'object') {
          activeKey = res.address || res.publicKey || '';
        }

        if (activeKey && activeKey !== address) {
          console.log(`[WalletContext] Detected active account switch: ${address} -> ${activeKey}`);
          const now = Date.now();
          setAddress(activeKey);
          setConnectedAt(now);
          sessionStorage.setItem('rentvault_wallet_address', activeKey);
          sessionStorage.setItem('rentvault_wallet_connected_at', now.toString());
          fetchBalance(activeKey);
          fetchTransactions(activeKey, 10);
        }
      } catch (err) {
        // Silent poll
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [connected, address, fetchBalance, fetchTransactions]);

  // Set explicit structured error helper
  const setCategorizedError = (code, title, message, details = {}) => {
    const errObj = { code, title, message, ...details };
    setErrorState(errObj);
    setError(message);
  };

  // Connect with specific wallet option
  const connectWithWallet = async (walletId = 'freighter') => {
    console.log(`[RentVault Wallet] Connecting via provider: ${walletId}...`);
    setLoading(true);
    setError(null);
    setErrorState(null);
    const now = Date.now();

    // 1. Sandbox / Demo Mode Wallet
    if (walletId === 'demo') {
      const demoAddr = 'GB7X42F098A190B38812TESTNETRENTVAULTKEY99';
      setAddress(demoAddr);
      setNetwork('TESTNET');
      setConnectedAt(now);
      setSelectedWalletProvider('demo');
      setConnected(true);
      sessionStorage.setItem('rentvault_wallet_address', demoAddr);
      sessionStorage.setItem('rentvault_wallet_network', 'TESTNET');
      sessionStorage.setItem('rentvault_wallet_provider', 'demo');
      sessionStorage.setItem('rentvault_wallet_connected_at', now.toString());
      setShowWalletModal(false);
      setShowInstallModal(false);
      setShowNetworkModal(false);
      setShowSwitchModal(false);
      
      setXlmBalance('10,000.00');
      setRawBalance(10000);
      setIsUnfunded(false);
      setBalanceUpdatedAt(now);
      setTransactions([
        {
          id: 'demo-tx-1',
          hash: '8f92a10e2b4c129d39f4011029419082001',
          direction: 'received',
          type: 'payment',
          amount: '10,000.00',
          asset: 'XLM',
          counterparty: 'GAAXFRIENDBOTSTLRKEY9901829',
          sender: 'GAAXFRIENDBOTSTLRKEY9901829',
          recipient: demoAddr,
          timestamp: new Date().toISOString(),
          status: 'confirmed',
          fee: '100 stroops',
          ledger: '682941',
        }
      ]);
      setLoading(false);
      return { success: true, address: demoAddr };
    }

    // 2. Browser Extensions & WebAuthn Wallets
    if (walletId === 'freighter') {
      try {
        const installed = await checkFreighterInstalled();

        if (!installed) {
          setCategorizedError(
            'WALLET_NOT_FOUND',
            'Freighter Wallet Not Found',
            'Freighter browser extension is not installed in your browser.',
            { downloadUrl: 'https://www.freighter.app/', walletName: 'Freighter' }
          );
          setShowInstallModal(true);
          return { success: false, error: 'Freighter not installed' };
        }

        await setAllowed();
        const addressRes = await getAddress();

        let pubKey = '';
        if (typeof addressRes === 'string') {
          pubKey = addressRes;
        } else if (addressRes && typeof addressRes === 'object') {
          if (addressRes.error) {
            if (addressRes.error.toLowerCase().includes('reject') || addressRes.error.toLowerCase().includes('cancel') || addressRes.error.toLowerCase().includes('denied')) {
              setCategorizedError(
                'USER_REJECTED',
                'Connection Request Denied',
                'User cancelled or rejected the Freighter connection prompt.'
              );
            } else {
              setCategorizedError('GENERIC_ERROR', 'Freighter Error', addressRes.error);
            }
            throw new Error(`Wallet error: ${addressRes.error}`);
          }
          pubKey = addressRes.address || addressRes.publicKey || addressRes.pubkey || '';
        }

        if (!pubKey || pubKey.trim() === '') {
          setCategorizedError(
            'USER_REJECTED',
            'Connection Request Denied',
            'User cancelled or rejected the Freighter connection prompt.'
          );
          throw new Error('User rejected wallet connection or address is unavailable.');
        }

        let currentNet = 'TESTNET';
        try {
          const netRes = await getNetwork();
          if (typeof netRes === 'string') {
            currentNet = netRes;
          } else if (netRes && typeof netRes === 'object') {
            currentNet = netRes.network || netRes.networkName || 'TESTNET';
          }
        } catch (netErr) {
          console.warn('[RentVault Wallet] Network check warning:', netErr);
        }

        const isTestnet = currentNet.toUpperCase().includes('TESTNET');

        setAddress(pubKey);
        setNetwork(currentNet);
        setConnectedAt(now);
        setSelectedWalletProvider('freighter');
        setConnected(true);
        setError(null);
        setErrorState(null);
        setShowWalletModal(false);

        sessionStorage.setItem('rentvault_wallet_address', pubKey);
        sessionStorage.setItem('rentvault_wallet_network', currentNet);
        sessionStorage.setItem('rentvault_wallet_provider', 'freighter');
        sessionStorage.setItem('rentvault_wallet_connected_at', now.toString());

        if (!isTestnet) {
          setShowNetworkModal(true);
        }

        await Promise.all([fetchBalance(pubKey), fetchTransactions(pubKey, 10)]);
        return { success: true, address: pubKey };
      } catch (err) {
        console.error('[RentVault Wallet Error] Connection failed:', err);
        const msg = err?.message || 'Failed to connect Freighter wallet.';
        if (!errorState) {
          if (msg.toLowerCase().includes('reject') || msg.toLowerCase().includes('cancel') || msg.toLowerCase().includes('denied')) {
            setCategorizedError('USER_REJECTED', 'Connection Request Denied', 'User cancelled or rejected the connection prompt.');
          } else {
            setCategorizedError('GENERIC_ERROR', 'Connection Failed', msg);
          }
        }
        return { success: false, error: msg };
      } finally {
        setLoading(false);
      }
    }

    // 3. Alternative Wallets (xBull, Albedo, Hana, Lobstr)
    if (['xbull', 'albedo', 'hana', 'lobstr'].includes(walletId)) {
      const walletNames = {
        xbull: { name: 'xBull Wallet', url: 'https://xbull.app/' },
        albedo: { name: 'Albedo', url: 'https://albedo.link/' },
        hana: { name: 'Hana Wallet', url: 'https://www.hanawallet.io/' },
        lobstr: { name: 'LOBSTR Wallet', url: 'https://lobstr.co/' }
      };
      const info = walletNames[walletId] || { name: walletId, url: '#' };
      
      setCategorizedError(
        'WALLET_NOT_FOUND',
        `${info.name} Extension Required`,
        `${info.name} is not detected on this browser. You can install it or switch to Freighter / Demo Wallet.`,
        { downloadUrl: info.url, walletName: info.name }
      );
      setLoading(false);
      return { success: false, error: `${info.name} not installed` };
    }

    setLoading(false);
    return { success: false, error: 'Unknown provider' };
  };

  // Open modal trigger
  const openWalletModal = () => {
    clearError();
    setShowWalletModal(true);
  };

  // Generic connect alias
  const connectWallet = async (useDemo = false) => {
    if (useDemo) {
      return connectWithWallet('demo');
    }
    openWalletModal();
  };

  // Switch Wallet Action: opens account switch modal
  const openSwitchModal = () => {
    setShowSwitchModal(true);
  };

  // Reconnect Active Account
  const reconnectWallet = async () => {
    setLoading(true);
    try {
      await setAllowed();
      const res = await getAddress();
      let pubKey = '';
      if (typeof res === 'string') {
        pubKey = res;
      } else if (res && typeof res === 'object') {
        pubKey = res.address || res.publicKey || '';
      }

      if (pubKey) {
        const now = Date.now();
        setAddress(pubKey);
        setConnectedAt(now);
        setConnected(true);
        sessionStorage.setItem('rentvault_wallet_address', pubKey);
        sessionStorage.setItem('rentvault_wallet_connected_at', now.toString());
        await Promise.all([fetchBalance(pubKey), fetchTransactions(pubKey, 10)]);
      }

      setShowSwitchModal(false);
      setError(null);
      setErrorState(null);
    } catch (err) {
      console.error('[WalletContext] Reconnect error:', err);
      setError('Failed to reconnect active Freighter account.');
    } finally {
      setLoading(false);
    }
  };

  // Disconnect Flow
  const disconnectWallet = () => {
    console.log('[RentVault Wallet] Disconnecting wallet session...');
    setConnected(false);
    setAddress('');
    setNetwork('');
    setConnectedAt(null);
    setXlmBalance('0.00');
    setRawBalance(0);
    setTransactions([]);
    setIsUnfunded(false);
    setBalanceUpdatedAt(null);
    setError(null);
    setErrorState(null);
    setShowWalletModal(false);
    setShowInstallModal(false);
    setShowNetworkModal(false);
    setShowSwitchModal(false);
    sessionStorage.clear();
  };

  const clearError = () => {
    setError(null);
    setErrorState(null);
  };

  return (
    <WalletContext.Provider
      value={{
        connected,
        address,
        network,
        connectedAt,
        selectedWalletProvider,
        xlmBalance,
        rawBalance,
        isFetchingBalance,
        balanceUpdatedAt,
        isUnfunded,
        transactions,
        isFetchingTransactions,
        fetchBalance,
        fetchTransactions,
        refreshBalance,
        fundTestnetAccount,
        loading,
        error,
        errorState,
        setCategorizedError,
        clearError,
        isInstalled,
        showWalletModal,
        setShowWalletModal,
        openWalletModal,
        showInstallModal,
        setShowInstallModal,
        showNetworkModal,
        setShowNetworkModal,
        showSwitchModal,
        setShowSwitchModal,
        openSwitchModal,
        reconnectWallet,
        connectWallet,
        connectWithWallet,
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
