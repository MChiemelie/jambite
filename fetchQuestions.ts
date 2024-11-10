import { subjectPathMap } from '@/subjects';
import axios from 'axios';
import { Question } from './types/practice';

export async function getQuestions(subjects: string[], randomYear: string): Promise<Record<string, Question[]>> {
  console.log('Fetching questions with subjects:', subjects, randomYear);


  try {
    const englishResponse = await axios.get(`https://questions.aloc.com.ng/api/v2/m/5?subject=english&year=${randomYear}&random=false&withComprehension=true`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        AccessToken: 'QB-e5edfb9a38eb289ccc9e',
      },
    });

    const englishData = englishResponse.data;
    const englishQuestions: Question[] = englishData.data;

    const fetchedQuestions = await Promise.all(
      subjects.map(async (subject) => {
        try {
          const response = await axios.get(`https://questions.aloc.com.ng/api/v2/q/3?subject=${subject}`, {
            headers: {
              Accept: 'application/json',
              AccessToken: 'QB-e5edfb9a38eb289ccc9e',
              'Content-Type': 'application/json',
            },
          });
          const subjectName = subjectPathMap[subject];
          return { subject: subjectName, questions: response.data.data };
        } catch (error) {
          console.error(`Failed to fetch questions for subject ${subject}:`, error);
          return { subject: subjectPathMap[subject], questions: [] };
        }
      })
    );

    const questionsBySubject = fetchedQuestions.reduce(
      (acc, { subject, questions }) => {
        acc[subject] = questions;
        return acc;
      },
      { 'Use of English': englishQuestions } as { [subject: string]: Question[] }
    );

    console.log('Final result of fetch:', questionsBySubject);

    return questionsBySubject;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
}
