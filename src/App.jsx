import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { WalletErrorBanner } from './components/wallet/WalletErrorBanner';
import { FreighterInstallModal } from './components/wallet/FreighterInstallModal';
import { WrongNetworkModal } from './components/wallet/WrongNetworkModal';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { SendPayment } from './pages/SendPayment';
import { CreateAgreement } from './pages/CreateAgreement';
import { AgreementDetails } from './pages/AgreementDetails';
import { Deposit } from './pages/Deposit';
import { Timeline } from './pages/Timeline';
import { Settlement } from './pages/Settlement';
import { Completion } from './pages/Completion';
import { Transactions } from './pages/Transactions';
import { PageContainer } from './components/layout/PageContainer';
import { Card } from './components/cards/Card';
import { StatusBadge } from './components/status/StatusBadge';
import { SecondaryButton } from './components/buttons/SecondaryButton';

// Generic placeholder component for sub-routes
const PlaceholderPage = ({ title, subtitle }) => (
  <PageContainer className="max-w-3xl text-center py-16">
    <StatusBadge variant="primary" className="mb-4">Phase 4 Route Placeholder</StatusBadge>
    <h1 className="text-h1 text-text-primary mb-3">{title}</h1>
    <p className="text-body text-text-secondary mb-8">{subtitle}</p>
    <Card className="max-w-md mx-auto p-8 border border-border">
      <p className="text-caption text-text-muted mb-6">
        This view is registered in React Router DOM with full design system support and will be populated in subsequent smart contract phases.
      </p>
      <SecondaryButton onClick={() => window.history.back()}>
        Go Back
      </SecondaryButton>
    </Card>
  </PageContainer>
);

export function App() {
  return (
    <WalletProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-background text-text-primary selection:bg-primary selection:text-white">
          <Navbar />
          <WalletErrorBanner />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/payment" element={<SendPayment />} />
              <Route path="/agreement/create" element={<CreateAgreement />} />
              <Route path="/agreement/:id" element={<AgreementDetails />} />
              <Route path="/agreement/:id/deposit" element={<Deposit />} />
              <Route path="/agreement/:id/timeline" element={<Timeline />} />
              <Route path="/agreement/:id/settlement" element={<Settlement />} />
              <Route 
                path="/agreement/:id/approval" 
                element={<PlaceholderPage title="Approval Pending" subtitle="Mutual approval state between landlord and tenant." />} 
              />
              <Route 
                path="/agreement/:id/release" 
                element={<PlaceholderPage title="Fund Release" subtitle="Smart contract release authorization interface." />} 
              />
              <Route path="/agreement/:id/completed" element={<Completion />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Footer />

          {/* Wallet Error & Install Modals */}
          <FreighterInstallModal />
          <WrongNetworkModal />
        </div>
      </BrowserRouter>
    </WalletProvider>
  );
}

export default App;
