'use client';

import React from 'react';
import { CalculatorIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/shadcn/dialog';
import Calculator from './calculator';

export default function CalculatorDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <CalculatorIcon className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent className="w-[90%] sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="hidden"></DialogTitle>
        </DialogHeader>
        <Calculator />
      </DialogContent>
    </Dialog>
  );
}
