'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AuthForm() {
  const supabase = createClientComponentClient();

  return (
    <Auth providers={['google']} supabaseClient={supabase} view="magic_link" appearance={{ theme: ThemeSupa}} theme= "default" showLinks={false} redirectTo="https://jambite.vercel.app/auth/callback" />
  )
}
