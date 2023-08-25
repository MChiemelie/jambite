import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Question } from '@/components';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

async function getQuestionsData(subject: string) {
  const res = await fetch(`https://questions.aloc.com.ng/api/v2/m?subject=${subject}`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'AccessToken': process.env.ACCESS,
    },
 
    method: 'GET',
  });
  return res.json();
 }

export default async function Page({ params }: { params: { subject: string } }) {
  const supabase = createServerComponentClient({ cookies })

  const { data: { session } } = await supabase.auth.getSession();

  const questionsData = await getQuestionsData(params.subject);

  return (
    <>
    <Question session={session} questionsData={questionsData} />;
    </>
  )
}
