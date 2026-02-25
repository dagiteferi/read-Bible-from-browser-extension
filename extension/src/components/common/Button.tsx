import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, className = '', ...props }) => {
  return (
    <button
      className={`px-4 py-2 rounded-md bg-amber-warm text-white hover:opacity-90 transition-opacity ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};
