import React from 'react';

export const SelectField = ({
  label,
  name,
  options = [],
  value,
  onChange,
  error,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={name} className="text-caption text-text-secondary font-medium">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`
          w-full bg-surface border text-text-primary rounded-2xl px-4 py-3.5 text-body
          transition-all duration-200 outline-none cursor-pointer min-h-[44px]
          ${error ? 'border-error focus:border-error' : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20'}
        `}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-surface text-text-primary">
            {opt.label}
          </option>
        ))}
      </select>

      {error && <span className="text-xs text-error font-medium mt-0.5">{error}</span>}
    </div>
  );
};
