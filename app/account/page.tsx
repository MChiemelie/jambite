import React from 'react';
import AccountForm from '@/layout/account-form';
import { createClient } from '@/services/supabase/server';

export default async function Account() {
  const supabase = await createClient();

  const { user } = (await supabase.auth.getUser()).data;

  return <AccountForm user={user} />;
}
