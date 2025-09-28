import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const socials = [
  { name: 'Facebook', url: '#', icon: 'facebook' },
  { name: 'WhatsApp', url: '#', icon: 'whatsapp' },
  { name: 'YouTube', url: '#', icon: 'youtube' },
  { name: 'TikTok', url: '#', icon: 'tiktok' },
  { name: 'Instagram', url: '#', icon: 'instagram' },
  { name: 'LinkedIn', url: '#', icon: 'linkedin' },
  { name: 'X', url: '#', icon: 'x' },
];

export default function Footer() {
  return (
    <footer className="z-20 p-2 lg:p-4 lg:min-h-screen bg-gradient-to-bl from-[#0f172a] via-[#1e1a78] to-[#0f172a] flex flex-col justify-between text-xl text-white">
      <div className="flex flex-col lg:flex-row justify-between mx-auto w-full lg:gap-10 gap-4 p-2 lg:p-4 max-w-7xl">
        <div className="flex flex-col gap-4 lg:gap-10 w-full lg:w-3/5">
          <h2 className="text-2xl lg:text-4xl font-bold flex items-center">👋🏾 We’d love to hear from you</h2>
          <p className="text-base font-medium leading-relaxed">
            Got an idea, feature request, or just wanna say hello? <br />
            Your feedback powers Jambite forward.
          </p>
          <button className="flex items-center w-fit cursor-pointer p-1 lg:p-2 rounded-sm gap-4 bg-gradient-to-r from-sky-600 to-blue-800">
            <ArrowRight className="lg:h-7 lg:w-7 bg-black shadow-lg rounded-full p-1 lg:p-2" />
            <span className="text-lg lg:text-xl font-semibold text-white pr-3">Contact Us</span>
          </button>
        </div>
        <div className="flex flex-col justify-between gap-4 lg:gap-10 w-full lg:w-2/5">
          <div className="flex flex-col gap-2 text-sm sm:text-md">
            <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Terms & Conditions
            </Link>
            <p>© 2023 Jambite™. All Rights Reserved.</p>
          </div>
          <div className="flex gap-4 sm:gap-6">
            {socials.map(({ name, url, icon }) => (
              <Link key={name} href={url} aria-label={`Visit our ${name} page`} className="hover:scale-105 transition">
                <Image src={`/assets/${icon}.svg`} alt={`${name} icon`} width={40} height={40} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Logo */}
      <div className="flex justify-center">
        <Image src="/assets/logo.svg" alt="Jambite Trademark" width={100} height={100} className="w-full" />
      </div>
    </footer>
  );
}
