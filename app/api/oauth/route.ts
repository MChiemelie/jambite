import { appwriteConfig } from '@/config/appwrite';
import { createAdminClient } from '@/libraries';
import { getUserAuth } from '@/services';
import { createAccount } from '@/services/auth';
import { UserAuth } from '@/types';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Query } from 'node-appwrite';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const secret = request.nextUrl.searchParams.get('secret');

    if (!userId || !secret) {
      return NextResponse.json({ error: 'Missing userId or secret' }, { status: 400 });
    }

    const { account, databases, storage } = await createAdminClient();

    // ensure we have a user record
    const { documents } = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, [Query.equal('userId', userId)]);

    let userDoc = documents[0];
    if (!userDoc) {
      const { name, email } = (await getUserAuth()) as UserAuth;
      userDoc = await createAccount({ fullname: name, email });
    }

    // create session for this user
    const session = await account.createSession(userId, secret);

    // ✅ get provider access token directly from session
    const accessToken = session.providerAccessToken;

    if (accessToken) {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const profile = await res.json();

      if (profile.picture) {
        const imageRes = await fetch(profile.picture);
        const buffer = Buffer.from(await imageRes.arrayBuffer());

        const file = await storage.createFile(appwriteConfig.bucketId, 'unique()', new File([buffer], 'avatar.jpg', { type: 'image/jpeg' }));

        await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, userDoc.$id, { avatarId: file.$id });
      }
    }

    // set auth cookie
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
