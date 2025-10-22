import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jambite - AI-Assisted JAMB CBT Practice & Past Questions',
  description:
    'Practice and ace JAMB CBT with Jambite — AI-assisted CBT practice, past questions, and detailed analytics.',
  keywords: [
    'JAMB practice',
    'JAMB CBT 2025',
    'JAMB past questions',
    'UTME preparation',
    'AI exam practice',
    'JAMB practice test',
    'JAMB questions and answers',
    'JAMB 2025 preparation'
  ],
  authors: [{ name: 'Chiemelie Melikam' }],
  creator: 'Jambite',
  publisher: 'Jambite',
  metadataBase: new URL('https://jambite.ng'),
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'http://localhost:3000',
    languages: {
      en: 'https://jambite.ng'
    }
  },
  openGraph: {
    title: 'Jambite - Free AI-Assisted JAMB CBT Practice & Past Questions',
    description:
      'Ace your JAMB with Jambite — AI-assisted CBT practice, UTME past questions, and personalized exam prep.',
    url: 'https://jambite.ng',
    siteName: 'Jambite',
    images: [
      {
        url: 'https://jambite.ng/images/hero/student_practicing_jamb_cbt_with_ai.jpg',
        width: 1200,
        height: 630,
        alt: 'Jambite - Ace JAMB with AI Practice'
      }
    ],
    locale: 'en_NG',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jambite - AI-Assisted JAMB CBT Practice',
    description:
      'Boost your JAMB score with AI-assisted CBT practice and past questions on Jambite.',
    images: [
      'https://jambite.ng/images/hero/student_practicing_jamb_cbt_with_ai.jpg.jpg'
    ],
    creator: '@jambite_ng'
  },
  category: 'education'
};
