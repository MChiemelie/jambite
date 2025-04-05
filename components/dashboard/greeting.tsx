'use client';

import { UserData } from '@/types';

export default function Greeting({ user }: { user: UserData }) {
  const { fullname } = user;
  const hour = new Date().getHours();
  const getGreeting = hour < 6 ? 'Good Morning🌥️' : hour < 9 ? 'Good Morning⛅' : hour < 12 ? 'Good Morning🌤️' : hour < 16 ? 'Good Afternoon☀️' : 'Good Evening🌙';
  const firstname = fullname.split(/\s+/)[0] || 'Jambite';

  return (
    <div className="flex flex-col p-4 items-center sm:items-start text-center sm:text-justify w-full">
      {/* <i className="animate-wavePause mx-2">👋🏽</i> */}
      <h1 className="w-full text-3xl font-bold text-nowrap">
        {getGreeting},<br className="hidden lg:block" /> {firstname}.
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">Let's ace today's practice!</p>
    </div>
  );
}
