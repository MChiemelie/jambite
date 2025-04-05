import React from 'react';
import Image from 'next/image';
import { BadgeProps } from '@/types';

export default function Badges({ badges }: BadgeProps) {
  return (
    <div className="flex w-full p-6 rounded-xl bg-muted/50 gap-6 text-sm justify-evenly">
      {badges.map((badge) => (
        <div key={badge.id}>
          <Image width={50} height={50} src={badge.imageUrl} alt={badge.title} className="rounded-full border-2 border-gray-300 object-cover inline-block mx-1" />
        </div>
      ))}
    </div>
  );
}
