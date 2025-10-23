'use client';

import type { User } from '@/types';

export default function Greeting({ user }: { user: User }) {
  const { fullname } = user;
  const hour = new Date().getHours();
  const getGreeting = hour < 6 ? 'Good Morning🌥️' : hour < 9 ? 'Good Morning⛅' : hour < 12 ? 'Good Morning🌤️' : hour < 16 ? 'Good Afternoon☀️' : 'Good Evening🌙';
  const firstname = fullname.split(/\s+/)[0] || 'Jambite';

  return (
    <div className='flex flex-col items-center p-4 text-center sm:items-start lg:w-full'>
      <h1 className='w-full text-3xl font-bold text-nowrap'>
        {getGreeting},<br className='block sm:hidden lg:block' /> {firstname}.
      </h1>
      <p className='text-foreground/80 mx-auto w-full text-sm lg:mx-0'>Let's ace today's practice!</p>
    </div>
  );
}
