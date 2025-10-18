import Image from 'next/image';
import { steps } from '@/data';

export default function Steps() {
  return (
    <section className='flex justify-center'>
      <div className='w-11/12 flex flex-col items-center gap-16'>
        <div className='text-center flex flex-col gap-4'>
          <h2 className='font-semibold text-2xl md:text-4xl'>
            How <span className='bg-gradient-to-r from-blue-800 to-indigo-900 bg-clip-text text-transparent dark:bg-gradient-to-r dark:from-sky-400 dark:via-blue-500 dark:to-cyan-400 dark:bg-clip-text dark:text-transparent'>It Works!</span>
          </h2>
          <p className='text-md font-meduim'>You are just three steps to excellence. Yes! It is that easy!</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4 md:gap-6 lg:gap-12 w-full'>
          {steps.map(({ number, title, desc, image }) => (
            <div key={title} className='flex flex-col items-center gap-2 sm:gap-4 md:gap-6 lg:gap-8 border-2 border-muted/90 p-2 sm:p-4 rounded bg-muted/50'>
              <span className='aspect-square w-6 sm:w-8 md:w-10 lg:w-12 flex items-center justify-center rounded-full bg-foreground text-background font-semibold'>{number}</span>

              <div className='flex flex-col h-full justify-between gap-3 text-center'>
                <div className='flex flex-col gap-4'>
                  <h3 className='text-2xl lg:text-3xl font-semibold'>{title}</h3>
                  <p className='text-sm h-20'>{desc}</p>
                </div>
                <Image src={`/images/steps/${image}.png`} width={500} height={500} alt={`A screenshot of the ${image} screen`} className='w-full rounded-sm h-full' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
