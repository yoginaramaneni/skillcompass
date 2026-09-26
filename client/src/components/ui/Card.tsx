import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-neutral-200 rounded-xl p-6 text-neutral-900 shadow-xs ${className}`}
    >
      {children}
    </div>
  );
};
