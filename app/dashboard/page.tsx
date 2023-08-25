import Image from 'next/image';
import Link from 'next/link';
import { cookies } from 'next/headers';
import styles from '@/styles';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { SubjectSelect, ThemeButton, Profile, Performance } from '@/components';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies })

  const { data: { session } } = await supabase.auth.getSession();
  const user = session.user

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

  const greeting = `${getGreeting()}, ${user.user_metadata.name}!`;

  return (
    <div>
      <nav className='flex justify-between m-2 border-b pb-2 border-accent-3 space-x-1'>
        <Image src='/logo.png' alt='logo' width={100} height={100} className='rounded w-12 md:w-16' />
        <div className="flex items-center justify-evenly px-4">
          <ThemeButton />
          <Link href='/account' className="flex mx-auto w-fit justify-evenly items-center text-sm">
            Edit Profile
            <Image className='w-1/4 rounded-full border-2 border-accent-1' src={`${user.user_metadata.avatar_url}`} width={100} height={100} alt='your picture' />
          </Link>
          <form action="/auth/signout" method="post" className="flex justify-center items-center w-fit">
            <button aria-label="Sign Out" className={styles.signout} type="submit">
              Sign out
            </button>
          </form>
        </div>
      </nav>
      <section className="px-5 mx-auto">
        <div className="p-2 rounded-lg my-2">
          <div className="flex flex-wrap w-full flex-col items-center text-center">
            <h1 className="text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold title-font">{greeting}</h1>
            <p className="lg:w-1/2 w-full leading-relaxed text-sm md:text-md">You signed in as {user.email}</p>
            <SubjectSelect />
          </div>
          <div className="flex flex-wrap -m-4">
            <div className="w-full sm:w-1/2 p-4 h-full">
              <Performance session={session} />
            </div>
            <div className="w-full sm:w-1/2 p-4 h-full">
              <Profile session={session} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
