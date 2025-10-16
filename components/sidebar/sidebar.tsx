'use client';

import { AppSidebar } from '@/components/shadcn/app-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/shadcn/sidebar';
import { Theme } from '@/components/themes';

export default function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
          <div className='flex items-center justify-between gap-2 px-4 w-full'>
            <SidebarTrigger />
            <Theme />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
