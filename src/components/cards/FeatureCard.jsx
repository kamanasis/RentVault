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
    <Card hoverEffect className={`group relative overflow-hidden ${className}`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500" />
      
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-primary group-hover:border-primary/50 group-hover:scale-110 transition-all duration-300 mb-5 shadow-sm">
          {Icon && <Icon className="w-6 h-6" />}
        </div>
        
        {badge && (
          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary-glow border border-primary/20 mb-3">
            {badge}
          </span>
        )}

        <h3 className="text-h3 text-text-primary mb-3 group-hover:text-primary-glow transition-colors">
          {title}
        </h3>

        <p className="text-body text-text-secondary leading-relaxed">
          {description}
        </p>
      </div>
    </Card>
  );
};
