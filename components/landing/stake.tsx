import Image from 'next/image';
import Paragraph from './paragraph';

export default function Stake() {
  return (
    <section className='w-full p-2 sm:p-6'>
      <div className='relative overflow-hidden rounded shadow-lg'>
        <div className="absolute inset-0 bg-[url('/images/stake/background.webp')] bg-cover bg-fixed bg-center bg-no-repeat" />
        <div className='relative z-10 flex flex-col justify-around gap-8 p-2 sm:p-6 md:flex-row'>
          <div className='flex flex-col gap-4'>
            <h2 className='text-center text-2xl font-semibold text-sky-50 text-shadow-gray-800 text-shadow-xs sm:text-3xl'>Jambite is built for you!</h2>
            <Paragraph />
          </div>
          <Image width={600} height={100} src='/images/stake/4.jpg' alt='A backround wallpaper for the Stake section' className='border-foreground/10 w-full rounded border-2 md:w-1/2' />
        </div>
      </div>
    </section>
  );
}
