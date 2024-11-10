'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Macbook } from '@/components/ui';
import { HeroHighlight, Highlight } from '@/components/ui/hero-highlight';
import { Nav } from '@/layout';
import Link from 'next/link';

const HeroText = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const textTransform = useTransform(scrollYProgress, [0, 0.3], [0, 100]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <motion.div style={{ translateY: textTransform, opacity: textOpacity }} className="text-center space-y-8 w-[80%] mx-auto py-12">
      <div className="relative">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_100%,black)]"></div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: [20, -5, 0] }} transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }} className="px-4 md:text-4xl lg:text-6xl text-neutral-800 dark:text-white leading-relaxed lg:leading-snug text-center mx-auto text-4xl sm:text-7xl font-extrabold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 to-neutral-950">
          Ace Your JAMB <br />
          with <Highlight className="text-black dark:text-white">AI assisted CBT Practice!</Highlight>
        </motion.h1>
      </div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="font-semibold text-[1.125rem] leading-[1.5rem]">
        Practice your JAMB Computer Based Test, answers reviewed with an AI assistant, track your progress and performance, improve and compete with other Jambites, put yourself ahead in the game, pass with flying colours, and study your dream course.
      </motion.p>
      <motion.div initial={{ width: '0%', scaleX: 0 }} animate={{ width: '100%', scaleX: 1 }} transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }} className="mx-auto flex justify-center">
        <Link href="/signIn" className="w-[25%] flex items-center justify-center h-10 text-md animate-shimmer rounded-md border border-slate-300 bg-white bg-[linear-gradient(110deg,#e5e7eb,45%,#cbd5e1,55%,#e5e7eb)] bg-[length:200%_100%] px-6 font-medium text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-white">
          Get Started
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default function Hero() {
  return (
    <HeroHighlight className="w-full h-full">
      <Nav />
      <HeroText />
      <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 2 }}>
        <Macbook src="/herolight.png" />
      </motion.div>
    </HeroHighlight>
  );
}
