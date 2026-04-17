'use server';

import { prisma } from './db';
import { revalidatePath } from 'next/cache';
import { TransactionType } from '../prisma/generated/client/enums';

export async function createTransaction(data: {
  title: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: Date;
  notes?: string;
}) {
  await prisma.transaction.create({
    data: {
      title: data.title,
      type: data.type,
      amount: data.amount,
      category: data.category,
      date: data.date,
      notes: data.notes,
    },
  });
  revalidatePath('/');
  revalidatePath('/transactions');
}

export async function deleteTransaction(id: string) {
  await prisma.transaction.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/transactions');
}

export async function createRecurringRule(data: {
  title: string;
  type: TransactionType;
  amount: number;
  category: string;
  startMonth: string;
  endMonth?: string | null;
  notes?: string | null;
}) {
  await prisma.recurringRule.create({
    data: {
      title: data.title,
      type: data.type,
      amount: data.amount,
      category: data.category,
      startMonth: data.startMonth,
      endMonth: data.endMonth,
      notes: data.notes,
      isActive: true,
    },
  });
  revalidatePath('/');
  revalidatePath('/transactions');
  revalidatePath('/recurring');
}

export async function updateRecurringRule(id: string, data: {
  title?: string;
  type?: TransactionType;
  amount?: number;
  category?: string;
  startMonth?: string;
  endMonth?: string | null;
  notes?: string | null;
  isActive?: boolean;
}) {
  await prisma.recurringRule.update({
    where: { id },
    data,
  });
  revalidatePath('/');
  revalidatePath('/transactions');
  revalidatePath('/recurring');
}

export async function toggleRecurringRuleStatus(id: string, isActive: boolean) {
  await prisma.recurringRule.update({
    where: { id },
    data: { isActive },
  });
  revalidatePath('/');
  revalidatePath('/transactions');
  revalidatePath('/recurring');
}

export async function deleteRecurringRule(id: string) {
  await prisma.recurringRule.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/transactions');
  revalidatePath('/recurring');
}
