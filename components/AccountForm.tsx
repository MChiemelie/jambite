'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles';
import { Session, createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { fetchUserProfile, updateProfile } from '@/utilities/supabase';
import { ThemeButton, Avatar } from '@/components';

export default function AccountForm({ session }: { session: Session | null }) {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [fullname, setFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [twitter, setTwitter] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);
  const user = session?.user;

  useEffect(() => {
    async function loadProfileData() {
      try {
        setLoading(true);
        const userProfile = await fetchUserProfile(session);
        setFullname(userProfile.full_name);
        setUsername(userProfile.username);
        setTwitter(userProfile.twitter);
        setAvatarUrl(userProfile.avatar_url);
      } catch (error) {
        console.log('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      loadProfileData();
    }
  }, [session]);

  return (
    <div>
      <nav className='flex justify-between m-2 border-b pb-2 border-accent-3 space-x-1'>
        <Image src='/logo.png' alt='logo' width={100} height={100} className='rounded w-12 md:w-16' />
        <div className="flex items-center justify-evenly px-4">
          <ThemeButton />
          <Link href='/dashboard' className="flex mx-auto w-fit justify-evenly items-center text-sm">
            Dashboard
            <Image className='w-1/4 rounded-full border-2 border-accent-1' src={`${user.user_metadata.avatar_url}`} width={100} height={100} alt='your picture' />
          </Link>
          <form action="/auth/signout" method="post" className="flex justify-center items-center w-fit">
            <button  aria-label="Sign out" className={styles.signout} type="submit">
              Sign out
            </button>
          </form>
        </div>
      </nav>
      <div className="sm:flex items-center justify-center space-x-4 w-fit p-4 space-y-2 mx-auto my-4">
        <Avatar uid={user.id} url={avatar_url} size={180} onUpload={(url) => { setAvatarUrl(url); updateProfile({ session, username, fullname, twitter, avatar_url, }) }} />

        <div className={`p-4 mx-auto space-y-4 max-w-xl w-4/5 ${styles.blurcard}`}>
          <input
            className="w-full mx-auto text-context border border-accent-2 rounded p-1"
            id="email"
            type="text"
            value={session?.user.email}
            disabled
            placeholder="E-mail"
          />

          <input
            className="w-full mx-auto bg-transparent text-context border border-accent-2 rounded p-1"
            id="fullName"
            type="text"
            value={fullname || ''}
            onChange={(e) => setFullname(e.target.value)}
            placeholder="Full Name"
          />

          <input
            className="w-full mx-auto bg-transparent text-context border border-accent-2 rounded p-1"
            id="username"
            type="text"
            value={username || ''}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />

          <input
            className="w-full mx-auto bg-transparent text-context border border-accent-2 rounded p-1"
            id="twitter"
            type="url"
            value={twitter || ''}
            onChange={(e) => setTwitter(e.target.value)}
            placeholder="Twitter"
          />

          <button
            className="flex w-32 py-1 lg:py-2 bg-accent-2 justify-center lg:justify-right rounded mx-auto text-white"
            onClick={() => updateProfile({ session, username, fullname, twitter, avatar_url, }) }
            disabled={loading}
          >
            {loading ? 'Loading ...' : 'Update Profile'}
          </button>
        </div>

      </div>
    </div>
  )
}