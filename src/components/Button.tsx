'use client';

import React from 'react';
import Link from 'next/link';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'link';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  className = '',
  disabled = false
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-serif tracking-wide transition-all duration-300 group';
  
  const variantClasses = {
    primary: 'bg-neutral-800 text-white hover:bg-neutral-700 rounded-full',
    secondary: 'text-neutral-900 hover:text-neutral-600 border border-neutral-300 hover:border-neutral-900 rounded-full',
    link: 'text-neutral-700 hover:text-neutral-900 hover:underline'
  };

  const sizeClasses = {
    sm: 'px-6 py-2 text-sm',
    md: 'px-8 py-3 text-sm',
    lg: 'px-10 py-4 text-sm'
  };

  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed pointer-events-none' 
    : '';

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`;

  const content = (
    <>
      <span>{children}</span>
      {variant !== 'link' && (
        <svg 
          className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform duration-300" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M17 8l4 4m0 0l-4 4m4-4H3" 
          />
        </svg>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={combinedClasses}
    >
      {content}
    </button>
  );
};

export default Button; 