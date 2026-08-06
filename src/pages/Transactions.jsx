import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/cards/Card';
import { StatusBadge } from '../components/status/StatusBadge';
import { SecondaryButton } from '../components/buttons/SecondaryButton';
import { ExternalLink, ArrowUpRight, ArrowDownLeft, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Transactions = () => {
  const navigate = useNavigate();

  const mockTxLogs = [
    { id: 'tx-01', hash: '8f92a...10e2', type: 'Escrow Lock', amount: '2,500 XLM', status: 'success', date: '2026-09-01 10:15 AM' },
    { id: 'tx-02', hash: '3e41c...99a0', type: 'Utility Settlement', amount: '70 XLM', status: 'success', date: '2026-09-02 02:40 PM' },
    { id: 'tx-03', hash: '7c12b...44f8', type: 'Deposit Refund', amount: '2,430 XLM', status: 'success', date: '2026-09-02 03:00 PM' },
  ];

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-h1 text-text-primary mb-2">On-Chain Transaction History</h1>
          <p className="text-body text-text-secondary">
            Verified Soroban smart contract operations on Stellar Testnet.
          </p>
        </div>
        <SecondaryButton onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </SecondaryButton>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-caption text-text-muted">
                <th className="py-4 px-4">Transaction Hash</th>
                <th className="py-4 px-4">Type</th>
                <th className="py-4 px-4">Amount</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Timestamp</th>
                <th className="py-4 px-4 text-right">Explorer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-body">
              {mockTxLogs.map((tx) => (
                <tr key={tx.id} className="hover:bg-surface/40 transition-colors">
                  <td className="py-4 px-4 font-mono text-caption text-primary-glow">{tx.hash}</td>
                  <td className="py-4 px-4 text-text-primary font-medium">{tx.type}</td>
                  <td className="py-4 px-4 font-semibold text-text-primary">{tx.amount}</td>
                  <td className="py-4 px-4">
                    <StatusBadge variant={tx.status === 'success' ? 'success' : 'warning'} size="sm">
                      {tx.status}
                    </StatusBadge>
                  </td>
                  <td className="py-4 px-4 text-caption text-text-muted">{tx.date}</td>
                  <td className="py-4 px-4 text-right">
                    <a 
                      href="https://stellar.expert/explorer/testnet" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-primary-glow"
                    >
                      Verify <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </PageContainer>
  );
};
