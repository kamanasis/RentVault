import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import { AgreementProvider } from './context/AgreementContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { WalletErrorBanner } from './components/wallet/WalletErrorBanner';
import { FreighterInstallModal } from './components/wallet/FreighterInstallModal';
import { WrongNetworkModal } from './components/wallet/WrongNetworkModal';
import { SwitchWalletModal } from './components/wallet/SwitchWalletModal';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { SendPayment } from './pages/SendPayment';
import { AgreementDashboard } from './pages/AgreementDashboard';
import { CreateAgreement } from './pages/CreateAgreement';
import { AgreementDetails } from './pages/AgreementDetails';
import { Deposit } from './pages/Deposit';
import { Timeline } from './pages/Timeline';
import { Settlement } from './pages/Settlement';
import { Completion } from './pages/Completion';
import { Transactions } from './pages/Transactions';

export function App() {
  return (
    <WalletProvider>
      <AgreementProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-background text-text-primary selection:bg-primary selection:text-white">
            <Navbar />
            <WalletErrorBanner />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/payment" element={<SendPayment />} />
                <Route path="/agreements" element={<AgreementDashboard />} />
                <Route path="/agreements/new" element={<CreateAgreement />} />
                <Route path="/agreement/create" element={<CreateAgreement />} />
                
                {/* Standard Plural Routes */}
                <Route path="/agreements/:id" element={<AgreementDetails />} />
                <Route path="/agreements/:id/deposit" element={<Deposit />} />
                <Route path="/agreements/:id/timeline" element={<Timeline />} />
                <Route path="/agreements/:id/settlement" element={<Settlement />} />
                <Route path="/agreements/:id/completed" element={<Completion />} />
                <Route path="/agreements/:id/approval" element={<Settlement />} />
                <Route path="/agreements/:id/release" element={<Settlement />} />

                {/* Legacy Singular Route Aliases */}
                <Route path="/agreement/:id" element={<AgreementDetails />} />
                <Route path="/agreement/:id/deposit" element={<Deposit />} />
                <Route path="/agreement/:id/timeline" element={<Timeline />} />
                <Route path="/agreement/:id/settlement" element={<Settlement />} />
                <Route path="/agreement/:id/completed" element={<Completion />} />
                <Route path="/agreement/:id/approval" element={<Settlement />} />
                <Route path="/agreement/:id/release" element={<Settlement />} />

                <Route path="/transactions" element={<Transactions />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            <Footer />

            {/* Wallet Modals */}
            <FreighterInstallModal />
            <WrongNetworkModal />
            <SwitchWalletModal />
          </div>
        </BrowserRouter>
      </AgreementProvider>
    </WalletProvider>
  );
}

export default App;
