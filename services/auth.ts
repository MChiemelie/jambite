'use server';

import { appwriteConfig } from '@/config/appwrite';
import { createAdminClient, createSessionClient } from '@/libraries';
import { UpdateUser } from '@/types';
import { parseStringify } from '@/utilities';
import { names } from '@/utilities/names';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { ID, OAuthProvider, Query } from 'node-appwrite';

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, [Query.equal('email', [email])]);

  return result.total > 0 ? result.documents[0] : null;
};

const handleError = (error: unknown, message: string) => {
  console.error(error, message);
  throw error;
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email);

    return session.userId;
  } catch (error) {
    handleError(error, 'Failed to send email OTP');
  }
};

export const createAccount = async ({ fullname, email }: { fullname: string; email: string }) => {
  const existingUser = await getUserByEmail(email);

  const userId = await sendEmailOTP({ email });
  if (!userId) throw new Error('Failed to send an OTP');

  if (!existingUser) {
    const { databases } = await createAdminClient();

    const [firstname, lastname] = await names(fullname);

    await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, ID.unique(), {
      fullname,
      firstname,
      lastname,
      email,
      userId,
      trials: 0,
      currentStreak: 0,
      longestStreak: 0,
    });
  }

  return parseStringify({ userId });
};

export const updateProfile = async (updates: UpdateUser) => {
  try {
    const { databases, account } = await createSessionClient();
    const sessionUser = await account.get();

    const { documents, total } = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, [Query.equal('userId', sessionUser.$id)]);

    if (total === 0) throw new Error('User not found');

    const userDoc = documents[0];

    const { email, ...safeUpdates } = updates as any;

    const updated = await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, userDoc.$id, safeUpdates);

    return parseStringify(updated);
  } catch (error) {
    handleError(error, 'Failed to update profile');
  }
};

export const verifySecret = async ({ userId, password }: { userId: string; password: string }) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createSession(userId, password);

    (await cookies()).set('appwrite-session', session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, 'Failed to verify OTP');
  }
};

export const getUserData = async () => {
  try {
    const { databases, account } = await createSessionClient();
    const sessionUser = await account.get();

    const { documents, total } = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, [Query.equal('userId', sessionUser.$id)]);

    if (total === 0) {
      console.warn(`No user found for userId: ${sessionUser.$id}`);
      return null;
    }

    return parseStringify(documents[0]);
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw new Error('Failed to fetch user data.');
  }
};

export const getUserAuth = async () => {
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch (error) {
    console.error('Error fetching user authentication:', error);
    return null;
  }
};

export const signOutUser = async () => {
  const { account } = await createSessionClient();

  try {
    await account.deleteSession('current');
    (await cookies()).delete('appwrite-session');
  } catch (error) {
    handleError(error, 'Failed to sign out user');
  } finally {
    redirect('/sign-in');
  }
};

export const signInUser = async ({ email }: { email: string }) => {
  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      await sendEmailOTP({ email });
      return parseStringify({ userId: existingUser.userId });
    }

    return parseStringify({ userId: null, error: 'User not found. Try sign up.' });
  } catch (error) {
    handleError(error, 'Failed to sign in user');
  }
};

export async function signUpWithGoogle() {
  const { account } = await createAdminClient();

  const origin = (await headers()).get('origin');

  const redirectUrl = await account.createOAuth2Token(OAuthProvider.Google, `${origin}/api/oauth`, `${origin}/sign-up`);

  await redirect(redirectUrl);
}
