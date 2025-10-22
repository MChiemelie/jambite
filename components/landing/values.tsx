import { values } from '@/data';
import { cn } from '@/utilities/cn';

export default function Values() {
  return (
    <section className="gap-5 overflow-hidden py-2 sm:gap-10 sm:py-4">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-4 sm:gap-8 md:gap-12 lg:gap-20">
        <h2 className="mx-auto max-w-5xl text-center text-xl font-semibold sm:text-2xl md:w-[80%] md:text-4xl">
          Everything you need <br />
          <span className="bg-gradient-to-r from-blue-800 to-indigo-900 bg-clip-text text-transparent dark:bg-gradient-to-r dark:from-sky-400 dark:via-blue-500 dark:to-cyan-400 dark:bg-clip-text dark:text-transparent">
            AI, Past Questions, <br className="hidden lg:block" /> CBT
            Interface, Analytics and more!
          </span>
        </h2>

        <div className="flex flex-col gap-4 p-4 sm:gap-10 md:gap-20 lg:gap-40">
          {values.map((value, index) => (
            <Value key={value.heading} {...value} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Value({
  heading,
  subheading,
  description1,
  description2,
  video,
  reverse,
  gradient
}: {
  heading: string;
  subheading: string;
  description1: string;
  description2: string;
  video: string;
  reverse: string;
  index: number;
  gradient: string;
}) {
  return (
    <div
      className={cn(
        'mx-auto flex flex-col items-center gap-4 md:flex-row md:gap-20',
        reverse
      )}
    >
      <div className="flex flex-col gap-2 md:max-w-lg md:gap-4">
        <h3 className="text-md bg-gradient-to-r from-blue-800 to-indigo-900 bg-clip-text text-center font-semibold text-transparent uppercase md:text-lg lg:text-xl dark:bg-gradient-to-r dark:from-sky-400 dark:via-blue-500 dark:to-cyan-400 dark:bg-clip-text dark:text-transparent">
          {heading}
        </h3>
        <h4 className="text-center text-2xl font-bold md:text-3xl lg:text-4xl">
          {subheading}
        </h4>
        <div className="sm:text-md flex flex-col gap-3 text-center text-sm lg:text-lg">
          <p>{description1}</p>
          <p>{description2}</p>
        </div>
      </div>
      <div className="relative mx-auto aspect-video w-[90%] max-w-lg md:w-[70%]">
        <div
          className={cn(
            'absolute inset-0 top-5 left-5 z-0 h-full w-[4/5] rotate-[-2.5deg] rotate-y-[0.05deg] transform-gpu rounded shadow-xl transition-transform duration-2000 ease-in-out will-change-transform hover:translate-x-1 hover:translate-y-2',
            gradient
          )}
        />
        <div className="relative z-0 overflow-hidden rounded shadow-2xl">
          <video
            width="320"
            height="240"
            src={video}
            autoPlay
            loop
            preload="auto"
            muted
            className="bg-muted/80 h-full w-full rotate-y-[0.05deg] transform-gpu transition-transform duration-2000 ease-in-out will-change-transform perspective-[800px]"
          >
            <track
              src="/path/to/captions.vtt"
              kind="subtitles"
              srcLang="en"
              label="English"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}
