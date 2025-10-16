'use server';

import axios from 'axios';
import { NextResponse } from 'next/server';
import { ID, Query } from 'node-appwrite';
import { appwriteConfig } from '@/config/appwrite';
import { safeDbOperation, safePaystackRequest, validatePaymentInput } from '@/helpers/payments';
import { createAdminClient } from '@/libraries';
import { handlePaymentError, PaymentError, PaymentErrorCode } from '@/services/error';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const paystackHeaders = {
  Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
  'Content-Type': 'application/json'
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    const reference = searchParams.get('reference');
    const email = searchParams.get('email');
    const page = Number(searchParams.get('page')) || 1;
    const perPage = Number(searchParams.get('perPage')) || 10;

    if (action === 'verify' && reference) {
      validatePaymentInput({ reference });

      const response = await safePaystackRequest(
        () =>
          axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: paystackHeaders
          }),
        'Verifying transaction'
      );

      return NextResponse.json(response.data);
    }

    if (action === 'transactions') {
      const customer = searchParams.get('customer');
      const params: any = { page, perPage };

      if (customer) {
        params.customer = customer;
      } else if (email) {
        validatePaymentInput({ email });

        try {
          const { databases } = await createAdminClient();

          const userDocs = await safeDbOperation(() => databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, [Query.equal('email', email)]), 'Fetching user by email');

          if (userDocs.total > 0 && userDocs.documents[0].paystackId) {
            params.customer = userDocs.documents[0].paystackId;
          } else {
            try {
              const customerResponse = await safePaystackRequest(() => axios.get(`https://api.paystack.co/customer/${encodeURIComponent(email)}`, { headers: paystackHeaders }), 'Fetching customer from Paystack');

              if (customerResponse.data?.data?.id) {
                params.customer = customerResponse.data.data.id;
              }
            } catch (error: any) {
              if (error.code !== PaymentErrorCode.PAYSTACK_INVALID_CUSTOMER) {
                throw error;
              }
            }
          }
        } catch (error: any) {
          console.warn('Could not determine customer ID:', error.message);
        }
      }

      const response = await safePaystackRequest(
        () =>
          axios.get(`https://api.paystack.co/transaction?customer=${params.customer}`, {
            headers: paystackHeaders,
            params,
            timeout: 10000
          }),
        'Fetching transactions'
      );

      const { data, meta } = response.data;

      return NextResponse.json({
        data,
        pageCount: meta?.pageCount || 1,
        total: meta?.total || 0
      });
    }

    throw new PaymentError(PaymentErrorCode.INVALID_INPUT, 'Invalid action or missing parameters', 400);
  } catch (error: any) {
    const { response, statusCode } = handlePaymentError(error);
    return NextResponse.json(response, { status: statusCode });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    if (!action) {
      throw new PaymentError(PaymentErrorCode.MISSING_PARAMETERS, 'Action is required', 400);
    }

    if (action === 'initialize') {
      const { amount, email } = body;
      validatePaymentInput({ amount, email });

      const response = await safePaystackRequest(
        () =>
          axios.post(
            'https://api.paystack.co/transaction/initialize',
            {
              email,
              amount,
              callback_url: `${BASE_URL}/verify`,
              metadata: { cancel_action: `${BASE_URL}/cancel` }
            },
            { headers: paystackHeaders }
          ),
        'Initializing payment'
      );

      return NextResponse.json(response.data);
    }

    if (action === 'verify') {
      const { reference, userId } = body;
      validatePaymentInput({ reference, userId });

      const verifyRes = await safePaystackRequest(
        () =>
          axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: paystackHeaders
          }),
        'Verifying payment'
      );

      const { status, data } = verifyRes.data;

      if (!status || data.status !== 'success') {
        throw new PaymentError(PaymentErrorCode.PAYSTACK_VERIFICATION_FAILED, 'Payment was not successful', 400, { paystackStatus: data.status });
      }

      const { databases } = await createAdminClient();

      const existing = await safeDbOperation(() => databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.paymentsCollectionId, [Query.equal('reference', reference)]), 'Checking for duplicate reference');

      if (existing.total > 0) {
        throw new PaymentError(PaymentErrorCode.DUPLICATE_REFERENCE, 'Payment reference has already been used', 400);
      }

      await safeDbOperation(
        () =>
          databases.createDocument(appwriteConfig.databaseId, appwriteConfig.paymentsCollectionId, ID.unique(), {
            reference,
            userId,
            paystackId: data.customer?.id || null
          }),
        'Creating payment record'
      );

      const userDocs = await safeDbOperation(() => databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, [Query.equal('userId', userId)]), 'Fetching user document');

      if (userDocs.total === 0) {
        throw new PaymentError(PaymentErrorCode.USER_NOT_FOUND, 'User not found in database', 404);
      }

      const userDoc = userDocs.documents[0];
      const docId = userDoc.$id;
      const currentTrials = userDoc.trials || 0;
      const amount = data.amount;

      const trialIncrements: Record<number, number> = {
        150000: 1,
        200000: 1
      };

      const increment = trialIncrements[amount] || 0;
      const updatedTrials = currentTrials + increment;

      await safeDbOperation(() => databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, docId, { trials: updatedTrials }), 'Updating user trials');

      if (amount === 200000) {
        await safeDbOperation(() => databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, docId, { ai: true }), 'Enabling AI feature');
      }

      if (data.customer?.id && !userDoc.paystackId) {
        await safeDbOperation(() => databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, docId, { paystackId: data.customer.id }), 'Storing Paystack customer ID');
      }

      return NextResponse.json({ success: true, trials: updatedTrials });
    }

    throw new PaymentError(PaymentErrorCode.INVALID_INPUT, 'Invalid action', 400);
  } catch (error: any) {
    const { response, statusCode } = handlePaymentError(error);
    return NextResponse.json(response, { status: statusCode });
  }
}
