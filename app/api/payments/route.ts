'use server';

import { appwriteConfig } from '@/config/appwrite';
import { createAdminClient } from '@/libraries';
import axios from 'axios';
import { NextResponse } from 'next/server';
import { ID, Query } from 'node-appwrite';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const paystackHeaders = {
  Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
  'Content-Type': 'application/json',
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
      const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: paystackHeaders,
      });
      return NextResponse.json(response.data);
    } else if (action === 'subscription' && email) {
      const response = await axios.get('https://api.paystack.co/subscription', {
        headers: paystackHeaders,
        params: { email, page, perPage },
      });
      return NextResponse.json(response.data);
    } else if (action === 'transactions') {
      const response = await axios.get('https://api.paystack.co/transaction', {
        headers: paystackHeaders,
        params: { page, perPage },
      });

      const { data, meta } = response.data;

      return NextResponse.json({
        data,
        pageCount: meta?.pageCount || 1,
        total: meta?.total || 0,
      });
    } else {
      return NextResponse.json({ message: 'Invalid action or missing parameters' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Error:', error.response?.data || error.message);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json({ error: 'Missing action' }, { status: 400 });
    }

    // --- Initialize Payment ---
    if (action === 'initialize') {
      const { amount, email } = body;
      if (!amount || !email) {
        return NextResponse.json({ error: 'Missing amount or email' }, { status: 400 });
      }

      const response = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
          email,
          amount,
          callback_url: `${BASE_URL}/verify`,
          metadata: { cancel_action: `${BASE_URL}/cancel` },
        },
        { headers: paystackHeaders }
      );

      return NextResponse.json(response.data);
    }

    // --- Verify Payment ---
    if (action === 'verify') {
      const { reference, userId } = body;

      if (!reference || !userId) {
        return NextResponse.json({ error: 'Missing reference or userId' }, { status: 400 });
      }

      // Step 1: Verify with Paystack
      const verifyRes = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, { headers: paystackHeaders });

      const { status, data } = verifyRes.data;
      if (!status || data.status !== 'success') {
        return NextResponse.json({ error: 'Payment not successful' }, { status: 400 });
      }

      const { databases } = await createAdminClient();

      // Step 2: Prevent duplicate reference
      const existing = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.paymentsCollectionId, [Query.equal('reference', reference)]);

      if (existing.total > 0) {
        return NextResponse.json({ error: 'Reference already used' }, { status: 400 });
      }

      // Step 3: Save payment (only reference + userId, nothing else)
      await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.paymentsCollectionId, ID.unique(), {
        reference,
        userId,
      });

      // Step 4: Increment user’s trials (with your old logic)
      try {
        // Query user document by "userId" field instead of using getDocument
        const userDocs = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, [Query.equal('userId', userId)]);

        if (userDocs.total === 0) {
          return NextResponse.json({ error: 'User not found in collection' }, { status: 404 });
        }

        const userDoc = userDocs.documents[0]; // take first match
        const docId = userDoc.$id; // actual document ID

        const currentTrials = userDoc.trials || 0;
        const key = data.amount; // amount from Paystack verification

        // Trial increment logic
        const trialIncrements: Record<number, number> = {
          150000: 1,
          200000: 1,
        };

        const increment = trialIncrements[key] || 0;
        const updatedTrials = currentTrials + increment;

        await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, docId, { trials: updatedTrials });

        if (key === 200000) {
          await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, docId, { ai: true });
        }

        return NextResponse.json({ success: true, trials: updatedTrials });
      } catch (err: any) {
        console.error('User update failed:', err.message);
        return NextResponse.json({ error: 'User not found in collection' }, { status: 404 });
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    console.error('POST Error:', err.response?.data || err.message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
