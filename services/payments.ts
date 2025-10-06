'use server';

import { User } from '@/types';
import axios from 'axios';
import { Models, Query } from 'node-appwrite';
import { appwriteConfig } from '@/config/appwrite';
import { createSessionClient } from '@/libraries';
import { getUserData } from './auth';
import { plans } from '@/data';
import { redirect } from 'next/navigation';
import { PaymentError, PaymentErrorCode } from './error';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function validatePaymentInput(data: { amount?: number; email?: string; reference?: string; userId?: string }) {
  const errors: string[] = [];

  if (data.amount !== undefined) {
    if (typeof data.amount !== 'number' || data.amount <= 0) {
      errors.push('Amount must be a positive number');
    }
  }

  if (data.email !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push('Invalid email format');
    }
  }

  if (data.reference !== undefined && !data.reference.trim()) {
    errors.push('Reference cannot be empty');
  }

  if (data.userId !== undefined && !data.userId.trim()) {
    errors.push('User ID cannot be empty');
  }

  if (errors.length > 0) {
    throw new PaymentError(PaymentErrorCode.INVALID_INPUT, 'Validation failed', 400, { errors });
  }
}

async function retryWithBackoff<T>(fn: () => Promise<T>, maxRetries: number = 3, baseDelay: number = 1000): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Don't retry on validation or client errors
      if (error instanceof PaymentError && (error.code === PaymentErrorCode.INVALID_INPUT || error.code === PaymentErrorCode.DUPLICATE_REFERENCE || error.statusCode < 500)) {
        throw error;
      }

      // Don't retry on 4xx errors from Paystack
      if (error.response?.status && error.response.status < 500) {
        throw error;
      }

      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

async function safeDbOperation<T>(operation: () => Promise<T>, errorContext: string): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    console.error(`Database operation failed: ${errorContext}`, error);

    if (error.code === 404 || error.type?.includes('document_not_found')) {
      throw new PaymentError(PaymentErrorCode.USER_NOT_FOUND, 'User not found in database', 404, { context: errorContext });
    }

    throw new PaymentError(PaymentErrorCode.DATABASE_ERROR, `Database error: ${errorContext}`, 500, { originalError: error.message });
  }
}

async function safePaystackRequest<T>(requestFn: () => Promise<T>, context: string): Promise<T> {
  try {
    return await retryWithBackoff(requestFn);
  } catch (error: any) {
    console.error(`Paystack API error: ${context}`, error.response?.data || error.message);

    if (error.response?.status === 404) {
      throw new PaymentError(PaymentErrorCode.PAYSTACK_INVALID_CUSTOMER, 'Customer not found in Paystack', 404, { context });
    }

    if (error.response?.status === 401) {
      throw new PaymentError(PaymentErrorCode.PAYSTACK_API_ERROR, 'Invalid Paystack credentials', 401, { context });
    }

    throw new PaymentError(PaymentErrorCode.PAYSTACK_API_ERROR, `Paystack API error: ${context}`, error.response?.status || 500, { originalError: error.response?.data || error.message });
  }
}

async function getCustomerIdSafely(email: string, databases: any, paystackHeaders: any): Promise<string | null> {
  try {
    // Try Appwrite first
    const userDocs: Models.DocumentList<User> = await safeDbOperation(() => databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, [Query.equal('email', email)]), 'Fetching user by email');

    if (userDocs.total > 0 && userDocs.documents[0].paystackId) {
      return String(userDocs.documents[0].paystackId);
    }

    // Fallback to Paystack API
    const customerResponse = await safePaystackRequest(
      () =>
        axios.get(`https://api.paystack.co/customer/${email}`, {
          headers: paystackHeaders,
        }),
      'Fetching customer from Paystack'
    );

    return customerResponse.data?.data?.id || null;
  } catch (error: any) {
    // If customer not found, return null (not an error)
    if (error.code === PaymentErrorCode.PAYSTACK_INVALID_CUSTOMER) {
      return null;
    }
    throw error;
  }
}

async function handlePay(formData: FormData) {
  const planId = String(formData.get('planId') || '');
  const plan = plans.find((p) => p.id === planId);
  if (!plan) return redirect('/payments/error');

  const amount = Number(plan.pricing.oneTime) * 100;
  if (amount === 0) return redirect('/dashboard');

  try {
    const paymentData = await makePayment(amount);
    const url = paymentData?.data?.authorization_url;
    if (url) return redirect(url);
    return redirect('/payments/error');
  } catch (err: any) {
    if (err?.digest?.startsWith('NEXT_REDIRECT')) throw err;
    console.error('handlePay error', err);
    return redirect('/payments/error');
  }
}

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
    const user = await getUserData();

    if (!user?.email) {
      throw new PaymentError(PaymentErrorCode.INVALID_INPUT, 'User email not found', 400);
    }

    const { email, paystackId } = user;

    const params = new URLSearchParams({
      action: 'transactions',
      page: currentPage.toString(),
      perPage: perPage.toString(),
    });

    if (paystackId) {
      params.append('customer', paystackId);
    } else {
      params.append('email', email);
    }

    const response = await fetch(`${BASE_URL}/api/payments?${params.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new PaymentError(errorData.code || PaymentErrorCode.UNKNOWN_ERROR, errorData.error || 'Failed to fetch payments', response.status, errorData.details);
    }

    return response.json();
  } catch (error: any) {
    console.error('Failed to fetch payments:', error);

    // Re-throw PaymentError as-is
    if (error instanceof PaymentError) {
      throw error;
    }

    // Wrap other errors
    throw new PaymentError(PaymentErrorCode.UNKNOWN_ERROR, 'Failed to fetch payments', 500, { originalError: error.message });
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

export { makePayment, verifyPayment, decrementTrials, getPayments, disableAI, handlePay, validatePaymentInput, safePaystackRequest, retryWithBackoff, getCustomerIdSafely, safeDbOperation };
