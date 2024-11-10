'use client';

import { useEffect, useState } from 'react';
import styles from '@/styles';
import { Session } from '@supabase/auth-helpers-nextjs';
import { fetchUserProfile } from '@/functions/supabase';

export default function Profile({ session }: { session: Session | null }) {
  const [fullname, setFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [twitter, setTwitter] = useState<string | null>(null);

  useEffect(() => {
    async function loadUserProfile() {
      try {
        const userProfile = await fetchUserProfile(session);
        setFullname(userProfile.full_name);
        setUsername(userProfile.username);
        setTwitter(userProfile.twitter);
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    }

    if (session) {
      loadUserProfile();
    }
  }, [session]);

  return (
    <div className={`${styles.blurcard} p-4`}>
      <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-sky-100 text-accent-1 mb-4">
        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
      <h2 className="text-lg font-medium title-font mb-2">Account</h2>
      <p className="leading-relaxed text-sm">
        Full Name: {fullname || 'Edit Your Details'} <br />
        Username: {username || 'Edit Your Details'} <br />
        Twitter: {twitter || 'Edit Your Details'}
      </p>
    </div>
  );
}