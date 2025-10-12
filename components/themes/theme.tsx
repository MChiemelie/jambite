'use client';

import { Moon, Sun, SunMoon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@/components/shadcn/button';

export default function Theme() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button
        variant='ghost'
        data-sidebar='trigger'
        size='icon'
        onClick={() => setTheme('light')}
        className='h-7 w-7'
      >
        <SunMoon fill='currentColor' className='h-7 w-7' />
      </Button>
    );
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const Icon = resolvedTheme === 'dark' ? Sun : Moon;

  return (
    <Button
      aria-label={
        resolvedTheme === 'dark'
          ? 'Switch to light theme'
          : 'Switch to dark theme'
      }
      variant='ghost'
      data-sidebar='trigger'
      size='icon'
      onClick={toggleTheme}
    >
      <Icon fill='currentColor' className='h-7 w-7' />
    </Button>
  );
}
