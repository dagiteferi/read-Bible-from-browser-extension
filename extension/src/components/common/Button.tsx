import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'warning';
  className?: string;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  loading = false,
  ...props
}) => {
  const baseStyles = 'btn-spiritual';

  const variants = {
    primary: 'bg-indigo-prayer text-white hover:bg-opacity-90 hover:shadow-amber-glow',
    secondary: 'bg-transparent border border-indigo-prayer text-indigo-prayer hover:bg-indigo-prayer hover:text-white dark:text-night-text dark:border-night-text',
    ghost: 'bg-transparent text-text-secondary hover:bg-indigo-prayer hover:bg-opacity-10 dark:text-night-text-muted',
    warning: 'bg-burgundy-curtain text-white hover:bg-opacity-90 shadow-sm'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <div className="w-20 h-20 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : children}
    </button>
  );
};
