import Image from 'next/image';
import GoogleAuth from '@/components/forms/google';
import { Theme } from '@/components/themes';

export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-screen'>
      <div className='hidden w-1/2 items-center justify-center md:flex relative'>
        <Image
          src='/images/login/12.jpg'
          alt='A student studying'
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
      <div className='relative flex w-full md:w-1/2 items-center justify-center'>
        <div className='absolute top-4 right-4'>
          <Theme />
        </div>
        <section className='flex flex-col items-center h-fit bg-muted/50 rounded-md p-4 sm:p-8 w-5/6 sm:w-4/5 gap-4'>
          <Image
            src='/images/special/logo/1.png'
            alt='Jambite Logo'
            width={100}
            height={100}
            className='max-w-[80px] mx-auto'
            priority
          />
          {children}
          <div className='flex items-center mx-auto'>
            <div className='flex-grow border border-foreground/20 min-w-10 max-w-20' />
            <span className='px-2 whitespace-nowrap text-xs text-foreground/80'>
              continue with
            </span>
            <div className='flex-grow border border-foreground/20 min-w-10 max-w-20' />
          </div>

          <div className='flex flex-col xs:flex-row justify-evenly w-full gap-2'>
            <GoogleAuth />
          </div>
        </section>
      </div>
    </div>
  );
}
