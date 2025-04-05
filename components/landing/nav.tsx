'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Nav() {
  return (
    <motion.nav className="flex justify-between items-center p-[2%] text-sm font-semibold" initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
      <Image src="/logo.png" alt="logo" width={100} height={100} className="w-[4%] min-w-8 max-w-14 rounded-sm z-10" />
      <Link href="/sign-in" className="p-[2px] relative z-10">
        <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-purple-500 rounded-lg" />
        <div className="flex items-center justify-center gap-2 px-8 py-[0.5rem] bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
          <span>Sign In</span>
          <LogIn />
        </div>
      </Link>
    </motion.nav>
  );
}
