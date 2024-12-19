import { 
  signInWithPopup, 
  signOut, 
  User,
} from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../config/firebase';
import { initializeUserCredits } from './credits.service';
import { getEducationalInfo } from './firestore.service';

export const signInWithGoogle = async (): Promise<{user: User; needsEducationalInfo: boolean}> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await initializeUserCredits(result.user.uid);
    
    // Check if user has educational info
    const educationalInfo = await getEducationalInfo(result.user.uid);
    const needsEducationalInfo = !educationalInfo;

    return {
      user: result.user,
      needsEducationalInfo
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Google sign-in failed: ${error.message}`);
    }
    throw error;
  }
};

export const signInWithFacebook = async (): Promise<{user: User; needsEducationalInfo: boolean}> => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    await initializeUserCredits(result.user.uid);
    
    // Check if user has educational info
    const educationalInfo = await getEducationalInfo(result.user.uid);
    const needsEducationalInfo = !educationalInfo;

    return {
      user: result.user,
      needsEducationalInfo
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Facebook sign-in failed: ${error.message}`);
    }
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Logout failed: ${error.message}`);
    }
    throw error;
  }
};