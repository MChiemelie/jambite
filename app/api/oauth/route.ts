import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Query } from 'node-appwrite';
import { appwriteConfig } from '@/config';
import { createAdminClient } from '@/libraries';
import { getUserAuth } from '@/services';
import { createAccount } from '@/services/auth';

export async function GET(request) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const secret = request.nextUrl.searchParams.get('secret');
    const { account, databases } = await createAdminClient();
    const { documents } = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, [Query.equal('userId', userId)]);

    if (documents.length === 0) {
      const { name, email } = await getUserAuth();
      await createAccount({ fullname: name, email });
    }

    const session = await account.createSession(userId, secret);

    (await cookies()).set('appwrite-session', session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });

    return NextResponse.redirect(`${request.nextUrl.origin}/dashboard`);
  } catch (error) {
    console.error('Error during GET request:', error);
    return NextResponse.json({ error: 'Failed to process the request.' }, { status: 500 });
  }
}
