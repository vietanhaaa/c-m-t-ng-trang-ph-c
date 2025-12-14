import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = "px-6 py-3 font-semibold text-sm transition-all duration-200 tracking-wide disabled:opacity-50 disabled:cursor-not-allowed border";
  
  const variants = {
    primary: "bg-white text-black border-white hover:bg-neutral-200 hover:border-neutral-200",
    secondary: "bg-neutral-800 text-white border-neutral-800 hover:bg-neutral-700 hover:border-neutral-700",
    outline: "bg-transparent text-white border-neutral-600 hover:border-white hover:bg-neutral-900"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};