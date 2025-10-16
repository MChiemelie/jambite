'use client';

import { AIButton, AIReview, Candidate, Feedback, NextQuestionButton, Pagination, PreviousQuestionButton, QuestionBlock, QuestionHeader, TopControls } from '@/components/practice';

export default function Practice() {
  return (
    <div className='bg-white text-black min-h-screen min-w-full select-none'>
      <TopControls />
      <div className='flex flex-col md:flex-row p-4 gap-4'>
        <div className='border-2 border-gray-300 rounded w-full'>
          <QuestionHeader />
          <QuestionBlock />
          <div className='flex flex-col gap-8 p-4 md:p-6'>
            <AIReview />
            <Feedback />
            <div className='grid grid-cols-4 gap-3 max-w-lg'>
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
