import { useState, useEffect } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { UserCredits } from '../types/credits';

export const useCredits = (userId: string | null) => {
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setCredits(null);
      setLoading(false);
      return;
    }

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      doc(db, 'users', userId),
      (doc) => {
        if (doc.exists() && doc.data().credits) {
          setCredits(doc.data().credits as UserCredits);
        } else {
          setCredits(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching credits:', error);
        setError('Failed to fetch credits');
        setLoading(false);
      }
    );

    // Cleanup subscription
    return () => unsubscribe();
  }, [userId]);

  return { credits, loading, error };
};