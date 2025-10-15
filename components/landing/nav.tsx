import { LogIn } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Theme } from '@/components/themes';

export default function Nav() {
 return (
  <nav className='fixed top-0 flex items-center justify-between z-20 w-full p-2 md:p-4'>
   <Image
    src='/images/special/logo/1.png'
    alt='Jambite Logo'
    width={45}
    height={45}
    className='rounded-xs'
   />
   <div className='flex gap-4 items-center'>
    <span className='bg-background border border-foreground/20 rounded-lg'>
     <Theme />
    </span>
    <Link href='/sign-in' className='p-[0.1rem] relative z-20'>
     <div className='absolute inset-0 bg-gradient-to-r from-sky-600 to-blue-800 rounded' />
     <span className='rounded flex items-center justify-center gap-2 px-4 py-[.45rem] relative bg-background text-foreground hover:bg-transparent hover:text-white text-xs font-medium'>
      <span>Sign In</span>
      <LogIn className='w-5 h-5' />
     </span>
    </Link>
   </div>
  </nav>
 );
}
