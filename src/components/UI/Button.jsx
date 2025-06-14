import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  loading = false,
  className = '',
  style = {},
  ...props 
}) => {
  const baseStyles = {
    border: 'none',
    borderRadius: '6px',
    fontWeight: '500',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    opacity: disabled || loading ? 0.6 : 1,
    fontFamily: 'inherit'
  };

  const variants = {
    primary: {
      backgroundColor: '#2563eb',
      color: 'white'
    },
    secondary: {
      backgroundColor: '#e2e8f0',
      color: '#475569'
    },
    danger: {
      backgroundColor: '#ef4444',
      color: 'white'
    },
    ghost: {
      backgroundColor: 'transparent',
      color: '#475569',
      border: '1px solid #e2e8f0'
    }
  };

  const sizes = {
    small: {
      padding: '6px 12px',
      fontSize: '12px'
    },
    medium: {
      padding: '10px 20px',
      fontSize: '14px'
    },
    large: {
      padding: '12px 24px',
      fontSize: '16px'
    }
  };

  const buttonStyles = {
    ...baseStyles,
    ...variants[variant],
    ...sizes[size],
    ...style // Allow custom styles to override
  };

  return (
    <button
      style={buttonStyles}
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
      {...props}
    >
      {loading && (
        <div 
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid currentColor',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
};

export default Button;