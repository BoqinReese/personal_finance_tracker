import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string }[];
}

export const Select = ({ label, error, options, className = '', ...props }: SelectProps) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</label>}
    <select 
      className={`block w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:text-zinc-100 ${className} ${error ? 'border-red-500' : ''}`} 
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);
