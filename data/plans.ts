const proPrice = 3500;
const premiumPrice = 5000;

export const plans = [
  {
    id: 'regular',
    name: 'Regular',
    features: ['Word of the Day', 'Blog', 'Analytics', 'Leaderboard'],
    pricing: { oneTime: 0, monthly: 0, annually: 0 },
    buttonText: 'Continue',
  },
  {
    id: 'pro',
    name: 'Pro',
    features: ['Everything in Free', 'Use of English + 3 Subjects', 'Answer Review'],
    pricing: {
      oneTime: proPrice,
      monthly: {
        amount: proPrice * 30 - proPrice * 30 * 0.1,
        url: 'https://paystack.com/pay/jambite-pro-monthly',
        planCode: 'PLN_rtj3j9ileljfbyf',
      },
      annually: {
        amount: proPrice * 365 - proPrice * 365 * 0.1,
        url: 'https://paystack.com/pay/jambite-pro-annual',
        planCode: 'PLN_6trkkgr4acmktsr',
      },
    },
    buttonText: 'Pay Now!',
  },
  {
    id: 'premium',
    name: 'Premium',
    features: ['Everything in Pro', 'AI Question and Answer Review', 'Email Support'],
    pricing: {
      oneTime: premiumPrice,
      monthly: {
        amount: premiumPrice * 30 - premiumPrice * 30 * 0.1,
        url: 'https://paystack.com/pay/jambite-premium-monthly',
        planCode: 'PLN_rtj3j9ileljfbyf',
      },
      annually: {
        amount: premiumPrice * 365 - premiumPrice * 365 * 0.1,
        url: 'https://paystack.com/pay/jambite-premium-annual',
        planCode: 'PLN_qf0gscrdmjupv3s',
      },
    },
    buttonText: 'Pay Now!',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    features: ['Everything in Premium', 'Minimum of 10 candidates'],
    pricing: {
      oneTime: 4500,
      monthly: {
        amount: 200000,
        url: 'https://paystack.com/pay/jambite-enterprise-monthly',
        planCode: 'PLN_xnt2pfs4xtowjjy',
      },
      annually: {
        amount: 4600000,
        url: 'https://paystack.com/pay/jambite-enterprise-annual',
        planCode: 'PLN_58hratufbv5n8d9',
      },
    },
    buttonText: 'Coming Soon!',
  },
];
