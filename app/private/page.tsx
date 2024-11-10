import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/services/supabase/server';

export default async function PrivatePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    console.log(error);
    redirect('/particulars');
  }

  return <p>Hello {data.user.email}</p>;
}
