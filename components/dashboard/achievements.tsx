import React from 'react';
import { Badges } from '../custom';

const badgesData = [
  {
    id: 1,
    title: 'Beginner',
    description: 'Earned for starting your journey!',
    imageUrl: '/images/avatars/avatar_1.jpg',
  },
  {
    id: 2,
    title: 'Intermediate',
    description: 'Progressing through the challenges!',
    imageUrl: '/images/avatars/avatar_2.jpg',
  },
  {
    id: 3,
    title: 'Expert',
    description: 'Master of the art!',
    imageUrl: '/images/avatars/avatar_3.jpg',
  },
];

export default function Achievements() {
  return <Badges badges={badgesData} />;
}
