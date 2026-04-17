import React from 'react';

export const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
    {subtitle && <p className="text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</p>}
  </div>
);

export const CardContent = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);
