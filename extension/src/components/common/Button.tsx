import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'accent' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const variantClass = `btn-${variant}`;
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : size === 'icon' ? 'btn-icon' : '';
  const fullClass = fullWidth ? 'btn-full' : '';

  return (
    <button
      className={`btn ${variantClass} ${sizeClass} ${fullClass} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <div style={{
          width: 16, height: 16,
          border: '2px solid currentColor',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }} />
      ) : children}
    </button>
  );
};
