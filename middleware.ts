import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

const routes = {
  protected: ['/dashboard', '/practice', '/analytics', '/leaderboard', '/payments'],
  public: ['/sign-in', '/sign-up', '/']
};

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = (await cookies()).get('appwrite-session');

  if (routes.protected.includes(pathname) && !session) {
    return NextResponse.redirect(new URL('/sign-in', req.nextUrl));
  }

  if (routes.public.includes(pathname) && session) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
};
