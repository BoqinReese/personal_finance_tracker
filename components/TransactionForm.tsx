'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../lib/categories';
import { createTransaction, createRecurringRule } from '../lib/actions';
import { useRouter } from 'next/navigation';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['income', 'expense']),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
  notes: z.string().optional(),
  entryMode: z.enum(['one_time', 'recurring']),
  date: z.string().optional(),
  startMonth: z.string().optional(),
  endMonth: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof schema>;

export const TransactionForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'expense',
      entryMode: 'one_time',
      date: new Date().toISOString().split('T')[0],
      startMonth: new Date().toISOString().slice(0, 7),
    }
  });

  const type = watch('type');
  const entryMode = watch('entryMode');
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const categoryOptions = categories.map(c => ({ label: c, value: c }));

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      if (data.entryMode === 'one_time') {
        await createTransaction({
          title: data.title,
          type: data.type,
          amount: data.amount,
          category: data.category,
          date: new Date(data.date!),
          notes: data.notes,
        });
      } else {
        await createRecurringRule({
          title: data.title,
          type: data.type,
          amount: data.amount,
          category: data.category,
          startMonth: data.startMonth!,
          endMonth: data.endMonth || null,
          notes: data.notes || null,
        });
      }
      router.push('/');
    } catch (error) {
      console.error(error);
      alert('Failed to save transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex gap-4 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setValue('entryMode', 'one_time')}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all cursor-pointer ${entryMode === 'one_time' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400'}`}
        >
          One-time
        </button>
        <button
          type="button"
          onClick={() => setValue('entryMode', 'recurring')}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all cursor-pointer ${entryMode === 'recurring' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400'}`}
        >
          Recurring Monthly
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Title" {...register('title')} error={errors.title?.message} placeholder="e.g. Rent, Groceries" />
        <div className="space-y-1">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Type</label>
          <div className="flex gap-4 py-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="expense" {...register('type')} className="w-4 h-4 text-zinc-900 focus:ring-zinc-500" />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Expense</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="income" {...register('type')} className="w-4 h-4 text-zinc-900 focus:ring-zinc-500" />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Income</span>
            </label>
          </div>
        </div>
        <Input label="Amount" type="number" step="0.01" {...register('amount')} error={errors.amount?.message} placeholder="0.00" />
        <Select label="Category" options={categoryOptions} {...register('category')} error={errors.category?.message} />
        
        {entryMode === 'one_time' ? (
          <Input label="Date" type="date" {...register('date')} error={errors.date?.message} />
        ) : (
          <>
            <Input label="Start Month" type="month" {...register('startMonth')} error={errors.startMonth?.message} />
            <Input label="End Month (Optional)" type="month" {...register('endMonth')} error={errors.endMonth?.message} />
          </>
        )}
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Notes (Optional)</label>
        <textarea 
          {...register('notes')} 
          rows={3}
          className="block w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:text-zinc-100"
          placeholder="Add any additional details..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Transaction'}
        </Button>
      </div>
    </form>
  );
};
