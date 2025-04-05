'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Testimonials() {
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Chukwuemeka Okonkwo',
      image: '/a1.jpg',
      score: 325,
      testimonial: 'My journey with Jambite has been incredible. With their guidance and study materials, I achieved a score of 325 in the JAMB exams. This opened doors to opportunities I never thought possible. I am truly grateful!',
    },
    {
      id: 2,
      name: 'Fatima Ibrahim',
      image: '/a2.jpg',
      score: 310,
      testimonial: 'Jambite transformed my approach to JAMB exams. Through their well-structured resources, I was able to attain a score of 310. This achievement has propelled me toward my academic aspirations. Thank you, Jambite!',
    },
    {
      id: 3,
      name: 'Oluwaseun Adeleke',
      image: '/a3.jpg',
      score: 340,
      testimonial: "With determination and Jambite's support, I secured a remarkable score of 340 in my JAMB exams. Their practice tests and study materials were pivotal in my success. I highly recommend Jambite!",
    },
    {
      id: 4,
      name: 'Chinedu Onyejekwe',
      image: '/a4.jpg',
      score: 295,
      testimonial: "Jambite's comprehensive study materials and guidance elevated my JAMB score to 295. This achievement is a testament to their commitment to excellence. I'm honored to have been a part of the Jambite community.",
    },
    {
      id: 5,
      name: 'Amina Mohammed',
      image: '/a4.jpg',
      score: 330,
      testimonial: 'I owe my JAMB success to Jambite. Their study resources empowered me to secure a score of 330. The personalized learning experience and insightful materials were invaluable. I recommend Jambite without hesitation!',
    },
    {
      id: 6,
      name: 'Mustapha Shettima',
      image: '/a2.jpg',
      score: 300,
      testimonial: 'Jambite played a pivotal role in my JAMB journey. With their support, I achieved a score of 300, surpassing my own expectations. The practice tests and expert guidance were instrumental in my achievement.',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  });

  const currentTestimonial = testimonials[currentTestimonialIndex];

  return (
    <section className="w-4/5 max-w-2xl mx-auto text-center bg-clip-padding backdrop-filter backdrop-blur-xs bg-opacity-10 p-6">
      <div className="flex justify-center">
        <Image src={currentTestimonial.image} width={100} height={100} alt={currentTestimonial.name} className="w-fit mb-8 rounded" />
      </div>
      <p className="leading-relaxed">{currentTestimonial.testimonial}</p>
      <span className="inline-block h-1 w-16 rounded bg-accent-4 mt-6 mb-4"></span>
      <h2 className="text-accent-1 font-bold tracking-wider text-2xl">{currentTestimonial.name}</h2>
      <p>{currentTestimonial.score}</p>
    </section>
  );
}
