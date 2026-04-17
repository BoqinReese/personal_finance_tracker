import { prisma } from './db';
import { TransactionType } from '../prisma/generated/client/enums';

export interface UnifiedTransaction {
  id: string;
  title: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: Date;
  notes: string | null;
  isVirtual: boolean;
  recurringRuleId?: string;
}

export async function getMonthlyData(yearMonth: string) {
  // yearMonth format: "YYYY-MM"
  const [year, month] = yearMonth.split('-').map(Number);
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  // Fetch one-time transactions
  const oneTimeTransactions = await prisma.transaction.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  // Fetch active recurring rules
  const recurringRules = await prisma.recurringRule.findMany({
    where: {
      isActive: true,
      startMonth: {
        lte: yearMonth,
      },
      OR: [
        { endMonth: null },
        { endMonth: { gte: yearMonth } },
      ],
    },
  });

  // Convert recurring rules to virtual transactions
  const virtualTransactions: UnifiedTransaction[] = recurringRules.map((rule) => ({
    id: `virtual-${rule.id}-${yearMonth}`,
    title: rule.title,
    type: rule.type,
    amount: rule.amount,
    category: rule.category,
    date: new Date(year, month - 1, 1), // Default to 1st of month for virtual display
    notes: rule.notes,
    isVirtual: true,
    recurringRuleId: rule.id,
  }));

  const allTransactions: UnifiedTransaction[] = [
    ...oneTimeTransactions.map(t => ({ 
      id: t.id,
      title: t.title,
      type: t.type,
      amount: t.amount,
      category: t.category,
      date: t.date,
      notes: t.notes,
      isVirtual: false 
    })),
    ...virtualTransactions
  ];

  return allTransactions.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function calculateTotals(transactions: UnifiedTransaction[]) {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
  };
}
