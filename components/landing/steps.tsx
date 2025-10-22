import Image from 'next/image';
import { steps } from '@/data';

export default function Steps() {
  return (
    <section className="flex justify-center">
      <div className="flex w-11/12 flex-col items-center gap-16">
        <div className="flex flex-col gap-4 text-center">
          <h2 className="text-xl font-semibold sm:text-2xl md:text-4xl">
            How{' '}
            <span className="bg-gradient-to-r from-blue-800 to-indigo-900 bg-clip-text text-transparent dark:bg-gradient-to-r dark:from-sky-400 dark:via-blue-500 dark:to-cyan-400 dark:bg-clip-text dark:text-transparent">
              It Works!
            </span>
          </h2>
          <p className="text-md font-meduim">
            You are just three steps to excellence. Yes! It is that easy!
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-2 sm:gap-4 md:grid-cols-3 md:gap-6 lg:gap-12">
          {steps.map(({ number, title, desc, image }) => (
            <div
              key={title}
              className="border-muted/90 bg-muted/50 flex flex-col items-center gap-2 rounded border-2 p-2 sm:gap-4 sm:p-4 md:gap-6 lg:gap-8"
            >
              <span className="bg-foreground text-background flex aspect-square w-6 items-center justify-center rounded-full font-semibold sm:w-8 md:w-10 lg:w-12">
                {number}
              </span>

              <div className="flex h-full flex-col justify-between gap-3 text-center">
                <div className="flex flex-col gap-4">
                  <h3 className="text-2xl font-semibold lg:text-3xl">
                    {title}
                  </h3>
                  <p className="h-20 text-sm">{desc}</p>
                </div>
                <Image
                  src={`/images/steps/${image}.png`}
                  width={500}
                  height={500}
                  alt={`A screenshot of the ${image} screen`}
                  className="h-full w-full rounded-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
