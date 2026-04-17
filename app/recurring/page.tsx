import React from 'react';
import { prisma } from '@/lib/db';
import { RecurringRuleList } from '@/components/RecurringRuleList';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default async function RecurringRulesPage() {
  const rules = await prisma.recurringRule.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Recurring Rules</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Manage your monthly scheduled income and expenses</p>
        </div>
        <div className="flex gap-3">
          <Link href="/">
            <Button variant="secondary">Back to Dashboard</Button>
          </Link>
          <Link href="/transactions/new">
            <Button>Add New Rule</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader title="All Recurring Rules" subtitle="Rules that automatically appear in your monthly views" />
        <CardContent className="p-0">
          <RecurringRuleList rules={rules} />
        </CardContent>
      </Card>
    </main>
  );
}
