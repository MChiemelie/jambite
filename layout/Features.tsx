'use client';

import { cn } from '@/utilities';
import { IconAdjustmentsBolt, IconCloud, IconCurrencyDollar, IconEaseInOut, IconHeart, IconHelp, IconRouteAltLeft, IconTerminal2 } from '@tabler/icons-react';

const features = [
  {
    title: 'Gain the CBT Experience!',
    description: 'Jambite replicates the JAMB Computer Based Test experience with a realistic interface and question formats.',
    icon: <IconTerminal2 />,
  },
  {
    title: "All Subjects - You're covered!",
    description: 'Our comprehensive platform offers questions for all the JAMB subjects.',
    icon: <IconAdjustmentsBolt />,
  },
  {
    title: 'Practice with over 5,000 past questions',
    description: 'Gain a competitive edge and boost your performance with our extensive collection of over 5,000 past questions.',
    icon: <IconHeart />,
  },
  {
    title: 'AI Answer Review',
    description: 'You have AI to help you with reviewing your answers',
    icon: <IconRouteAltLeft />,
  },
  {
    title: 'Accurate Answers and Solutions',
    description: 'Our answers and solutions have undergone rigorous review by professionals and top tutors.',
    icon: <IconEaseInOut />,
  },
  {
    title: 'Analytics and Peformance',
    description: 'We provide you with the metrics to see your perofrmance over time',
    icon: <IconCurrencyDollar />,
  },
  {
    title: 'Leaderboard and Ranking',
    description: 'Compete with other Jambite on the leaderboard.',
    icon: <IconCloud />,
  },
  {
    title: '24/7 Customer Support',
    description: 'We are available a 100% of the time.',
    icon: <IconHelp />,
  },
];

export default function Features() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({ title, description, icon, index }: { title: string; description: string; icon: React.ReactNode; index: number }) => {
  return (
    <div className={cn('flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800', (index === 0 || index === 4) && 'lg:border-l dark:border-neutral-800', index < 4 && 'lg:border-b dark:border-neutral-800')}>
      {index < 4 && <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />}
      {index >= 4 && <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">{icon}</div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">{title}</span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">{description}</p>
    </div>
  );
};