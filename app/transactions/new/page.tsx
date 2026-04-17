import React from 'react';
import { TransactionForm } from '@/components/TransactionForm';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export default function NewTransactionPage() {
  return (
    <main className="max-w-3xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Add Transaction</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Create a one-time or recurring entry</p>
      </div>

      <Card>
        <CardHeader title="Transaction Details" />
        <CardContent>
          <TransactionForm />
        </CardContent>
      </Card>
    </main>
  );
}
