import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface NeuralFrameProps {
  children: ReactNode;
  className?: string;
  noGrid?: boolean;
}

export function NeuralFrame({ children, className = '', noGrid = false }: NeuralFrameProps) {
  return (
    <div className={`relative min-h-dvh w-full overflow-hidden ${className}`}>
      {/* Base grid */}
      {!noGrid && <div className="absolute inset-0 grid-bg opacity-60" />}
      
      {/* Fine grid overlay */}
      {!noGrid && <div className="absolute inset-0 grid-bg-fine opacity-40" />}
      
      {/* Radial vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(0, 240, 255, 0.03) 0%, transparent 60%)',
        }}
      />
      
      {/* Bottom glow */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.15), transparent)',
        }}
      />

      {/* Scanlines */}
      <div className="absolute inset-0 scanlines pointer-events-none" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
}
