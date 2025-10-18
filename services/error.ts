enum PaymentErrorCode {
  PAYSTACK_API_ERROR = 'PAYSTACK_API_ERROR',
  PAYSTACK_VERIFICATION_FAILED = 'PAYSTACK_VERIFICATION_FAILED',
  PAYSTACK_INVALID_CUSTOMER = 'PAYSTACK_INVALID_CUSTOMER',

  DATABASE_ERROR = 'DATABASE_ERROR',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  DUPLICATE_REFERENCE = 'DUPLICATE_REFERENCE',

  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_PARAMETERS = 'MISSING_PARAMETERS',
  INVALID_AMOUNT = 'INVALID_AMOUNT',

  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',

  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

class PaymentError extends Error {
  constructor(
    public code: PaymentErrorCode,
    message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'PaymentError';
  }
}

interface ErrorResponse {
  error: string;
  code: PaymentErrorCode;
  details?: any;
  timestamp: string;
}

function handlePaymentError(error: any): {
  response: ErrorResponse;
  statusCode: number;
} {
  console.error('Payment Error:', {
    message: error.message,
    code: error.code,
    stack: error.stack,
    details: error.response?.data || error.details
  });

  if (error instanceof PaymentError) {
    return {
      response: {
        error: error.message,
        code: error.code,
        details: error.details,
        timestamp: new Date().toISOString()
      },
      statusCode: error.statusCode
    };
  }

  if (error.response) {
    const paystackError = error.response.data;
    return {
      response: {
        error: paystackError.message || 'Paystack API error',
        code: PaymentErrorCode.PAYSTACK_API_ERROR,
        details: paystackError,
        timestamp: new Date().toISOString()
      },
      statusCode: error.response.status
    };
  }

  if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
    return {
      response: {
        error: 'Request timeout. Please try again.',
        code: PaymentErrorCode.TIMEOUT_ERROR,
        timestamp: new Date().toISOString()
      },
      statusCode: 408
    };
  }

  if (error.code === 'ENOTFOUND' || error.message.includes('network')) {
    return {
      response: {
        error: 'Network error. Please check your connection.',
        code: PaymentErrorCode.NETWORK_ERROR,
        timestamp: new Date().toISOString()
      },
      statusCode: 503
    };
  }

  if (error.type?.includes('appwrite')) {
    return {
      response: {
        error: error.message || 'Database error',
        code: PaymentErrorCode.DATABASE_ERROR,
        details: { type: error.type, code: error.code },
        timestamp: new Date().toISOString()
      },
      statusCode: 500
    };
  }

  return {
    response: {
      error: 'An unexpected error occurred',
      code: PaymentErrorCode.UNKNOWN_ERROR,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString()
    },
    statusCode: 500
  };
}

export { handlePaymentError, PaymentError, PaymentErrorCode };
