import Image from 'next/image';
import GoogleAuth from '@/components/forms/google';
import { Theme } from '@/components/themes';

export const dynamic = 'force-dynamic';

export default async function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 items-center justify-center md:flex">
        <Image
          src="/images/login/12.jpg"
          alt="A student studying"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
      <div className="relative flex w-full items-center justify-center md:w-1/2">
        <div className="absolute top-4 right-4">
          <Theme />
        </div>
        <section className="bg-muted/50 flex h-fit w-5/6 flex-col items-center gap-4 rounded-md p-4 sm:w-4/5 sm:p-8">
          <Image
            src="/images/special/logo/1.png"
            alt="Jambite Logo"
            width={100}
            height={100}
            className="mx-auto max-w-[80px]"
            priority
          />
          {children}
          <div className="mx-auto flex items-center">
            <div className="border-foreground/20 max-w-20 min-w-10 flex-grow border" />
            <span className="text-foreground/80 px-2 text-xs whitespace-nowrap">
              continue with
            </span>
            <div className="border-foreground/20 max-w-20 min-w-10 flex-grow border" />
          </div>

          <div className="xs:flex-row flex w-full flex-col justify-evenly gap-2">
            <GoogleAuth />
          </div>
        </section>
      </div>
    </div>
  );
}
