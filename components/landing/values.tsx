import { cn } from '@/utilities/cn';

export const values = [
  {
    heading: 'AI Advantage',
    subheading: 'Meet Your AI Companion',
    description1: 'Meet your new study buddy — Erudite, our premium AI assistant.',
    description2: 'It reviews your answers and explains tricky questions so you learn in the process.',
    video: '/videos/1.mp4',
    reverse: '',
    gradient: 'bg-gradient-to-r from-[#fde68a] to-[#f59e0b]',
  },
  {
    heading: 'CBT Interface',
    subheading: 'Master the CBT Interface',
    description1: 'Experience an exam-like interface that feels just like the real thing.',
    description2: 'Don’t have a PC? No problem! Jambite is designed for all devices — smartphones, tablets, and laptops.',
    video: '/videos/2.mp4',
    reverse: 'md:flex-row-reverse',
    gradient: 'bg-gradient-to-r from-[#ff9843] via-[#ffdd95] to-[#86a7fc]',
  },
  {
    heading: 'Past Questions',
    subheading: 'A Trove of Past Questions',
    description1: 'Access 17 subjects and over 20,000 past questions — all while saving money.',
    description2: 'After practice, accurate answers and user-friendly explanations are provided for each question.',
    video: '/videos/3.mp4',
    reverse: '',
    gradient: 'bg-gradient-to-r from-[#fef08a] via-[#84cc16] to-[#16a34a]',
  },
  {
    heading: 'Performance Analytics',
    subheading: 'Progress with Analytics',
    description1: 'Each practice session is analysed in detail — your total score, subject scores, time spent, and number of attempts.',
    description2: 'Our dedicated analytics page allows you to track your progress over time.',
    video: '/videos/2.mp4',
    reverse: 'md:flex-row-reverse',
    gradient: 'bg-gradient-to-r from-[#14b8a6] via-[#0891b2] to-[#1d4ed8]',
  },
];

export default function Values() {
  return (
    <section className="py-2 sm:py-4 gap-5 sm:gap-10 overflow-hidden">
      <div className="max-w-screen-xl mx-auto flex flex-col gap-4 sm:gap-8 md:gap-12 lg:gap-20">
        <h2 className="max-w-4xl text-center mx-auto font-semibold text-xl sm:text-2xl  md:text-4xl md:w-[80%]">
          Everything you need <br />
          <span className="bg-gradient-to-r from-blue-800 to-indigo-900 bg-clip-text text-transparent dark:bg-gradient-to-r dark:from-sky-400 dark:via-blue-500 dark:to-cyan-400 dark:bg-clip-text dark:text-transparent">
            AI, Past Questions, <br className="hidden lg:block" /> CBT Interface, Analytics and more!
          </span>
        </h2>

        <div className="flex flex-col  p-4 gap-4 sm:gap-10 md:gap-20 lg:gap-40">
          {values.map((value, index) => (
            <Value key={value.heading} {...value} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Value({ heading, subheading, description1, description2, video, reverse, gradient, index }: { heading: string; subheading: string; description1: string; description2: string; video: string; reverse: string; index: number; gradient: string }) {
  return (
    <div className={cn('flex flex-col md:flex-row items-center mx-auto gap-4 md:gap-20', reverse)}>
      <div className="md:max-w-lg flex flex-col gap-2 md:gap-4">
        <h3 className="text-md md:text-lg lg:text-xl text-center uppercase font-semibold bg-gradient-to-r from-blue-800 to-indigo-900 bg-clip-text text-transparent dark:bg-gradient-to-r dark:from-sky-400 dark:via-blue-500 dark:to-cyan-400 dark:bg-clip-text dark:text-transparent">{heading}</h3>
        <h4 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">{subheading}</h4>
        <div className="flex flex-col gap-3 text-sm sm:text-md lg:text-lg text-center">
          <p>{description1}</p>
          <p>{description2}</p>
        </div>
      </div>
      <div className="relative w-[90%] md:w-[70%] max-w-lg mx-auto aspect-video">
        <div className={cn('absolute top-5 left-5 w-[4/5] h-full rounded rotate-[-2.5deg] z-0 inset-0 shadow-xl transform-gpu rotate-y-[0.05deg] transition-transform duration-2000 ease-in-out will-change-transform hover:translate-x-1 hover:translate-y-2', gradient)} />
        <div className="relative z-0 rounded overflow-hidden shadow-2xl">
          <video width="320" height="240" src={video} autoPlay loop preload="auto" muted className="bg-muted/80 w-full h-full transform-gpu perspective-[800px] rotate-y-[0.05deg] transition-transform duration-2000 ease-in-out will-change-transform ">
            <track src="/path/to/captions.vtt" kind="subtitles" srcLang="en" label="English" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}
