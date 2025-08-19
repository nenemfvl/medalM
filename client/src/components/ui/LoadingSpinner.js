import React from 'react';
import { clsx } from 'clsx';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary',
  className = '',
  ...props 
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6', 
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'border-primary-500',
    secondary: 'border-secondary-500',
    white: 'border-white',
    gray: 'border-gray-500'
  };

  return (
    <div
      className={clsx(
        'loading-spinner',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      {...props}
    />
  );
};

export default LoadingSpinner;
