import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      className={`rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-4 shadow-lg ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};