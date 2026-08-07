import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/cards/Card';
import { InputField } from '../components/forms/InputField';
import { PrimaryButton } from '../components/buttons/PrimaryButton';
import { SecondaryButton } from '../components/buttons/SecondaryButton';
import { TransactionStatus } from '../components/wallet/TransactionStatus';
import { TransactionHashCard } from '../components/wallet/TransactionHashCard';
import { WalletButton } from '../components/wallet/WalletButton';
import { NetworkBadge } from '../components/wallet/NetworkBadge';
import { useWallet } from '../context/WalletContext';
import { sendTestPayment } from '../services/stellar';
import { Send, Wallet, ArrowLeft, RotateCcw, Coins, ShieldCheck } from 'lucide-react';
import * as StellarSdk from '@stellar/stellar-sdk';

export const SendPayment = () => {
  const navigate = useNavigate();
  const { connected, address, network, xlmBalance, rawBalance, refreshBalance } = useWallet();

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'pending' | 'success' | 'failure'
  const [txResult, setTxResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!recipient || recipient.trim() === '') {
      errors.recipient = 'Recipient Stellar address is required.';
    } else if (!StellarSdk.StrKey.isValidEd25519PublicKey(recipient.trim())) {
      errors.recipient = 'Invalid Stellar public key format (must start with G and be 56 characters long).';
    } else if (recipient.trim() === address) {
      errors.recipient = 'Cannot send payment to your own connected address.';
    }

    const numAmount = parseFloat(amount);
    const feeReserve = 1.0;
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      errors.amount = 'Amount must be greater than 0 XLM.';
    } else if (rawBalance <= 0 || numAmount > (rawBalance - feeReserve)) {
      errors.amount = `Insufficient XLM balance. Available: ${xlmBalance} XLM (reserve required for Stellar network fees).`;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSendPayment = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setStatus('pending');
    setErrorMessage('');

    try {
      const res = await sendTestPayment({
        sourceAddress: address,
        recipientAddress: recipient.trim(),
        amount: amount.trim(),
      });

      console.log('[SendPayment] Payment submission result:', res);
      setTxResult({
        hash: res.hash,
        amount: amount.trim(),
        recipient: recipient.trim(),
        ledger: res.ledger,
      });
      setStatus('success');

      // Auto-refresh balance after successful payment
      await refreshBalance();
    } catch (err) {
      console.error('[SendPayment Error]:', err);
      setErrorMessage(err?.message || 'Transaction submission failed on Stellar Testnet.');
      setStatus('failure');
    }
  };

  const handleReset = () => {
    setRecipient('');
    setAmount('');
    setStatus('idle');
    setTxResult(null);
    setErrorMessage('');
    setFormErrors({});
  };

  return (
    <PageContainer className="max-w-3xl">
      {/* Top Navigation Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-1.5 text-caption font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-h1 text-text-primary">Send Test XLM</h1>
            <NetworkBadge network={network || 'TESTNET'} />
          </div>
          <p className="text-body text-text-secondary mt-1">
            Execute native XLM payments on Stellar Testnet signed with your Freighter wallet.
          </p>
        </div>

        <div>
          {!connected && <WalletButton pulse />}
        </div>
      </div>

      {!connected ? (
        <Card className="text-center py-12 space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-primary/10 border border-primary/30 text-primary-glow flex items-center justify-center mx-auto">
            <Wallet className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-h2 text-text-primary">Connect Wallet to Send Payments</h2>
            <p className="text-body text-text-secondary max-w-md mx-auto">
              You must authenticate your Freighter wallet to construct and sign Stellar Testnet transactions.
            </p>
          </div>
          <div className="pt-2">
            <WalletButton pulse />
          </div>
        </Card>
      ) : status === 'success' && txResult ? (
        <TransactionHashCard
          hash={txResult.hash}
          amount={txResult.amount}
          recipient={txResult.recipient}
          ledger={txResult.ledger}
          onReset={handleReset}
        />
      ) : (
        <Card className="space-y-6">
          {/* Source Balance Banner */}
          <div className="p-4 bg-background/80 rounded-2xl border border-border/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-success">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-text-muted block">Available Source Balance</span>
                <span className="text-h3 font-bold text-text-primary">{xlmBalance} XLM</span>
              </div>
            </div>
            <span className="text-xs font-mono text-primary-glow bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full">
              Testnet
            </span>
          </div>

          <form onSubmit={handleSendPayment} className="space-y-6">
            <InputField
              label="Recipient Stellar Public Key Address"
              name="recipient"
              placeholder="e.g. GDKX89A190B38812TESTNETRENTVAULTKEY99..."
              icon={Wallet}
              value={recipient}
              onChange={(e) => {
                setRecipient(e.target.value);
                if (formErrors.recipient) setFormErrors({ ...formErrors, recipient: null });
              }}
              error={formErrors.recipient}
              helperText="Enter 56-character Stellar public key starting with 'G'"
              required
            />

            <InputField
              label="Amount (XLM)"
              name="amount"
              type="number"
              step="0.0000001"
              placeholder="e.g. 10.5"
              icon={Coins}
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (formErrors.amount) setFormErrors({ ...formErrors, amount: null });
              }}
              error={formErrors.amount}
              helperText="Fee margin of ~0.00001 XLM automatically applied"
              required
            />

            {/* Status indicator */}
            <TransactionStatus status={status} errorMsg={errorMessage} />

            {/* Form Actions */}
            <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <SecondaryButton
                type="button"
                icon={RotateCcw}
                onClick={handleReset}
                disabled={status === 'pending'}
                className="w-full sm:w-auto"
              >
                Reset Form
              </SecondaryButton>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <SecondaryButton
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  disabled={status === 'pending'}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </SecondaryButton>
                <PrimaryButton
                  type="submit"
                  icon={Send}
                  disabled={status === 'pending'}
                  className="w-full sm:w-auto min-w-[160px]"
                >
                  {status === 'pending' ? 'Signing & Submitting...' : 'Send XLM'}
                </PrimaryButton>
              </div>
            </div>
          </form>
        </Card>
      )}
    </PageContainer>
  );
};
