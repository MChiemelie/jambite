'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun, SunMoon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/shadcn/button';

export default function Theme() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button variant="ghost" data-sidebar="trigger" size="icon" onClick={() => setTheme('light')} className="h-7 w-7">
        <SunMoon fill="currentColor" />
      </Button>
    );
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const Icon = resolvedTheme === 'dark' ? Sun : Moon;

  return (
    <Button variant="ghost" data-sidebar="trigger" size="icon" className="h-7 w-7" onClick={toggleTheme}>
      <Icon fill="currentColor" />
    </Button>
  );
}
