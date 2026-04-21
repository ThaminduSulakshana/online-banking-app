import React from 'react';

export const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: {
      backgroundColor: 'var(--primary-color)',
      color: 'var(--text-white)',
      '&:hover': { backgroundColor: 'var(--primary-hover)' }
    },
    accent: {
      backgroundColor: 'var(--accent-color)',
      color: 'var(--text-white)',
      '&:hover': { backgroundColor: 'var(--accent-hover)' }
    },
    outline: {
      backgroundColor: 'transparent',
      border: '1px solid var(--border-color)',
      color: 'var(--text-main)',
      '&:hover': { backgroundColor: 'var(--bg-color)' }
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--text-main)',
      '&:hover': { backgroundColor: 'var(--bg-color)' }
    }
  };

  const sizes = {
    sm: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
    md: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
    lg: { padding: '1rem 2rem', fontSize: '1.125rem' }
  };

  // Note: Since we are using Vanilla CSS, we'll use inline styles for these dynamic parts
  // but usually classNames with utility CSS or specialized CSS-in-JS is better.
  // For this project, I'll use classNames mapped to specific manual CSS in index.css if needed, 
  // but let's stick to inline style for the 'props-based' variations to keep it simple and powerful.
  
  const currentVariant = variants[variant];
  const currentSize = sizes[size];

  return (
    <button 
      className={`btn-${variant} btn-${size} ${className}`}
      {...props}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-md)',
        fontWeight: '500',
        transition: 'var(--transition-fast)',
        cursor: 'pointer',
        border: variant === 'outline' ? '1px solid var(--border-color)' : 'none',
        backgroundColor: currentVariant.backgroundColor,
        color: currentVariant.color,
        padding: currentSize.padding,
        fontSize: currentSize.fontSize,
        ...props.style
      }}
    >
      {children}
    </button>
  );
};

export const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`input-group ${className}`} style={{ marginBottom: '1.25rem' }}>
      {label && (
        <label style={{ 
          display: 'block', 
          marginBottom: '0.5rem', 
          fontSize: '0.875rem', 
          fontWeight: '500', 
          color: 'var(--text-main)' 
        }}>
          {label}
        </label>
      )}
      <input
        {...props}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          border: `1px solid ${error ? 'var(--error-color)' : 'var(--border-color)'}`,
          backgroundColor: 'var(--surface-color)',
          fontSize: '1rem',
          transition: 'var(--transition-fast)',
          boxShadow: 'var(--shadow-sm)'
        }}
      />
      {error && (
        <p style={{ 
          marginTop: '0.375rem', 
          fontSize: '0.75rem', 
          color: 'var(--error-color)' 
        }}>
          {error}
        </p>
      )}
    </div>
  );
};

export const Card = ({ children, title, className = '', ...props }) => {
  return (
    <div className={`premium-card ${className}`} {...props} style={{ padding: '1.5rem', ...props.style }}>
      {title && (
        <h3 style={{ 
          marginBottom: '1.25rem', 
          fontSize: '1.25rem', 
          fontWeight: '600', 
          color: 'var(--primary-color)' 
        }}>
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};
