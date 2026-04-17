'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from './ui/Button';

export const MonthSelector = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const getLocalYearMonth = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = (now.getMonth() + 1).toString().padStart(2, '0');
    return `${y}-${m}`;
  };

  const currentMonth = searchParams.get('month') || getLocalYearMonth();
  const [year, month] = currentMonth.split('-').map(Number);

  const changeMonth = (offset: number) => {
    const date = new Date(year, month - 1 + offset, 1);
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const newMonth = `${y}-${m}`;
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
        onClick={() => router.push(`/?month=${getLocalYearMonth()}`)}
      >
        Today
      </Button>
    </div>
  );
};
