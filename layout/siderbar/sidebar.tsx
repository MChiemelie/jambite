'use client'

import React from 'react';
import { ChartLine, History, Home, HandCoins, Rss, MoreHorizontal, User, Trophy } from 'lucide-react';
import { SidebarDesktop } from './sidebar-desktop';
import { SidebarItems } from '@/types';
import { SidebarButton } from './sidebar-button';
import { useMediaQuery } from 'usehooks-ts';
import { SidebarMobile } from './sidebar-mobile';

const sidebarItems: SidebarItems = {
  links: [
    { href: '/dashboard', label: 'Home', icon: Home },
    { href: '/dashboard/analytics', label: 'Analytics', icon: ChartLine },
    { href: '/dashboard/blog', label: 'Blog', icon: Rss },
    { href: '/dashboard/payments', icon: HandCoins, label: 'Payments' },
    { href: '/dashboard/history', icon: History, label: 'History' },
    { href: '/dashboard/ranking', icon: Trophy, label: 'Ranking' },
    { href: '/dashboard/profile', icon: User, label: 'Profile' }
  ],
  extras: (
    <div className="flex flex-col gap-2">
      <SidebarButton icon={MoreHorizontal} className="w-full">
        More
      </SidebarButton>
      <SidebarButton className="w-full justify-center text-white" variant="default">
        Tweet
      </SidebarButton>
    </div>
  )
};

export function Sidebar() {
  const isDesktop = useMediaQuery('(min-width: 640px)', {
    initializeWithValue: false
  });

  if (isDesktop) {
    return <SidebarDesktop sidebarItems={sidebarItems} />;
  }

  return <SidebarMobile sidebarItems={sidebarItems} />;
}
