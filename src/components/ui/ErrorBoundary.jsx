import React, { Component } from 'react';
import { PageContainer } from '../layout/PageContainer';
import { Card } from '../cards/Card';
import { PrimaryButton } from '../buttons/PrimaryButton';
import { SecondaryButton } from '../buttons/SecondaryButton';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[RentVault ErrorBoundary caught exception]:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-text-primary flex items-center justify-center p-4">
          <PageContainer className="max-w-xl text-center py-12">
            <Card className="space-y-6 p-8 border-error/40 bg-gradient-to-b from-card to-surface shadow-stellar-glow">
              <div className="w-16 h-16 rounded-3xl bg-error/15 border border-error/40 text-error flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8 animate-bounce" />
              </div>

              <div className="space-y-2">
                <h2 className="text-h2 text-text-primary">Something Went Wrong</h2>
                <p className="text-body text-text-secondary max-w-md mx-auto">
                  An unexpected application error occurred. Don't worry, your cryptographic wallet session and smart contract state remain safe.
                </p>
              </div>

              {this.state.error?.message && (
                <div className="p-3 bg-background/80 rounded-xl border border-border/80 font-mono text-xs text-error/90 text-left truncate">
                  {this.state.error.message}
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <SecondaryButton icon={RotateCcw} onClick={() => window.location.reload()}>
                  Try Reloading
                </SecondaryButton>
                <PrimaryButton icon={Home} onClick={this.handleReset}>
                  Return to Dashboard
                </PrimaryButton>
              </div>
            </Card>
          </PageContainer>
        </div>
      );
    }

    return this.props.children;
  }
}
