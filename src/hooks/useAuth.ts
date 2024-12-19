import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../config/firebase';
import { signInWithGoogle, signInWithFacebook, logoutUser } from '../services/auth.service';
import { saveEducationalInfo as saveEducationalInfoToFirestore } from '../services/firestore.service';
import { EducationalInfo } from '../types/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithProvider = async (provider: 'google' | 'facebook') => {
    try {
      setError(null);
      const result = provider === 'google' 
        ? await signInWithGoogle()
        : await signInWithFacebook();
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during sign in';
      setError(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await logoutUser();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during logout';
      setError(errorMessage);
      throw error;
    }
  };

  const saveEducationalInfo = async (info: EducationalInfo) => {
    if (!user) {
      throw new Error('User must be logged in to save educational info');
    }
    
    try {
      setError(null);
      await saveEducationalInfoToFirestore(user.uid, info);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while saving educational info';
      setError(errorMessage);
      throw error;
    }
  };

  return {
    user,
    loading,
    error,
    signInWithProvider,
    logout,
    saveEducationalInfo
  };
};