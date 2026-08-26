import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../../context/WalletContext';

export const AmbientEcosystem = () => {
  const navigate = useNavigate();
  const { connected, openWalletModal } = useWallet();

  return (
    <div className="relative my-8 py-20 px-6 sm:px-12 rounded-3xl bg-gradient-to-b from-surface/80 via-card to-background border border-primary/20 shadow-2xl overflow-hidden text-center flex flex-col items-center justify-center">
      {/* Ambient Pulsing Background Radial Light */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-primary-glow/5 to-transparent rounded-3xl blur-2xl pointer-events-none" />

      {/* Decorative Icon */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-primary to-primary-glow flex items-center justify-center text-white shadow-stellar mb-8"
      >
        <Shield className="w-8 h-8" />
      </motion.div>

      {/* Single Powerful Headline (Daylight Restraint Pattern) */}
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight max-w-3xl leading-tight mb-4"
      >
        Every lease secured on-chain makes the rental ecosystem fairer for everyone.
      </motion.h2>

      {/* Single Subtitle Line */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-body text-text-secondary max-w-xl text-base sm:text-lg mb-8"
      >
        Zero bank delays. Zero unauthorized deductions. Powered by Soroban WASM smart contracts on Stellar.
      </motion.p>

      {/* Single High-Priority Action */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center gap-4"
      >
        <button
          type="button"
          onClick={() => {
            if (connected) {
              navigate('/dashboard');
            } else {
              openWalletModal();
            }
          }}
          className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary via-primary-glow to-primary text-white font-bold text-sm shadow-stellar hover:shadow-stellar-glow hover:scale-105 transition-all duration-300 cursor-pointer"
        >
          <Zap className="w-4 h-4" />
          <span>{connected ? 'Go to Escrow Dashboard' : 'Connect Stellar Wallet'}</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </motion.div>
    </div>
  );
};
