export interface UserCredits {
  chatBalance: number;
  callMinutes: number;
  transactions: CreditTransaction[];
}

export interface CreditTransaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  category: 'chat' | 'call';
  description: string;
  timestamp: string;
}

export const INITIAL_CHAT_CREDITS = 30; // New users get 30 chat credits
export const INITIAL_CALL_MINUTES = 20; // New users get 20 minutes of call time
export const CHAT_CREDIT_COST = 5; // Each chat interaction costs 5 credits
export const CALL_MINUTE_COST = 1; // Each minute of voice call costs 1 credit