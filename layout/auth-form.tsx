'use client';

import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClient } from '@/services/supabase/client';

export default function AuthForm() {
  const supabase = createClient();

  return (
    <div className='bg-black'>
      <Auth providers={['google']} supabaseClient={supabase} view="magic_link" appearance={{ theme: ThemeSupa }} theme="default" showLinks={false} redirectTo="http://localhost:3000/auth/confirm" />
  </div>
  );
}
