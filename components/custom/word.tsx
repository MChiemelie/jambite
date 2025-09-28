'use client';

import { useState } from 'react';
import { Word } from '@/types';
import parse from 'html-react-parser';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function Word({ words }: { words: Word[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentWord = words[currentIndex];

  return (
    <div className="rounded bg-muted/50 w-full md:min-h-full p-4 gap-4 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <button onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, words.length - 1))} disabled={currentIndex === words.length - 1} className={`flex items-center gap-2 font-semibold ${currentIndex === words.length - 1 ? 'text-gray-400' : 'text-blue-500'}`} aria-label="Previous word">
          <ArrowLeft size={20} aria-hidden="true" />
        </button>

        <span className="text-sm font-medium">{currentWord.pubDate}</span>

        <button onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))} disabled={currentIndex === 0} className={`flex items-center gap-2 font-semibold ${currentIndex === 0 ? 'text-gray-400' : 'text-blue-500'}`} aria-label="Next word">
          <ArrowRight size={20} aria-hidden="true" />
        </button>
      </div>

      <div className="flex items-center gap-4 text-end">
        <h2 className="text-3xl font-semibold">{currentWord.word}</h2>
        <span className="text-blue-600 text-xs">
          {currentWord.pronunciation ? `${currentWord.pronunciation}` : ''}
          {currentWord.partOfSpeech ? ` • ${currentWord.partOfSpeech}` : ''}
          {currentWord.nounType ? ` • ${currentWord.nounType}` : ''}
        </span>
      </div>

      <p className="text-sm md:text-md lowercase overflow-auto max-h-20">{currentWord.meaningHTML ? parse(currentWord.meaningHTML) : 'No meaning available.'}</p>
      <p className="text-sm md:text-md italic overflow-auto max-h-20">{currentWord.exampleHTML ? parse(currentWord.exampleHTML) : 'No example available.'}</p>

      <div className="text-center">
        <p className="text-xs">
          <strong>Word of the Day Podcast by Merriam Webster</strong>
        </p>
        {currentWord.audioUrl && (
          <audio key={currentWord.audioUrl} controls className="w-full p-1">
            <source src={currentWord.audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <p className="text-xs text-gray-500">
          Powered by{' '}
          <a href="https://www.merriam-webster.com/word-of-the-day" className="text-blue-500 font-semibold text-xs" target="_blank" rel="noopener noreferrer">
            Merriam-Webster's Word of the Day
          </a>
        </p>
        <Image width={50} height={50} src="/images/special/merriam-webster.jpeg" alt="Merriam-Webster Logo" />
      </div>
    </div>
  );
}
