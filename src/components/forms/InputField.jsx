import React from 'react';

export const InputField = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon: Icon = null,
  required = false,
  helperText,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={name} className="text-caption text-text-secondary font-medium flex items-center justify-between">
          <span>
            {label} {required && <span className="text-error">*</span>}
          </span>
        </label>
      )}
      
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4 text-text-muted">
            <Icon className="w-5 h-5" />
          </div>
        )}
        
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`
            w-full bg-surface border text-text-primary rounded-2xl px-4 py-3.5 text-body
            placeholder:text-text-muted transition-all duration-200 outline-none min-h-[44px]
            ${Icon ? 'pl-11' : ''}
            ${error ? 'border-error focus:border-error focus:ring-1 focus:ring-error' : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20'}
          `}
          {...props}
        />
      </div>

      {error ? (
        <span className="text-xs text-error font-medium mt-0.5">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-text-muted mt-0.5">{helperText}</span>
      ) : null}
    </div>
  );
};
