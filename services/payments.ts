'use server';

import { appwriteConfig } from '@/config/appwrite';
import { createSessionClient } from '@/libraries';
import { ID, Query } from 'node-appwrite';
import { getUserData } from './auth';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function makePayment(amount: number) {
  try {
    const user = await getUserData();
    const { email } = user;

    const response = await fetch(`${BASE_URL}/api/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'initialize',
        amount,
        email,
        callback_url: `${BASE_URL}/payments/verify`,
        metadata: {
          cancel_action: `${BASE_URL}/payments/cancel`,
        },
      }),
    });
    return response.json();
  } catch (error) {
    console.error('Failed to initialize payment:', error);
    throw error;
  }
}

async function verifyPayment(reference: string, userId: string) {
  try {
    const response = await fetch(`${BASE_URL}/api/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify', reference, userId }),
    });

    return response.json();
  } catch (error) {
    console.error('Failed to verify payment:', error);
    throw error;
  }
}

async function getPayments(currentPage: number, perPage: number) {
  try {
    const response = await fetch(`${BASE_URL}/api/payments?action=transactions&page=${currentPage}&perPage=${perPage}`);
    return response.json();
  } catch (error) {
    console.error('Failed to fetch payments:', error);
    throw error;
  }
}

async function decrementTrials() {
  try {
    const user = await getUserData();
    const { userId } = user;
    const { databases } = await createSessionClient();
    const { documents } = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, [Query.equal('userId', userId)]);

    if (documents.length > 0) {
      const userDocumentId = documents[0].$id;
      const { trials } = documents[0];
      const updatedTrials = Math.max((trials || 0) - 1, 0);

      await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, userDocumentId, { trials: updatedTrials });
    }
  } catch (error) {
    console.error('Failed to decrement trials:', error);
  }
}

async function disableAI() {
  try {
    const user = await getUserData();
    const { userId } = user;
    const { databases } = await createSessionClient();
    const { documents } = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, [Query.equal('userId', userId)]);

    if (documents.length > 0) {
      const userDocumentId = documents[0].$id;
      await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, userDocumentId, { ai: false });
    }
  } catch (error) {
    console.error('Failed to disable AI:', error);
  }
}

export { makePayment, verifyPayment, decrementTrials, getPayments, disableAI };
