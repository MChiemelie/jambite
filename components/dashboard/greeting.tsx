'use client';

import type { User } from '@/types';

export default function Greeting({ user }: { user: User }) {
  const { fullname } = user;
  const hour = new Date().getHours();
  const getGreeting = hour < 6 ? 'Good Morning🌥️' : hour < 9 ? 'Good Morning⛅' : hour < 12 ? 'Good Morning🌤️' : hour < 16 ? 'Good Afternoon☀️' : 'Good Evening🌙';
  const firstname = fullname.split(/\s+/)[0] || 'Jambite';

  return (
    <div className='flex flex-col p-4 items-center sm:items-start text-center lg:w-full'>
      {/* <i className="animate-wavePause mx-2">👋🏽</i> */}
      <h1 className='w-full text-3xl font-bold text-nowrap'>
        {getGreeting},<br className='block sm:hidden lg:block' /> {firstname}.
      </h1>
      <p className='mx-auto lg:mx-0 text-sm text-foreground/80 w-full'>Let's ace today's practice!</p>
    </div>
  );
}
