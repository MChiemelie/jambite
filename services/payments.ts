'use server';

import { Query } from 'node-appwrite';
import { appwriteConfig } from '@/config';
import { createSessionClient } from '@/libraries';
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

async function verifyPayment(reference: string) {
  try {
    const response = await fetch(`${BASE_URL}/api/payments?action=verify&reference=${reference}`);
    return response.json();
  } catch (error) {
    console.error('Failed to verify payment:', error);
    throw error;
  }
}

async function getSubscription() {
  try {
    const user = await getUserData();
    const { email } = user;

    const response = await fetch(`${BASE_URL}/api/payments?action=subscription&email=${email}`);
    return response.json();
  } catch (error) {
    console.error('Failed to fetch subscription:', error);
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

async function incrementTrials(paymentData: any) {
  try {
    const user = await getUserData();
    const { trials, userId, ai } = user;
    const key = paymentData.amount;

    console.log('incrementTrials initial data:', paymentData.amount, trials, userId);

    const trialIncrements: Record<number, number> = {
      350000: 1,
      500000: 1,
      3000000: 7,
      9000000: 9,
    };

    const increment = trialIncrements[key] || 0;
    const updatedTrials = (trials || 0) + increment;
    const { databases } = await createSessionClient();
    const { documents } = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, [Query.equal('userId', userId)]);

    if (documents.length > 0) {
      const userDocumentId = documents[0].$id;
      await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, userDocumentId, { trials: updatedTrials });
      console.log('Trials incremented successfully!');
    }

    if (key === 500000 || key === 9000000) {
      await enableAI();
    }

    console.log('incrementTrials final data:', paymentData.amount, trials, userId);
  } catch (error) {
    console.error('Failed to update trials:', error);
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

async function enableAI() {
  try {
    const user = await getUserData();
    const { userId } = user;
    const { databases } = await createSessionClient();
    const { documents } = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, [Query.equal('userId', userId)]);

    if (documents.length > 0) {
      const userDocumentId = documents[0].$id;
      await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, userDocumentId, { ai: true });
      console.log('AI enabled successfully!');
    }
  } catch (error) {
    console.error('Failed to enable AI:', error);
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
      console.log('AI disabled successfully!');
    }
  } catch (error) {
    console.error('Failed to disable AI:', error);
  }
}

export { makePayment, verifyPayment, incrementTrials, decrementTrials, getPayments, getSubscription, enableAI, disableAI };
