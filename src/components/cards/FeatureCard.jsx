import React from 'react';
import { Card } from './Card';

export const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  badge = null,
  className = '' 
}) => {
  return (
    <Card hoverEffect className={`group relative overflow-hidden flex flex-col justify-between ${className}`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500 pointer-events-none" />
      
      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-primary-glow group-hover:border-primary/50 group-hover:scale-105 transition-all duration-300 shadow-sm">
            {Icon && <Icon className="w-6 h-6" />}
          </div>

          {badge && (
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-primary/10 text-primary-glow border border-primary/20">
              {badge}
            </span>
          )}
        </div>

        <div>
          <h3 className="text-h3 text-text-primary mb-2 group-hover:text-primary-glow transition-colors">
            {title}
          </h3>

          <p className="text-body text-text-secondary leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
};
