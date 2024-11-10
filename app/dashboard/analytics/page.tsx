import React from 'react';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Subject, Score, Time } from '@/layout/analytics';

export const dynamic = 'force-dynamic';

export default async function Analytics() {
  const supabase = createServerComponentClient({ cookies });
  let session;
  
  try {

    const { data: sessionData } = await supabase.auth.getSession();
    session = sessionData?.session;
  } catch (error) {
    console.error('Error fetching user/session data:', error);
    return <p>Error loading data. Please try again later.</p>;
  }

  return (
    <section className="p-10">
      <figure className="quote text-center mb-10">
        <blockquote>
          <p className="font-bold italic text-2xl">“Above all else, show the data.”</p>
        </blockquote>
        <figcaption>
          —{' '}
          <cite>
            Edward R. Tufte, <em>The Visual Display of Quantitative Information</em>
          </cite>
        </figcaption>
      </figure>

      {/* Parent flex container */}
      <div className="flex flex-wrap gap-4">
        {/* Stacked vertically */}
        <div className="flex w-full sm:w-1/2 space-y-4 p-4">
          <Subject session={session} />
          <Time session={session} />
        </div>
        {/* Separate flex item */}
        <div className="w-full sm:w-1/2 p-4">
          <Score session={session} />
        </div>
      </div>
    </section>
  );
}
