import { LogIn } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Theme } from '@/components/themes';

export default function Nav() {
  return (
    <nav className='fixed top-0 z-20 flex w-full items-center justify-between p-2 md:p-4'>
      <Image src='/images/special/logo/1.png' alt='Jambite Logo' width={45} height={45} className='rounded-xs' />
      <div className='flex items-center gap-4'>
        <span className='bg-background border-foreground/20 rounded-lg border'>
          <Theme />
        </span>
        <Link href='/sign-in' className='relative z-20 p-[0.1rem]'>
          <div className='absolute inset-0 rounded bg-gradient-to-r from-sky-600 to-blue-800' />
          <span className='bg-background text-foreground relative flex items-center justify-center gap-2 rounded px-4 py-[.45rem] text-xs font-medium hover:bg-transparent hover:text-white'>
            <span>Sign In</span>
            <LogIn className='h-5 w-5' />
          </span>
        </Link>
      </div>
    </nav>
  );
}
