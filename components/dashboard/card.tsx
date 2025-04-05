'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/shadcn/dialog';

export default function Card({ title, subtitle, value, icon }: { title: string; subtitle: string; value: string | number; icon: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:flex flex-col rounded p-2 shadow-sm bg-muted/50 gap-2 w-full lg:h-full">
      <div className="flex justify-between items-center">
        <h2 className="hidden lg:block text-md font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTitle className="hidden"></DialogTitle>
          <DialogTrigger asChild>
            <div className="flex justify-between gap-2 w-full">
              <h3 className="hidden xs:inline lg:hidden text-md font-semibold text-gray-800 dark:text-white">{value}</h3>
              <button className="lg:hidden">{icon}</button>
            </div>
          </DialogTrigger>
          <DialogContent className="rounded max-w-60 mx-auto">
            <div className="flex flex-col gap-2 text-center">
              <h2 className="text-md font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
              <span className="mx-auto">{icon}</span>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{value}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">{subtitle}</p>
            </div>
          </DialogContent>
        </Dialog>
        <div className="hidden lg:block">{icon}</div>
      </div>
      <div className="hidden lg:block">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{value}</h3>
        <p className="text-xs text-gray-600 dark:text-gray-400">{subtitle}</p>
      </div>
    </div>
  );
}
