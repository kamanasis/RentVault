import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/cards/Card';
import { StatusBadge } from '../components/status/StatusBadge';
import { SecondaryButton } from '../components/buttons/SecondaryButton';
import { CheckCircle2, Clock, Shield, AlertCircle, FileText, ArrowRight } from 'lucide-react';

export const Timeline = () => {
  const { id = 'AGR-2026-9041' } = useParams();
  const navigate = useNavigate();

  const timelineSteps = [
    { title: 'Agreement Created', date: 'Sep 01, 2026', desc: 'Landlord initialized Soroban contract terms', status: 'completed' },
    { title: 'Deposit Locked', date: 'Sep 01, 2026', desc: 'Tenant deposited 2,500 XLM into escrow vault', status: 'completed' },
    { title: 'Lease Active', date: 'Sep 01, 2026 – Aug 31, 2027', desc: 'Active rental duration in progress', status: 'active' },
    { title: 'Lease Completion', date: 'Aug 31, 2027', desc: 'Lease end date reached & bill entry phase', status: 'pending' },
    { title: 'Utility Settlement', date: 'Pending', desc: 'Utility bill submission & deduction calculation', status: 'pending' },
    { title: 'Refund Release', date: 'Pending', desc: 'Mutual approval or auto-release execution', status: 'pending' },
  ];

  return (
    <PageContainer className="max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-h1 text-text-primary mb-2">Rental Escrow Timeline</h1>
          <p className="text-body text-text-secondary">Agreement ID: <span className="font-mono text-primary-glow">{id}</span></p>
        </div>
        <SecondaryButton onClick={() => navigate(`/agreement/${id}`)}>
          Back to Agreement
        </SecondaryButton>
      </div>

      <Card>
        <div className="relative pl-6 sm:pl-8 border-l-2 border-border space-y-8 my-4">
          {timelineSteps.map((step, idx) => (
            <div key={idx} className="relative group">
              {/* Step indicator node */}
              <div className={`
                absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center bg-card
                ${step.status === 'completed' ? 'border-success text-success' : step.status === 'active' ? 'border-primary text-primary animate-pulse' : 'border-border text-text-muted'}
              `}>
                {step.status === 'completed' ? (
                  <CheckCircle2 className="w-4 h-4 fill-success text-card" />
                ) : (
                  <div className={`w-2 h-2 rounded-full ${step.status === 'active' ? 'bg-primary' : 'bg-border'}`} />
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className={`text-h3 ${step.status === 'active' ? 'text-primary-glow' : 'text-text-primary'}`}>
                    {step.title}
                  </h3>
                  <p className="text-caption text-text-secondary mt-1">{step.desc}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-xs text-text-muted font-mono">{step.date}</span>
                  <StatusBadge 
                    variant={step.status === 'completed' ? 'success' : step.status === 'active' ? 'primary' : 'neutral'}
                    size="sm"
                  >
                    {step.status}
                  </StatusBadge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </PageContainer>
  );
};
