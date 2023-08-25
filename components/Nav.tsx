"use client"

import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles';
import { useState, useEffect } from 'react';
import { ThemeButton } from '@/components'

export default function Nav() {
  const [nav, setNav] = useState(false);
  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  });

  return (
    <nav className={`w-full fixed top-0 left-0 right-0 z-10 ${scroll && styles.blur}`}>
      <div className="justify-between px-2 mx-auto sm:items-center sm:flex m-2">
  
        <div className={styles.centerbetween}>
          <Image src='/logo.png' alt='logo' width={100} height={100} className={styles.logo} />
          <div className="flex items-center space-x-2">
  
            <div className="block sm:hidden">
              <ThemeButton />
            </div>
  
            <div className="sm:hidden">
              <button aria-label="Toggle Navigation Menu" className={styles.toggle} onClick={() => setNav(!nav)}>
                {nav ? (
                  <svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={styles.svg}>
                    <path d="M12.0007 10.5865L16.9504 5.63672L18.3646 7.05093L13.4149 12.0007L18.3646 16.9504L16.9504 18.3646L12.0007 13.4149L7.05093 18.3646L5.63672 16.9504L10.5865 12.0007L5.63672 7.05093L7.05093 5.63672L12.0007 10.5865Z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={styles.svg}>
                    <path d="M3 4H21V6H3V4ZM9 11H21V13H9V11ZM3 18H21V20H3V18Z"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
  
        <div className="flex space-x-4">
          <div className="hidden sm:flex items-center justify-center">
            <ThemeButton />
          </div>
  
          <div className={`w-full sm:block flex justify-end ${nav ? 'p-2 sm:p-0 block' : 'hidden'}`}>
            <ul className={` ${nav && 'p-2 bg-gray-700 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-40 rounded'} w-full sm:flex items-center sm:space-x-14 p-3 sm:p-0 sm:divide-y-0 divide-y-2 divide-accent-1 border sm:border-0 border-accent-3`}>
              <li className={`font-medium text-lg lg:text-xl lg:px-4 sm:px-3 py-2 text-center ${scroll && 'sm:text-base'}`}>
                <Link href="/dashboard" onClick={() => setNav(!nav)}>Dashboard</Link>
              </li>
              <li className={`font-medium text-lg lg:text-xl lg:px-4 sm:px-3 py-2 text-center ${scroll && 'sm:text-base'}`}>
                <Link href="/pricing" onClick={() => setNav(!nav)}>Pricing</Link>
              </li>
              <li className={`font-medium text-lg lg:text-xl lg:px-4 sm:px-3 py-4 text-center ${scroll && 'sm:text-base'}`}>
                <Link href="/signIn" className={styles.signin}>Sign In</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}