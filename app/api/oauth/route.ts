import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { ID, Query } from 'node-appwrite';
import { appwriteConfig } from '@/config/appwrite';
import { createAdminClient, createSessionClient } from '@/libraries';
import { names } from '@/utilities/names';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  const secret = request.nextUrl.searchParams.get('secret');

  if (!userId || !secret) {
    return NextResponse.redirect(`${request.nextUrl.origin}/sign-up?error=missing_params`);
  }

  try {
    const { account: admin } = await createAdminClient();

    const session = await admin.createSession(userId, secret);

    (await cookies()).set('appwrite-session', session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });

    const { account, databases } = await createSessionClient();
    const user = await account.get();
    const { email, name: fullname } = user;

    const profilePictureUrl = user.prefs?.profilePicture || null;

    const existingUser = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, [Query.equal('userId', userId)]);

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
