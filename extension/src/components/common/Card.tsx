import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  parchment?: boolean;
  sm?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', parchment = false, sm = false, ...props }) => {
  const base = sm ? 'card-sm' : 'card';
  const extra = parchment ? 'gradient-parchment' : '';
  return (
    <div className={`${base} ${extra} ${className}`} {...props}>
      {children}
    </div>
  );
};
