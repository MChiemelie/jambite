'use client';

import { cn } from '@/utilities/cn';

const values = [
  {
    heading: 'AI Advantage',
    subheading: 'Meet Your AI Companion',
    description1: 'Meet your new study buddy — Erudite, our premium AI assistant.',
    description2: 'It reviews your answers and explains tricky questions so you learn in the process.',
    video: '/videos/demo.mp4',
    reverse: '',
    gradient: 'bg-gradient-to-r from-[#fde68a] to-[#f59e0b]',
  },
  {
    heading: 'CBT Interface',
    subheading: 'Practice with the real CBT user interface',
    description1: 'Experience an exam-like interface that feels just like the real thing.',
    description2: 'Don’t have a PC? No problem! Jambite is designed for all devices — smartphones, tablets, and laptops.',
    video: '/videos/demo.mp4',
    reverse: 'flex-row-reverse',
    gradient: 'bg-gradient-to-r from-[#ff9843] via-[#ffdd95] to-[#86a7fc]',
  },
  {
    heading: 'Past Questions',
    subheading: 'The most comprehensive trove of past questions',
    description1: 'Access 17 subjects and over 20,000 past questions — all while saving money.',
    description2: 'After practice, accurate answers and user-friendly explanations are provided for each question.',
    video: '/videos/demo.mp4',
    reverse: '',
    gradient: 'bg-gradient-to-r from-[#fef08a] via-[#84cc16] to-[#16a34a]',
  },
  {
    heading: 'Performance Analytics',
    subheading: 'Track your performance and progress with the right analytics',
    description1: 'Each practice session is analysed in detail — your total score, subject scores, time spent, and number of attempts.',
    description2: 'Our dedicated analytics page allows you to track your progress over time.',
    video: '/videos/demo.mp4',
    reverse: 'flex-row-reverse',
    gradient: 'bg-gradient-to-r from-[#14b8a6] via-[#0891b2] to-[#1d4ed8]',
  },
  {
    heading: 'Competitive Leaderboard',
    subheading: 'Take your place on the League of Champions',
    description1: 'Compete with your peers, outscore them, and secure your place in the League of Champions.',
    description2: 'Rise through the ranks and become a champion.',
    video: '/videos/demo.mp4',
    reverse: '',
    gradient: 'bg-gradient-to-tr from-[#be185d] via-[#f472b6] to-[#fbcfe8]',
  },
];

export default function Values() {
  return (
    <div className="overflow-hidden bg-white text-black">
      <div className="max-w-screen-xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-lg uppercase font-semibold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">Our Features</h2>
          <p className="mt-4 text-lg text-gray-600">Explore the powerful features of our platform designed to elevate your learning experience.</p>
        </div>

        <div className="flex flex-col gap-40">
          {values.map((value, index) => (
            <Value key={value.heading} {...value} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function Value({ heading, subheading, description1, description2, video, reverse, gradient, index }: { heading: string; subheading: string; description1: string; description2: string; video: string; reverse: string; index: number; gradient: string }) {
  return (
    <div className={cn('flex items-start mx-auto gap-20', reverse)}>
      <div className="lg:max-w-lg flex flex-col gap-3">
        <h1 className="text-lg uppercase font-semibold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">{heading}</h1>
        <h2 className="text-4xl font-bold">{subheading}</h2>
        <div className="flex flex-col gap-3">
          <p className="text-lg">{description1}</p>
          <p className="text-lg">{description2}</p>
        </div>
      </div>
      <div className="relative w-[30rem] mx-auto aspect-[16/9]">
        <div className={cn('absolute top-2 left-2 w-full h-full rounded rotate-[-5deg] z-0 shadow-xl', gradient)} />
        <div className="relative z-10 rounded overflow-hidden shadow-2xl">
          <video autoPlay muted loop playsInline preload="auto" title="Click To Play" className="w-full h-full aspect-video transform-gpu perspective-[800px] rotate-y-[0.1deg] transition-transform duration-2000 ease-in-out will-change-transform hover:translate-x-4 hover:translate-y-4">
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}
