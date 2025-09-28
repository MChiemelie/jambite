'use client';

import Image from 'next/image';
import Paragraph from './paragraph';

export default function Stake() {
  return (
    <section className="w-full p-2 sm:p-6">
      <div className="relative rounded overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-[url('/images/stake/background.webp')] bg-cover bg-center bg-no-repeat bg-fixed" />
        <div className="relative z-10 flex flex-col md:flex-row justify-around gap-8 p-2 sm:p-6">
          <div className="flex flex-col gap-4">
            <h2 className="text-center font-semibold text-2xl sm:text-3xl text-sky-50 text-shadow-xs text-shadow-gray-800">Jambite is built for you!</h2>
            <Paragraph />
          </div>
          <Image width={600} height={100} src="/images/stake/4.jpg" alt="A backround wallpaper for the Stake section" className="border-2 border-foreground/10 rounded w-full md:w-1/2" />
        </div>
      </div>
    </section>
  );
}
