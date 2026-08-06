import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ 
  children, 
  className = '', 
  hoverEffect = false,
  ...props 
}) => {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={`
        bg-card border border-border rounded-3xl p-6
        shadow-card-glow transition-all duration-300
        ${hoverEffect ? 'hover:border-border-subtle hover:shadow-stellar' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};
