import { NextRequest, NextResponse } from 'next/server';
import { appwriteConfig } from '@/config/appwrite';
import { createAdminClient } from '@/libraries';
import { createAccount } from '@/services/auth';
import { cookies } from 'next/headers';
import { Query } from 'node-appwrite';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const secret = request.nextUrl.searchParams.get('secret');

    if (!userId || !secret) {
      return NextResponse.json({ error: 'Missing userId or secret' }, { status: 400 });
    }

    const { account, databases, storage } = await createAdminClient();

    // 1. Create session from Appwrite
    const session = await account.createSession(userId, secret);

    // set cookie
    (await cookies()).set('appwrite-session', session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });

    // fetch user info (this gives you name + email)
    const user = await account.get(); // <-- ✅ has name, email, etc.

    // 2. Check if user exists in DB
    const { documents } = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, [Query.equal('userId', userId)]);

    let userDoc = documents[0];

    if (!userDoc) {
      const fullname = user.name || user.email.split('@')[0];

      userDoc = await createAccount({
        fullname,
        email: user.email,
      });
    }

    // 3. Save Google profile pic if available
    if (session.providerAccessToken) {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${session.providerAccessToken}` },
      });

      const profile = await res.json();

      if (profile.picture) {
        const imgRes = await fetch(profile.picture);
        const buffer = Buffer.from(await imgRes.arrayBuffer());

        const file = await storage.createFile(appwriteConfig.bucketId, 'unique()', {
          type: 'image/jpeg',
          size: buffer.length,
          filename: 'avatar.jpg',
          stream: buffer,
        } as any);

        await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, userDoc.$id, { avatarId: file.$id });
      }
    }

    // 4. Save cookie
    (await cookies()).set('appwrite-session', session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });

    // 5. Redirect
    return NextResponse.redirect(`${request.nextUrl.origin}/dashboard`);
  } catch (err) {
    console.error('OAuth error:', err);
    return NextResponse.redirect(`${request.nextUrl.origin}/sign-in?error=oauth_failed`);
  }
}
