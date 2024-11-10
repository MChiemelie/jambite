import React from 'react';
import { SelectSubject } from '@/layout';
import { redirect } from 'next/navigation';
import { createClient } from '@/services/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  const user = data?.user;

  if (error || !user) {
    console.log('Redirecting to particulars', error);
    redirect('/particulars');
  }

  console.log('Dashboard User:', user);

  const getGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 0 && currentHour < 12) {
      return 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 16) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };

  const greeting = `${getGreeting()}, ${user?.user_metadata.name}!`;

  return (
    <div>
      <section className="mx-auto">
        <div className="py-4 rounded-lg">
          <div className="flex flex-wrap w-full flex-col items-center text-center">
            <h1 className="text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold title-font">{greeting}</h1>
            <p className="lg:w-1/2 w-full leading-relaxed text-sm md:text-md">You signed in as {user.email}</p>
            <SelectSubject />
          </div>
        </div>
      </section>
    </div>
  );
}
