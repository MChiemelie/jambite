const proPrice = 1500;
const premiumPrice = 2000;

export const plans = [
  {
    id: 'regular',
    name: 'Regular',
    features: ['Word of the Day', 'Blog', 'Analytics', 'Leaderboard'],
    pricing: { oneTime: 0 },
    buttonText: 'Continue',
  },
  {
    id: 'pro',
    name: 'Pro',
    features: ['Everything in Free', 'Use of English + 3 Subjects', 'Answers Review and Corrections', 'Experts Solutions'],
    pricing: { oneTime: proPrice },
    buttonText: 'Pay Now!',
  },
  {
    id: 'premium',
    name: 'Premium',
    features: ['Everything in Pro', 'Review Questions and Answers with AI', 'Email Support'],
    pricing: { oneTime: premiumPrice },
    buttonText: 'Pay Now!',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    features: ['Everything in Premium', 'Register a minimum of 10 candidates'],
    pricing: { oneTime: 1000 },
    buttonText: 'Coming Soon!',
  },
];
