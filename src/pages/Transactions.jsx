import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { TransactionList } from '../components/wallet/TransactionList';
import { WalletButton } from '../components/wallet/WalletButton';
import { NetworkBadge } from '../components/wallet/NetworkBadge';
import { SecondaryButton } from '../components/buttons/SecondaryButton';
import { useWallet } from '../context/WalletContext';
import { ArrowLeft, RefreshCw, Send, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/cards/Card';

export const Transactions = () => {
  const navigate = useNavigate();
  const { connected, network, refreshBalance, isFetchingTransactions } = useWallet();

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
        <div>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-1.5 text-caption font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-h1 text-text-primary">Transaction History</h1>
            <NetworkBadge network={network || 'TESTNET'} />
          </div>
          <p className="text-body text-text-secondary mt-1">
            Complete Horizon API ledger history of payments, account funding, and testnet transactions for your wallet.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {connected ? (
            <>
              <SecondaryButton 
                icon={RefreshCw} 
                onClick={refreshBalance}
                disabled={isFetchingTransactions}
              >
                {isFetchingTransactions ? 'Syncing...' : 'Sync History'}
              </SecondaryButton>
              <SecondaryButton icon={Send} onClick={() => navigate('/payment')}>
                Send XLM
              </SecondaryButton>
            </>
          ) : (
            <WalletButton pulse />
          )}
        </div>
      </div>

      {!connected ? (
        <Card className="text-center py-12 max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-primary/10 border border-primary/30 text-primary-glow flex items-center justify-center mx-auto">
            <Wallet className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-h2 text-text-primary">Connect Wallet to View History</h2>
            <p className="text-body text-text-secondary max-w-md mx-auto">
              Please connect your Freighter wallet to view your live Horizon Testnet transaction ledger.
            </p>
          </div>
          <div className="pt-2">
            <WalletButton pulse />
          </div>
        </Card>
      ) : (
        <TransactionList limit={20} isPreview={false} />
      )}
    </PageContainer>
  );
};
