import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import { AgreementProvider } from './context/AgreementContext';
import { ToastProvider } from './context/ToastContext';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { WalletErrorBanner } from './components/wallet/WalletErrorBanner';
import { FreighterInstallModal } from './components/wallet/FreighterInstallModal';
import { WrongNetworkModal } from './components/wallet/WrongNetworkModal';
import { SwitchWalletModal } from './components/wallet/SwitchWalletModal';
import { MultiWalletModal } from './components/wallet/MultiWalletModal';
import { Skeleton } from './components/ui/Skeleton';
import { Loader2 } from 'lucide-react';
import { useSorobanEvents } from './hooks/useSorobanEvents';

// Zero-render bridge: mounts the Soroban event polling loop inside the
// provider tree so it has access to AgreementContext + ToastContext + WalletContext.
function SorobanEventBridge() {
  useSorobanEvents({ enabled: true });
  return null;
}


// Lazy Loaded Page Components for Code-Splitting & Speed
const Landing = lazy(() => import('./pages/Landing').then(m => ({ default: m.Landing })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const SendPayment = lazy(() => import('./pages/SendPayment').then(m => ({ default: m.SendPayment })));
const AgreementDashboard = lazy(() => import('./pages/AgreementDashboard').then(m => ({ default: m.AgreementDashboard })));
const CreateAgreement = lazy(() => import('./pages/CreateAgreement').then(m => ({ default: m.CreateAgreement })));
const AgreementDetails = lazy(() => import('./pages/AgreementDetails').then(m => ({ default: m.AgreementDetails })));
const Deposit = lazy(() => import('./pages/Deposit').then(m => ({ default: m.Deposit })));
const Timeline = lazy(() => import('./pages/Timeline').then(m => ({ default: m.Timeline })));
const Settlement = lazy(() => import('./pages/Settlement').then(m => ({ default: m.Settlement })));
const Completion = lazy(() => import('./pages/Completion').then(m => ({ default: m.Completion })));
const Transactions = lazy(() => import('./pages/Transactions').then(m => ({ default: m.Transactions })));

// Page Loading Fallback Spinner Component
const PageLoadingFallback = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4">
    <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/40 text-primary-glow flex items-center justify-center shadow-stellar-glow animate-pulse">
      <Loader2 className="w-6 h-6 animate-spin text-primary-glow" />
    </div>
    <span className="text-caption font-mono text-text-secondary">Loading RentVault View...</span>
  </div>
);

export function App() {
  return (
    <ErrorBoundary>
      <WalletProvider>
        <AgreementProvider>
          <ToastProvider>
            <BrowserRouter>
              {/* Level 2C: starts the Soroban blockchain event polling loop */}
              <SorobanEventBridge />
              <div className="flex flex-col min-h-screen bg-background text-text-primary selection:bg-primary selection:text-white">
                <Navbar />
                <WalletErrorBanner />
                <div className="flex-1">
                  <Suspense fallback={<PageLoadingFallback />}>
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
                  </Suspense>
                </div>
                <Footer />

                {/* Wallet Modals */}
                <MultiWalletModal />
                <FreighterInstallModal />
                <WrongNetworkModal />
                <SwitchWalletModal />
              </div>
            </BrowserRouter>
          </ToastProvider>
        </AgreementProvider>
      </WalletProvider>
    </ErrorBoundary>
  );
}

export default App;
