'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from '@/components/shadcn/sidebar';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild> */}
        <Link href="#" className="flex gap-4 items-center">
          <Image src="/images/special/logo.png" className="w-10" alt="Jambite logo" width={100} height={100} />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Jambite</span>
            <span className="truncate text-xs">Enterprise</span>
          </div>
        </Link>
        {/* </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu> */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
