import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { ID, Query } from 'node-appwrite';
import { appwriteConfig } from '@/config/appwrite';
import { createAdminClient, createSessionClient } from '@/libraries';
import { names } from '@/utilities/names';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  const secret = request.nextUrl.searchParams.get('secret');

  console.log('OAuth Callback received:', { userId, secret });

  if (!userId || !secret) {
    console.error('Missing OAuth parameters');
    return NextResponse.redirect(`${request.nextUrl.origin}/sign-up?error=missing_params`);
  }

  try {
    // Create admin client and session
    const { account: admin } = await createAdminClient();

    // IMPORTANT: Pass userId and secret as separate arguments, not as an object
    const session = await admin.createSession(userId, secret);

    console.log('Session created successfully:', session.$id);

    // Set the session cookie
    (await cookies()).set('appwrite-session', session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });

    // Get user details with the new session
    const { account, databases } = await createSessionClient();
    const user = await account.get();
    const { email, name: fullname } = user;

    console.log('User authenticated:', email);

    const profilePictureUrl = user.prefs?.profilePicture || null;

    // Check if user already exists
    const existingUser = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, [Query.equal('userId', userId)]);

    // Create user document if new user
    if (existingUser.documents.length === 0) {
      const [firstname, lastname] = await names(fullname);

      await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, ID.unique(), {
        fullname,
        firstname,
        lastname,
        email,
        userId,
        avatarUrl: profilePictureUrl
      });

      console.log('New user document created');
    }

    return NextResponse.redirect(`${request.nextUrl.origin}/dashboard`);
  } catch (error: any) {
    console.error('OAuth callback error:', error);
    console.error('Error type:', error?.type);
    console.error('Error message:', error?.message);
    console.error('Error code:', error?.code);

    return NextResponse.redirect(`${request.nextUrl.origin}/sign-up?error=auth_failed`);
  }
}
