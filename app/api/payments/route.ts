import axios from 'axios';
import { NextResponse } from 'next/server';

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
      return NextResponse.json(response.data);
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
    const { action, amount, email } = await req.json();

    if (action === 'initialize' && amount && email) {
      const response = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
          email,
          amount,
          callback_url: `${BASE_URL}/payments/verify`,
          metadata: {
            cancel_action: `${BASE_URL}/payments/cancel`,
          },
        },
        { headers: paystackHeaders }
      );
      return NextResponse.json(response.data);
    } else {
      return NextResponse.json({ message: 'Invalid action or missing parameters' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Error:', error.response?.data || error.message);
    return NextResponse.json({ message: error.response?.data?.message || 'An error occurred' }, { status: 500 });
  }
}
