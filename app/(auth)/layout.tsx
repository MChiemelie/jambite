import Image from 'next/image';
import { Theme } from '@/components/themes';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <section className="hidden w-1/2 items-center justify-center md:flex relative">
        <Image src="/images/login/12.jpg" alt="A student studying" fill style={{ objectFit: 'cover' }} priority />
      </section>
      <div className="relative flex w-full md:w-1/2 items-center justify-center">
        <div className="absolute top-4 right-4">
          <Theme />
        </div>
        <section className="flex flex-col items-center px-[4/5] h-fit bg-muted/50 rounded-md p-8 w-4/5">
          <Image src="/images/special/logo.png" alt="logo" width={100} height={100} className="max-w-[80px] mx-auto" priority />
          {children}
        </section>
      </div>
    </div>
  );
}
