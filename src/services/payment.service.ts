import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../config/firebase';
import { PaymentPlan } from '../types/payment';
import { CreditTransaction } from '../types/credits';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const loadRazorpayScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
    document.body.appendChild(script);
  });
};

export const initializePayment = async (
  userId: string,
  plan: PaymentPlan,
  userEmail: string,
  userName: string
): Promise<void> => {
  try {
    // Ensure Razorpay script is loaded
    await loadRazorpayScript();

    const orderData = {
      amount: plan.price * 100, // Convert to paise
      currency: 'INR',
    };

    return new Promise((resolve, reject) => {
      const options = {
        key: 'rzp_test_rNCNodUpsNozqz', // Test key
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'TutorFlow',
        description: `Purchase ${plan.chatCredits} chat credits and ${plan.callMinutes} call minutes`,
        prefill: {
          email: userEmail,
          name: userName,
        },
        notes: {
          userId: userId,
          planId: plan.id,
          chatCredits: plan.chatCredits.toString(),
          callMinutes: plan.callMinutes.toString(),
        },
        handler: async function (response: any) {
          try {
            if (response.razorpay_payment_id) {
              await processPayment(userId, plan, response.razorpay_payment_id);
              resolve();
            } else {
              reject(new Error('Payment failed: No payment ID received'));
            }
          } catch (error) {
            console.error('Payment processing failed:', error);
            reject(error);
          }
        },
        modal: {
          ondismiss: function() {
            reject(new Error('Payment cancelled by user'));
          }
        },
        theme: {
          color: '#4F46E5'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    });
  } catch (error) {
    console.error('Payment initialization failed:', error);
    throw error;
  }
};

const processPayment = async (
  userId: string,
  plan: PaymentPlan,
  paymentId: string
): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  
  try {
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const userData = userDoc.data();
    const currentChatCredits = userData.credits?.chatBalance || 0;
    const currentCallMinutes = userData.credits?.callMinutes || 0;

    const chatTransaction: CreditTransaction = {
      id: `${paymentId}-chat`,
      amount: plan.chatCredits,
      type: 'credit',
      category: 'chat',
      description: `Purchased ${plan.chatCredits} chat credits - ${plan.name}`,
      timestamp: new Date().toISOString()
    };

    const callTransaction: CreditTransaction = {
      id: `${paymentId}-call`,
      amount: plan.callMinutes,
      type: 'credit',
      category: 'call',
      description: `Purchased ${plan.callMinutes} call minutes - ${plan.name}`,
      timestamp: new Date().toISOString()
    };

    await updateDoc(userRef, {
      'credits.chatBalance': currentChatCredits + plan.chatCredits,
      'credits.callMinutes': currentCallMinutes + plan.callMinutes,
      'credits.transactions': arrayUnion(chatTransaction, callTransaction),
      'lastPaymentId': paymentId,
      'lastPaymentTimestamp': new Date().toISOString(),
      'lastPurchasedPlan': plan.id
    });

  } catch (error) {
    console.error('Error processing payment:', error);
    throw new Error('Failed to process payment. Please contact support if your account was charged.');
  }
};