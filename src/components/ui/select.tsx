import React from 'react';

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  children: any;
  placeholder?: string;
  className?: string;
}

export function Select({ value, onChange, children, placeholder, className }: SelectProps) {
  return (
    <select 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
      data-testid="select-component"
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {children}
    </select>
  );
} 