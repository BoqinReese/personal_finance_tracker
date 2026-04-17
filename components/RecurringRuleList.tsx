'use client';

import React from 'react';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { toggleRecurringRuleStatus, deleteRecurringRule } from '../lib/actions';

interface RecurringRule {
  id: string;
  title: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  startMonth: string;
  endMonth: string | null;
  isActive: boolean;
}

interface RecurringRuleListProps {
  rules: RecurringRule[];
}

export const RecurringRuleList = ({ rules }: RecurringRuleListProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    await toggleRecurringRuleStatus(id, !currentStatus);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this recurring rule? Past virtual entries for this rule will also disappear.')) {
      await deleteRecurringRule(id);
    }
  };

  if (rules.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
        <p className="text-zinc-500 dark:text-zinc-400">No recurring rules found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-zinc-100 dark:border-zinc-800">
            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Title</th>
            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Category</th>
            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Schedule</th>
            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Amount</th>
            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {rules.map((rule) => (
            <tr key={rule.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
              <td className="px-4 py-4 whitespace-nowrap">
                <Badge variant={rule.isActive ? 'success' : 'neutral'}>
                  {rule.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </td>
              <td className="px-4 py-4 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {rule.title}
              </td>
              <td className="px-4 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                {rule.category}
              </td>
              <td className="px-4 py-4 text-sm text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                {rule.startMonth} {rule.endMonth ? `to ${rule.endMonth}` : 'onwards'}
              </td>
              <td className={`px-4 py-4 text-sm font-semibold whitespace-nowrap ${rule.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                {rule.type === 'income' ? '+' : '-'}{formatCurrency(rule.amount)}
              </td>
              <td className="px-4 py-4 text-sm text-right whitespace-nowrap space-x-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => handleToggle(rule.id, rule.isActive)}
                >
                  {rule.isActive ? 'Deactivate' : 'Activate'}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDelete(rule.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
