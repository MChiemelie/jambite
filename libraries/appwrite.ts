'use server';

import { cookies } from 'next/headers';
import { Account, Avatars, Client, Databases, Storage } from 'node-appwrite';
import { appwriteConfig } from '@/config';

export async function createSessionClient() {
  const client = new Client().setEndpoint(appwriteConfig.endpointUrl).setProject(appwriteConfig.projectId);

  const session = (await cookies()).get('appwrite-session');

  if (!session || !session.value) {
    throw new Error('No session');
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },

    get databases() {
      return new Databases(client);
    },
  };
}

export async function createAdminClient() {
  const client = new Client().setEndpoint(appwriteConfig.endpointUrl).setProject(appwriteConfig.projectId).setKey(appwriteConfig.secretKey);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
    get avatars() {
      return new Avatars(client);
    },
  };
}
