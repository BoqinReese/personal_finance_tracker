'use client';

import React from 'react';
import { UnifiedTransaction } from '../lib/finance';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { deleteTransaction } from '../lib/actions';

interface TransactionListProps {
  transactions: UnifiedTransaction[];
  showDelete?: boolean;
}

export const TransactionList = ({ transactions, showDelete = true }: TransactionListProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  };

  const handleDelete = async (id: string, isVirtual: boolean) => {
    if (isVirtual) {
      alert('Virtual transactions cannot be deleted directly. Please manage the recurring rule.');
      return;
    }
    if (confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransaction(id);
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
        <p className="text-zinc-500 dark:text-zinc-400">No transactions found for this month.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-zinc-100 dark:border-zinc-800">
            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Date</th>
            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Title</th>
            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Category</th>
            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Amount</th>
            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {transactions.map((t) => (
            <tr key={t.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
              <td className="px-4 py-4 text-sm text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                {formatDate(t.date)}
              </td>
              <td className="px-4 py-4 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                <div className="flex items-center gap-2">
                  {t.title}
                  {t.isVirtual && (
                    <Badge variant="info">Recurring</Badge>
                  )}
                </div>
                {t.notes && <p className="text-xs text-zinc-500 mt-0.5">{t.notes}</p>}
              </td>
              <td className="px-4 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                {t.category}
              </td>
              <td className={`px-4 py-4 text-sm font-semibold whitespace-nowrap ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
              </td>
              <td className="px-4 py-4 text-sm text-right whitespace-nowrap">
                {showDelete && !t.isVirtual && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDelete(t.id, t.isVirtual)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Delete
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
