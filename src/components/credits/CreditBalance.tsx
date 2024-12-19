import React from 'react';
import { MessageSquare, Phone } from 'lucide-react';
import { UserCredits } from '../../types/credits';

interface CreditBalanceProps {
  credits: UserCredits | null;
  loading?: boolean;
}

export const CreditBalance: React.FC<CreditBalanceProps> = ({ credits, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full animate-pulse">
        <div className="w-4 h-4 bg-gray-200 rounded-full" />
        <div className="w-16 h-4 bg-gray-200 rounded" />
      </div>
    );
  }

  if (!credits) return null;

  const getChatColorScheme = (balance: number) => {
    if (balance <= 10) return 'bg-red-50 text-red-700';
    if (balance <= 20) return 'bg-yellow-50 text-yellow-700';
    return 'bg-green-50 text-green-700';
  };

  const getCallColorScheme = (minutes: number) => {
    if (minutes <= 5) return 'bg-red-50 text-red-700';
    if (minutes <= 10) return 'bg-yellow-50 text-yellow-700';
    return 'bg-green-50 text-green-700';
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getChatColorScheme(credits.chatBalance)}`}>
        <MessageSquare className="h-4 w-4" />
        <span className="text-sm font-medium">
          {credits.chatBalance} Chat
        </span>
      </div>
      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getCallColorScheme(credits.callMinutes)}`}>
        <Phone className="h-4 w-4" />
        <span className="text-sm font-medium">
          {credits.callMinutes}m Call
        </span>
      </div>
    </div>
  );
};