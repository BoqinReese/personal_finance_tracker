import React, { Suspense } from 'react';
import { getMonthlyData, calculateTotals } from '@/lib/finance';
import { DashboardSummary } from '@/components/DashboardSummary';
import { TransactionList } from '@/components/TransactionList';
import { MonthSelector } from '@/components/MonthSelector';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Link from 'next/link';

interface PageProps {
  searchParams: Promise<{ month?: string }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentMonth = params.month || new Date().toISOString().slice(0, 7);
  
  const transactions = await getMonthlyData(currentMonth);
  const totals = calculateTotals(transactions);

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Finance Tracker</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Welcome back, Juma Enock</p>
        </div>
        <div className="flex gap-3">
          <Link href="/recurring">
            <Button variant="secondary">Manage Recurring</Button>
          </Link>
          <Link href="/transactions/new">
            <Button>Add Transaction</Button>
          </Link>
        </div>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-2xl space-y-6 border border-zinc-100 dark:border-zinc-800">
        <Suspense fallback={<div>Loading...</div>}>
          <MonthSelector />
        </Suspense>
        <DashboardSummary {...totals} />
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader title="Transactions" subtitle="All entries for the selected month" />
          <CardContent className="p-0">
            <TransactionList transactions={transactions} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
