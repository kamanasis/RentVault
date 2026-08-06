import React from 'react';
import { Card } from '../cards/Card';
import { Clock, AlertTriangle, ShieldAlert } from 'lucide-react';

export const ProblemStatement = () => {
  const problems = [
    {
      title: 'Delayed Refunds',
      desc: 'Traditional landlords routinely hold security deposits for months post-lease without clear timeline commitments.',
      icon: Clock,
      borderAccent: 'hover:border-error/40',
    },
    {
      title: 'Unclear Deductions',
      desc: 'Utility bills and repair costs are frequently deducted arbitrarily without verifiable paper trails or receipts.',
      icon: AlertTriangle,
      borderAccent: 'hover:border-warning/40',
    },
    {
      title: 'Lack of Trust',
      desc: 'Tenants must blindly trust centralized intermediaries to return their funds fairly without neutral automated rules.',
      icon: ShieldAlert,
      borderAccent: 'hover:border-error/40',
    },
  ];

  return (
    <div className="space-y-10">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-error font-semibold mb-2 block">
          Current Rental Pain Points
        </span>
        <h2 className="text-h1 text-text-primary mb-4">
          Why rental deposits cause disputes
        </h2>
        <p className="text-body text-text-secondary">
          Traditional security deposits rely on centralized trust, leading to friction, delayed payments, and non-transparent deductions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {problems.map((p, idx) => {
          const Icon = p.icon;
          return (
            <Card 
              key={idx} 
              hoverEffect 
              className={`group transition-all duration-300 ${p.borderAccent}`}
            >
              <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-error/80 mb-5 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-h3 text-text-primary mb-3 group-hover:text-error transition-colors">
                {p.title}
              </h3>
              <p className="text-body text-text-secondary leading-relaxed">
                {p.desc}
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
