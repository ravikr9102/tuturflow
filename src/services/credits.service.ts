import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../config/firebase';
import { UserCredits, CreditTransaction, INITIAL_CHAT_CREDITS, INITIAL_CALL_MINUTES } from '../types/credits';

export const initializeUserCredits = async (userId: string): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists() || !userDoc.data().credits) {
    const initialChatTransaction: CreditTransaction = {
      id: Date.now().toString(),
      amount: INITIAL_CHAT_CREDITS,
      type: 'credit',
      category: 'chat',
      description: 'Welcome bonus chat credits',
      timestamp: new Date().toISOString()
    };

    const initialCallTransaction: CreditTransaction = {
      id: (Date.now() + 1).toString(),
      amount: INITIAL_CALL_MINUTES,
      type: 'credit',
      category: 'call',
      description: 'Welcome bonus call minutes',
      timestamp: new Date().toISOString()
    };

    const initialCredits: UserCredits = {
      chatBalance: INITIAL_CHAT_CREDITS,
      callMinutes: INITIAL_CALL_MINUTES,
      transactions: [initialChatTransaction, initialCallTransaction]
    };

    await setDoc(userRef, { credits: initialCredits }, { merge: true });
  }
};

export const deductCredits = async (
  userId: string, 
  amount: number,
  category: 'chat' | 'call',
  description: string
): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    
    if (!docSnap.exists()) {
      throw new Error('User not found');
    }

    const userData = docSnap.data();
    const credits = userData.credits as UserCredits;
    
    const balanceField = category === 'chat' ? 'chatBalance' : 'callMinutes';
    const currentBalance = credits[balanceField];

    if (!credits || currentBalance < amount) {
      return false; // Insufficient credits
    }

    const transaction: CreditTransaction = {
      id: Date.now().toString(),
      amount,
      type: 'debit',
      category,
      description,
      timestamp: new Date().toISOString()
    };

    await updateDoc(userRef, {
      [`credits.${balanceField}`]: currentBalance - amount,
      'credits.transactions': arrayUnion(transaction)
    });

    return true;
  } catch (error) {
    console.error('Error deducting credits:', error);
    throw new Error('Failed to deduct credits');
  }
};

export const getUserCredits = async (userId: string): Promise<UserCredits | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists() && docSnap.data().credits) {
      return docSnap.data().credits as UserCredits;
    }
    return null;
  } catch (error) {
    console.error('Error getting user credits:', error);
    throw new Error('Failed to retrieve credit information');
  }
};