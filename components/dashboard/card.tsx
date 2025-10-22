'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from '@/components/shadcn/dialog';

export default function Card({
  title,
  subtitle,
  value,
  icon
}: {
  title: string;
  subtitle: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-muted/50 w-full flex-col gap-2 rounded p-2 shadow-sm sm:flex sm:h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-md hidden font-semibold text-gray-800 sm:block dark:text-gray-100">
          {title}
        </h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTitle className="hidden">
            <span className="sr-only">{title}</span>
          </DialogTitle>
          <DialogTrigger asChild>
            <div className="flex w-full justify-between gap-2">
              <h3 className="xs:inline text-md hidden font-semibold text-gray-800 sm:hidden dark:text-white">
                {value}
              </h3>
              <button
                type="button"
                aria-label="Stat Icon"
                className="sm:hidden"
              >
                {icon}
              </button>
            </div>
          </DialogTrigger>
          <DialogContent className="mx-auto max-w-60 rounded">
            <div className="flex flex-col gap-2 text-center">
              <h2 className="text-md font-semibold text-gray-800 dark:text-gray-100">
                {title}
              </h2>
              <span className="mx-auto">{icon}</span>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                {value}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            </div>
          </DialogContent>
        </Dialog>
        <div className="hidden sm:block">{icon}</div>
      </div>
      <div className="hidden sm:block">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
          {value}
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400">{subtitle}</p>
      </div>
    </div>
  );
}
