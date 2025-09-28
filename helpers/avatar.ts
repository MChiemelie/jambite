'use server';

import { appwriteConfig } from '@/config/appwrite';
import { createSessionClient } from '@/libraries';
import { getUserData, updateProfile } from '@/services';
import { ID } from 'node-appwrite';

export async function createAvatar(file: File) {
  const { storage } = await createSessionClient();

  const newAvatar = await storage.createFile(appwriteConfig.bucketId, ID.unique(), file);

  const newAvatarUrl = await getImageFile(appwriteConfig.bucketId, newAvatar.$id);

  await updateProfile({ avatarUrl: newAvatarUrl, avatarId: newAvatar.$id });

  return newAvatar;
}

export async function updateAvatar(file: File) {
  const { storage } = await createSessionClient();

  const user = await getUserData();
  const oldAvatarId = user?.avatarId;

  if (oldAvatarId) {
    try {
      await storage.deleteFile(appwriteConfig.bucketId, oldAvatarId);
    } catch (error) {
      console.error(error, user.avatarId);
    }
  }

  await createAvatar(file);

  return;
}

async function getImageFile(bucketId: string, avatarId: string) {
  return `${appwriteConfig.endpointUrl}/storage/buckets/${bucketId}/files/${avatarId}/view?project=${appwriteConfig.projectId}`;
}
