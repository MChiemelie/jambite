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
  { name: 'X', url: '#', icon: 'x' }
];

export default function Footer() {
  return (
    <footer className="z-20 flex min-h-[50vh] flex-col justify-between bg-gradient-to-bl from-[#0f172a] via-[#1e1a78] to-[#0f172a] p-2 text-xl text-white lg:min-h-screen lg:p-4">
      <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-4 p-2 lg:flex-row lg:gap-10 lg:p-4">
        <div className="flex w-full flex-col gap-4 lg:w-3/5 lg:gap-10">
          <h2 className="flex items-center text-2xl font-bold lg:text-4xl">
            <i className="animate-wavePause mx-2">👋🏽</i>
            We’d love to hear from you
          </h2>
          <p className="text-base leading-relaxed font-medium">
            Got an idea, feature request, or just wanna say hello? <br />
            Your feedback powers Jambite forward.
          </p>
          <Link
            href={'/'}
            className="flex w-fit cursor-pointer items-center gap-4 rounded-sm bg-gradient-to-r from-sky-600 to-blue-800 p-1 lg:p-2"
          >
            <ArrowRight className="rounded-full bg-black p-1 shadow-lg lg:h-8 lg:w-8 lg:p-2" />
            <span className="pr-3 text-lg font-semibold text-white lg:text-xl">
              Contact Us
            </span>
          </Link>
        </div>
        <div className="flex w-full flex-col justify-between gap-4 lg:w-2/5 lg:gap-10">
          <div className="sm:text-md flex flex-col gap-2 text-sm">
            <Link
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Terms & Conditions
            </Link>
            <p>© 2023 Jambite™. All Rights Reserved.</p>
          </div>
          <div className="flex gap-4 sm:gap-6">
            {socials.map(({ name, url, icon }) => (
              <Link
                key={name}
                href={url}
                aria-label={`Visit our ${name} page`}
                className="transition hover:scale-105"
              >
                <Image
                  src={`/assets/${icon}.svg`}
                  alt={`${name} icon`}
                  width={40}
                  height={40}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Image
          src="/assets/logo.svg"
          alt="Jambite Trademark"
          width={100}
          height={100}
          className="w-full"
        />
      </div>
    </footer>
  );
}
