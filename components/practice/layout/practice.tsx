'use client';

import { AIButton, AIReview, Candidate, Feedback, NextQuestionButton, Pagination, PreviousQuestionButton, QuestionBlock, QuestionHeader, TopControls } from '@/components/practice';

export default function Practice() {
  return (
    <div className='min-h-screen min-w-full bg-white text-black select-none'>
      <TopControls />
      <div className='flex flex-col gap-4 p-4 md:flex-row'>
        <div className='w-full rounded border-2 border-gray-300'>
          <QuestionHeader />
          <QuestionBlock />
          <div className='flex flex-col gap-8 p-4 md:p-6'>
            <AIReview />
            <Feedback />
            <div className='grid max-w-lg grid-cols-4 gap-3'>
              <PreviousQuestionButton />
              <NextQuestionButton />
              <AIButton />
            </div>
            <Pagination />
          </div>
        </div>
        <Candidate />
      </div>
      <h1 className='sr-only'>Take your time to study and attempt all questons.</h1>
    </div>
  );
}
