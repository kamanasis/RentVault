import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Loader2, LogOut, CheckCircle2 } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { useNavigate } from 'react-router-dom';

export const WalletButton = ({ 
  fullWidth = false, 
  pulse = false,
  className = '' 
}) => {
  const { connected, address, loading, connectWallet, disconnectWallet, truncateAddress } = useWallet();
  const navigate = useNavigate();

  const handleClick = async () => {
    if (connected) {
      // If clicked while connected, navigate to dashboard or show dropdown
      navigate('/dashboard');
    } else {
      const res = await connectWallet();
      if (res?.success) {
        navigate('/dashboard');
      }
    }
  };

  if (loading) {
    return (
      <button
        disabled
        className={`
          inline-flex items-center justify-center gap-2.5 
          px-6 py-3.5 rounded-full font-semibold text-caption text-white 
          bg-primary/70 border border-primary/50 cursor-wait
          min-h-[44px] min-w-[160px] ${fullWidth ? 'w-full' : ''} ${className}
        `}
      >
        <Loader2 className="w-5 h-5 animate-spin text-white" />
        <span>Connecting...</span>
      </button>
    );
  }

  if (connected) {
    return (
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/dashboard')}
          className={`
            inline-flex items-center justify-center gap-2 
            px-5 py-3 rounded-full font-mono text-caption text-text-primary 
            bg-surface border border-border hover:border-primary/50
            shadow-sm transition-all duration-200 cursor-pointer min-h-[44px]
            ${className}
          `}
        >
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span>{truncateAddress(address)}</span>
        </motion.button>

        <button
          onClick={disconnectWallet}
          title="Disconnect Wallet"
          className="p-3 rounded-full bg-surface border border-border text-text-muted hover:text-error hover:border-error/40 transition-colors cursor-pointer"
          aria-label="Disconnect wallet"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.025, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      className={`
        relative inline-flex items-center justify-center gap-2.5 
        px-7 py-3.5 rounded-full font-semibold text-caption text-white 
        bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB]
        shadow-stellar hover:shadow-stellar-glow
        transition-all duration-300 ease-out
        min-h-[44px] min-w-[160px] select-none cursor-pointer
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-glow focus-visible:ring-offset-2
        ${pulse ? 'animate-[pulse_3s_infinite_easeInOut]' : ''}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      <Wallet className="w-5 h-5 text-white flex-shrink-0" />
      <span className="tracking-wide">Connect Freighter Wallet</span>
    </motion.button>
  );
};
