import React from 'react';
import { Card, CardContent } from './ui/Card';

interface DashboardSummaryProps {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
}

export const DashboardSummary = ({ totalIncome, totalExpenses, netBalance }: DashboardSummaryProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Income</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(totalIncome)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Expenses</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(totalExpenses)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Net Balance</p>
          <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-zinc-900 dark:text-zinc-100' : 'text-red-600'}`}>
            {formatCurrency(netBalance)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
