'use client';

import { Practice } from '@/layout/practice';
import { getQuestions } from '@/fetchQuestions';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function HelloPage() {
  const { selectedSubjects, selectedSubjectsParameters } = useSelector((state: RootState) => state.practice);

  //   return <><p>Hello👋🏾, Chiemelie.</p><div>{ questionsData }</div></>;
  return (
    <>
      <p>Hello👋🏾, Chiemelie.</p>
      <div>{selectedSubjects}</div>
      <div>{selectedSubjectsParameters}</div>
    </>
  );

  // return <>{questionsData ? <Practice questionsData={questionsData} /> : <p>Loading questions...</p>}</>;
}
