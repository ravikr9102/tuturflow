import React, { useState } from 'react';
import { MessageSquare, Phone, CheckCircle, Loader } from 'lucide-react';
import { PAYMENT_PLANS } from '../../types/payment';
import { useAuthContext } from '../../context/AuthContext';
import { initializePayment } from '../../services/payment.service';

export const PurchaseCredits: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { user } = useAuthContext();

  const handlePurchase = async (plan: typeof PAYMENT_PLANS[0]) => {
    if (!user?.email) {
      setError('Please ensure you have a valid email address');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await initializePayment(
        user.uid,
        plan,
        user.email,
        user.displayName || 'User'
      );
      
      setSuccess('Payment successful! Credits have been added to your account.');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PAYMENT_PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`border rounded-lg p-6 flex flex-col hover:shadow-md transition-all ${
              plan.id === 'standard' ? 'border-indigo-500 shadow-md' : ''
            }`}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {plan.name}
            </h3>
            <p className="text-gray-600 mb-4">{plan.description}</p>
            <div className="text-3xl font-bold text-indigo-600 mb-4">
              ₹{plan.price}
            </div>
            <ul className="space-y-2 mb-6 flex-grow">
              <li className="flex items-center gap-2 text-gray-600">
                <MessageSquare className="h-5 w-5 text-green-500" />
                <span className="font-medium">{plan.chatCredits}</span> Chat Credits
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Phone className="h-5 w-5 text-green-500" />
                <span className="font-medium">{plan.callMinutes}</span> Call Minutes
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <CheckCircle className="h-5 w-5 text-green-500" />
                No expiry
              </li>
            </ul>
            <button
              onClick={() => handlePurchase(plan)}
              disabled={isLoading || !user}
              className={`w-full py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                plan.id === 'standard'
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              {isLoading ? (
                <Loader className="h-5 w-5 animate-spin mx-auto" />
              ) : (
                'Purchase Now'
              )}
            </button>
          </div>
        ))}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {success}
        </div>
      )}

      {!user && (
        <p className="text-center text-gray-500 mt-6">
          Please log in to purchase credits
        </p>
      )}
    </div>
  );
};