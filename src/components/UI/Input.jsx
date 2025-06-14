import React from 'react';

const Input = ({ 
  label, 
  error, 
  type = 'text', 
  className = '', 
  required = false,
  style = {},
  ...props 
}) => {
  const inputStyles = {
    width: '100%',
    padding: '10px 12px',
    border: `1px solid ${error ? '#ef4444' : '#ced4da'}`,
    borderRadius: '6px',
    fontSize: '14px',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
    fontFamily: 'inherit',
    backgroundColor: 'inherit',
    color: 'inherit',
    ...style // Allow custom styles to override
  };

  const labelStyles = {
    display: 'block',
    fontWeight: '500',
    color: 'inherit',
    fontSize: '14px',
    marginBottom: '6px'
  };

  const errorStyles = {
    color: '#ef4444',
    fontSize: '12px',
    marginTop: '4px'
  };

  return (
    <div className={className}>
      {label && (
        <label style={labelStyles}>
          {label}
          {required && <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>}
        </label>
      )}
      <input
        type={type}
        style={inputStyles}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${props.id || 'input'}-error` : undefined}
        {...props}
      />
      {error && (
        <div 
          style={errorStyles} 
          id={`${props.id || 'input'}-error`}
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default Input;