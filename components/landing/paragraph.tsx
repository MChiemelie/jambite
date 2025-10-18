'use client';

import { type MotionValue, motion, useScroll, useTransform } from 'motion/react';
import { type ReactNode, useRef } from 'react';

export default function Paragraph() {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.5', 'start 0.07']
  });

  const paragraph = `Since JAMB switched to CBT in 2013, countless students have struggled with tech anxiety and limited computer access. Jambite goes beyond practice questions to deliver a full exam experience that builds confidence and readiness. We’re here to turn anxiety into success and make the journey into higher education smooth.`;
  const words = paragraph.split(' ');

  return (
    <p ref={containerRef} className='flex flex-wrap text-sm/relaxed sm:text-md/relaxed lg:text-lg/relaxed leading-tight font-meduim max-w-[700px] text-sky-50 text-shadow-xs text-shadow-gray-800 text-justify'>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </p>
  );
}

interface WordProps {
  children: string;
  progress: MotionValue;
  range: [number, number];
}

function Word({ children, progress, range }: WordProps) {
  const amount = range[1] - range[0];
  const step = amount / children.length;

  return (
    <span className='relative mr-3 mt-3'>
      {children.split('').map((char, i) => {
        const charStart = range[0] + i * step;
        const charEnd = range[0] + (i + 1) * step;
        return (
          <Char key={`char_${i}`} progress={progress} range={[charStart, charEnd]}>
            {char}
          </Char>
        );
      })}
    </span>
  );
}

interface CharProps {
  children: ReactNode;
  progress: MotionValue;
  range: [number, number];
}

function Char({ children, progress, range }: CharProps) {
  const opacity = useTransform(progress, range, [0, 1]);

  return (
    <span className='relative inline-block'>
      <span className='absolute opacity-20'>{children}</span>
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
}
