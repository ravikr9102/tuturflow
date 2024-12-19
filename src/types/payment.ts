export interface PaymentPlan {
  id: string;
  name: string;
  chatCredits: number;
  callMinutes: number;
  price: number;
  description: string;
}

export const PAYMENT_PLANS: PaymentPlan[] = [
  {
    id: 'basic',
    name: 'Basic Plan',
    chatCredits: 60,
    callMinutes: 40,
    price: 99,
    description: 'Perfect for getting started'
  },
  {
    id: 'standard',
    name: 'Standard Plan',
    chatCredits: 200,
    callMinutes: 120,
    price: 249,
    description: 'Most popular choice'
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    chatCredits: 800,
    callMinutes: 400,
    price: 699,
    description: 'Best value for money'
  }
];