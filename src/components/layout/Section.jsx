import React from 'react';
import { motion } from 'framer-motion';

export const Section = ({ children, className = '', id }) => {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`py-12 md:py-16 ${className}`}
    >
      {children}
    </motion.section>
  );
};
