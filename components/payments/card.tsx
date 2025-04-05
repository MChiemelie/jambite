'use client';

import { useEffect, useState } from 'react';
import { Rss } from 'lucide-react';
import Image from 'next/image';
import { getUserData } from '@/services';

export default function Card({ authorization }) {
  const { bank, channel, brand, last4, exp_month, exp_year } = authorization;
  const defaultImg = '/images/banks/default-image.png';
  const imgSrc = `/images/banks/${bank && bank !== 'default' ? bank : 'default-image'}.png`;

  const [imageSrc, setImageSrc] = useState(imgSrc);
  const [name, setName] = useState('Loading...');

  const handleImageError = () => {
    setImageSrc(defaultImg);
  };

  useEffect(() => {
    async function fetchName() {
      try {
        const { name } = await getUserData();
        setName(name || 'Unknown');
      } catch {
        setName('Unknown');
      }
    }
    fetchName();
  }, []);

  return (
    <div className="aspect-16/10 bg-linear-to-br from-gray-100 via-gray-200 to-gray-300 rounded-lg p-4 shadow-lg w-96 mx-auto gap-6">
      <div className="flex justify-between items-center">
        <Image src={imageSrc} alt={`${bank} logo`} width={30} height={30} onError={handleImageError} />
        <Image src={`/images/cards/${brand}.${brand === 'visa' ? 'png' : 'svg'}`} alt={`${brand} logo`} width={50} height={50} />
      </div>

      <div className="flex items-center gap-4">
        <Image src="/images/special/emv.png" alt="EMV Chip" width={50} height={50} />
        <Rss className="rotate-[45deg]" size={30} />
      </div>

      <div className="flex justify-evenly items-center text-2xl font-medium leading-10 font-card tracking-widest">
        <span>****</span> <span>****</span> <span>****</span> <span>{last4}</span>
      </div>

      <div className="flex justify-between items-end">
        <p className="text-xl font-medium font-card uppercase">{name}</p>
        <div className="flex flex-col text-right">
          <span className="text-[0.45rem] tracking-wider">MONTH/YEAR</span>
          <span className="font-card text-md">
            {exp_month}/{exp_year.toString().slice(-2)}
          </span>
        </div>
      </div>
    </div>
  );
}
