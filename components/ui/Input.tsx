import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className = '', ...props }: InputProps) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</label>}
    <input 
      className={`block w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:text-zinc-100 ${className} ${error ? 'border-red-500' : ''}`} 
      {...props}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);
