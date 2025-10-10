'use server';

import { appwriteConfig } from '@/config/appwrite';
import { plans } from '@/data';
import { makePayment } from '@/services';
import { PaymentError, PaymentErrorCode } from '@/services/error';
import { User } from '@/types';
import axios from 'axios';
import { redirect } from 'next/navigation';
import { Models, Query } from 'node-appwrite';

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

export { validatePaymentInput, safePaystackRequest, safeDbOperation, handlePay };