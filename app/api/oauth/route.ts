import { appwriteConfig } from '@/config/appwrite';
import { createAdminClient, createSessionClient } from '@/libraries';
import { names } from '@/utilities/names';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { ID, Query } from 'node-appwrite';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  const secret = request.nextUrl.searchParams.get('secret');

  if (!userId || !secret) {
    return NextResponse.json({ error: 'Missing userId or secret' }, { status: 400 });
  }

  console.log({ userId, secret });

  try {
    // Step 1: Create session using admin client
    const { account: adminAccount } = await createAdminClient();
    const session = await adminAccount.createSession(userId, secret);

    // Step 2: Set the session cookie
    (await cookies()).set('appwrite-session', session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });

    // Step 3: Create a session client to get user details
    const { account, databases } = await createSessionClient();
    const user = await account.get();

    console.log(user);

    // Extract details
    const email = user.email;
    const fullname = user.name;
    const profilePictureUrl = user.prefs?.profilePicture || null;

    // Check if user exists in your database
    const existingUser = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, [Query.equal('userId', userId)]);

    if (existingUser.documents.length === 0) {
      const [firstname, lastname] = await names(fullname);

      await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, ID.unique(), {
        fullname,
        firstname,
        lastname,
        email,
        userId,
        avatarUrl: profilePictureUrl,
      });
    }

    return NextResponse.redirect(`${request.nextUrl.origin}/dashboard`);
  } catch (error) {
    console.error('Error during OAuth callback:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
