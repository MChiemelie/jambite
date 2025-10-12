'use client';

import { CalculatorIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/shadcn/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/shadcn/dialog';

const CalculatorCode: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [operation, setOperation] = useState<string | null>(null);
  const [prevValue, setPrevValue] = useState<number | null>(null);

  const handleNumberClick = (num: string) => {
    setDisplay((prev) => (prev === '0' ? num : prev + num));
  };

  const handleOperationClick = (op: string) => {
    setOperation(op);
    setPrevValue(parseFloat(display));
    setDisplay('0');
  };

  const handleEqualsClick = () => {
    if (operation && prevValue !== null) {
      const current = parseFloat(display);
      let result: number;
      switch (operation) {
        case '+':
          result = prevValue + current;
          break;
        case '-':
          result = prevValue - current;
          break;
        case '*':
          result = prevValue * current;
          break;
        case '/':
          result = prevValue / current;
          break;
        default:
          return;
      }
      setDisplay(result.toString());
      setOperation(null);
      setPrevValue(null);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setOperation(null);
    setPrevValue(null);
  };

  return (
    <div className='grid grid-cols-4 gap-2 bg-gray-100 rounded'>
      <div className='col-span-4 bg-white p-2 rounded mb-2 text-right text-2xl font-bold text-black'>
        {display}
      </div>
      {[
        '7',
        '8',
        '9',
        '/',
        '4',
        '5',
        '6',
        '*',
        '1',
        '2',
        '3',
        '-',
        '0',
        '.',
        '=',
        '+'
      ].map((btn) => (
        <Button
          key={btn}
          onClick={() => {
            if (btn === '=') handleEqualsClick();
            else if (['+', '-', '*', '/'].includes(btn))
              handleOperationClick(btn);
            else handleNumberClick(btn);
          }}
          className={`${btn === '=' ? 'col-span-2' : ''} ${['+', '-', '*', '/'].includes(btn) ? ' text-white bg-blue-500 hover:bg-blue-600' : ''}`}
        >
          {btn}
        </Button>
      ))}
      <Button
        onClick={handleClear}
        className='col-span-2 text-white  bg-red-500 hover:bg-red-600'
      >
        Clear
      </Button>
    </div>
  );
};

export default function Calculator() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <CalculatorIcon className='h-4 w-4' />
      </DialogTrigger>
      <DialogContent className=' bg-gray-100  w-[90%] sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='hidden'></DialogTitle>
        </DialogHeader>
        <CalculatorCode />
      </DialogContent>
    </Dialog>
  );
}
