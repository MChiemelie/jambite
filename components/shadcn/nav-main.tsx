'use client';

import { Collapsible, CollapsibleTrigger } from '@/components/shadcn/collapsible';
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/shadcn/sidebar';
import { Bot, ChartLine, HandCoins, LayoutDashboard, Medal, Rss, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavItem = {
  title: string;
  url: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
  rel?: string;
  icon?: LucideIcon;
};

const navData: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Analytics',
    url: '/analytics',
    icon: ChartLine,
  },
  {
    title: 'Blog',
    url: '/blog',
    icon: Rss,
  },
  {
    title: 'Payments',
    url: '/payments',
    icon: HandCoins,
  },
  {
    title: 'Leaderboard',
    url: '/leaderboard',
    icon: Medal,
  },
  {
    title: 'Chat',
    url: '/ai',
    icon: Bot,
  },
];

export function NavMain() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu className="py-10 gap-4">
        {navData.map((item) => {
          const isActive = pathname === item.url;

          const buttonClasses = isActive ? 'bg-primary text-secondary transition-all duration-300' : 'text-foreground transition-all duration-300';

          const iconClasses = isActive ? 'text-background' : 'text-foreground transition-all duration-300';

          return (
            <Collapsible key={item.title} asChild defaultOpen={isActive}>
              <SidebarMenuItem>
                <Link href={item.url} target={item.target} rel={item.rel}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title} className={`py-6 px-4 gap-4 rounded ${buttonClasses}`}>
                      {item.icon && <item.icon className={`h-5 w-5 ${iconClasses}`} aria-hidden="true" />}
                      <span className="font-medium">{item.title}</span>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </Link>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
