'use client';

import { AIReview, Candidate, TopControls, Header, NextQuestionButton, PreviousQuestionButton, Pagination, Feedback, QuestionBlock, AIButton } from '@/components/practice';

export default function Practice() {
  return (
    <div className="bg-white text-black min-h-screen">
      <TopControls />
      <div className="md:flex p-4 gap-4">
        <div className="border-2 border-gray-300 rounded w-full">
          <Header />
          <QuestionBlock />
          <div className="flex flex-col gap-8 p-6">
            <AIReview />
            <Feedback />
            <div className="flex gap-3">
              <PreviousQuestionButton />
              <NextQuestionButton />
              <AIButton />
            </div>
            <Pagination />
          </div>
        </div>
        <Candidate />
      </div>
    </div>
  );
}
