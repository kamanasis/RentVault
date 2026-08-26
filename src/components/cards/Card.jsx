import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export const Card = ({ 
  children, 
  className = '', 
  hoverEffect = false,
  spotlightColor = 'rgba(99, 102, 241, 0.12)', // Subtle indigo spotlight default
  ...props 
}) => {
  const cardRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={hoverEffect ? { y: -4, transition: { duration: 0.25, ease: 'easeOut' } } : {}}
      className={`
        relative overflow-hidden
        bg-card border border-border rounded-3xl p-6 sm:p-8
        shadow-card-glow transition-all duration-300
        ${hoverEffect ? 'hover:border-primary/40 hover:shadow-stellar' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Radial Magnetic Cursor Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 60%)`,
        }}
      />
      {/* Card Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
