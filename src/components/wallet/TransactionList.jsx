import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../cards/Card';
import { StatusBadge } from '../status/StatusBadge';
import { TransactionDetailModal } from './TransactionDetailModal';
import { useWallet } from '../../context/WalletContext';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  ExternalLink, 
  Send, 
  Clock, 
  FileText,
  Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TransactionList = ({ limit = 10, isPreview = false }) => {
  const navigate = useNavigate();
  const { transactions, isFetchingTransactions, connected, truncateAddress } = useWallet();
  const [selectedTx, setSelectedTx] = useState(null);

  const displayedTxs = isPreview ? transactions.slice(0, limit) : transactions;

  if (!connected) return null;

  return (
    <div className="space-y-4">
      {/* Transaction List Card */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-surface border border-border flex items-center justify-center text-primary-glow">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-h3 text-text-primary">Recent Transactions</h3>
              <p className="text-caption text-text-secondary">Horizon API • Stellar Testnet Ledger Activity</p>
            </div>
          </div>

          {isPreview && transactions.length > 0 && (
            <button
              onClick={() => navigate('/transactions')}
              className="text-xs font-semibold text-primary-glow hover:underline cursor-pointer"
            >
              Open History ({transactions.length})
            </button>
          )}
        </div>

        {/* Loading Skeleton */}
        {isFetchingTransactions && transactions.length === 0 ? (
          <div className="space-y-3 py-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-surface/60 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : displayedTxs.length === 0 ? (
          /* Empty State */
          <div className="text-center py-10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-text-muted mx-auto">
              <Send className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-h3 text-text-primary">No transactions yet</h4>
              <p className="text-caption text-text-secondary max-w-sm mx-auto">
                Send your first XLM payment on Stellar Testnet to generate live Horizon ledger records.
              </p>
            </div>
            <button
              onClick={() => navigate('/payment')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-caption font-semibold shadow-stellar hover:shadow-stellar-glow transition-all cursor-pointer mt-2"
            >
              <Send className="w-4 h-4" />
              <span>Send Test XLM</span>
            </button>
          </div>
        ) : (
          /* Transaction Rows */
          <div className="divide-y divide-border/60">
            {displayedTxs.map((tx) => (
              <motion.div
                key={tx.id || tx.hash}
                whileHover={{ x: 3, backgroundColor: 'rgba(22, 38, 61, 0.4)' }}
                onClick={() => setSelectedTx(tx)}
                className="py-4 px-2 rounded-2xl flex items-center justify-between gap-4 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border flex-shrink-0 ${
                    tx.direction === 'sent' ? 'bg-error/10 border-error/30 text-error' : 'bg-success/10 border-success/30 text-success'
                  }`}>
                    {tx.direction === 'sent' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-body font-semibold text-text-primary capitalize">
                        {tx.direction === 'sent' ? 'Sent Payment' : 'Received Payment'}
                      </span>
                      <StatusBadge variant="success" size="sm">
                        Confirmed
                      </StatusBadge>
                    </div>
                    <div className="text-xs text-text-muted font-mono truncate">
                      {tx.direction === 'sent' ? `To: ${truncateAddress(tx.counterparty)}` : `From: ${truncateAddress(tx.counterparty)}`}
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className={`text-body font-bold font-mono ${tx.direction === 'sent' ? 'text-text-primary' : 'text-success'}`}>
                    {tx.direction === 'sent' ? '-' : '+'}{tx.amount} {tx.asset}
                  </div>
                  <div className="text-[11px] text-text-muted font-mono flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3 text-text-muted" />
                    <span>{tx.timestamp ? new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      {/* Transaction Detail Modal */}
      {selectedTx && (
        <TransactionDetailModal
          tx={selectedTx}
          onClose={() => setSelectedTx(null)}
        />
      )}
    </div>
  );
};
