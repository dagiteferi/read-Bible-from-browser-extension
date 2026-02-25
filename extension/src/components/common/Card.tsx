import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  parchment?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', parchment = false, ...props }) => {
  return (
    <div
      className={`sacred-card ${parchment ? 'parchment' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
