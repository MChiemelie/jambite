'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles';
import Link from 'next/link';
import Lottie from 'lottie-react';
import hero from '../public/hero.json';

export default function Hero() {
  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  });

  return (
    <>
      <div className='md:flex justify-between my-24 pt-24 lg:pt-32 md:pb-10 mb-2 md:mx-12'>
        <div className='w-5/6 md:w-full space-y-6 mx-auto self-center'>
          <h1 className='text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-center md:text-left font-extrabold'>
            Ace Your JAMB!
          </h1>
          <p className={`text-center md:text-left mx-auto lg:m-0 w-full py-2 font-medium leading-7 sm:leading-9 ${styles.fontsizelg}`}>
            Practice your JAMB Computer Based Test, and put yourself ahead in the game. With a wide range of 17 subjects
            available, prepare effectively for your exams by accessing a comprehensive collection of over 20,000 past questions.
          </p>
          <Link href="/signIn" className='flex bg-accent-1 text-white hover:scale-105 w-4/5 md:w-2/3 mx-auto md:mx-0 my-3 py-2 lg:py-3 rounded-sm text-base justify-center'>
            Get Started
          </Link>
        </div>
        <Lottie className='mx-auto w-3/5 md:w-5/6 lg:w-4/5 my-2 md:my-0' animationData={hero} />
      </div>
      <div className={`${scroll && 'hidden'} ${styles.blur} absolute bottom-0 left-1/2 animate-bounce p-2 w-10 h-10 ring-1 ring-slate-900/5 dark:ring-slate-200/20 shadow-lg flex mx-auto`}>
        <svg className="w-6 h-6 text-accent-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </>
  )
};