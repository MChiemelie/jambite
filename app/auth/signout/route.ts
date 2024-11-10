import { createClient } from '@/services/supabase/server';
import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = createClient();

  const { user } = (await (await supabase).auth.getUser()).data;

  if (user) {
    (await supabase).auth.signOut();
  }

  revalidatePath('/', 'layout');
  return NextResponse.redirect(new URL('/particulars', req.url), {
    status: 302
  });
}
