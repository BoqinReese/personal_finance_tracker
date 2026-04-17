import React from 'react';

export const Badge = ({ children, variant = 'neutral' }: { children: React.ReactNode, variant?: 'neutral' | 'success' | 'danger' | 'warning' | 'info' }) => {
  const variants = {
    neutral: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    info: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};
