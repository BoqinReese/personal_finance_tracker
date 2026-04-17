'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from './ui/Button';

export const MonthSelector = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentMonth = searchParams.get('month') || new Date().toISOString().slice(0, 7);
  const [year, month] = currentMonth.split('-').map(Number);

  const changeMonth = (offset: number) => {
    const date = new Date(year, month - 1 + offset, 1);
    const newMonth = date.toISOString().slice(0, 7);
    router.push(`/?month=${newMonth}`);
  };

  const formatMonth = (yearMonth: string) => {
    const [y, m] = yearMonth.split('-').map(Number);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(new Date(y, m - 1, 1));
  };

  return (
    <div className="flex items-center gap-4">
      <Button variant="secondary" size="sm" onClick={() => changeMonth(-1)}>
        &larr; Prev
      </Button>
      <h2 className="text-xl font-bold min-w-[180px] text-center">
        {formatMonth(currentMonth)}
      </h2>
      <Button variant="secondary" size="sm" onClick={() => changeMonth(1)}>
        Next &rarr;
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => router.push(`/?month=${new Date().toISOString().slice(0, 7)}`)}
      >
        Today
      </Button>
    </div>
  );
};
