import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { EducationalInfo } from '../types/auth';

export const saveEducationalInfo = async (userId: string, info: EducationalInfo): Promise<void> => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    // Create a reference to the user document in the tutor-db database
    const userRef = doc(db, 'users', userId);
    
    const userData = {
      educationalInfo: {
        ...info,
        updatedAt: new Date().toISOString()
      },
      userId: userId, // Explicitly store the userId
      createdAt: new Date().toISOString()
    };

    // Use merge: true to preserve existing data
    await setDoc(userRef, userData, { merge: true });
  } catch (error) {
    console.error('Error saving educational info:', error);
    throw new Error('Failed to save educational information. Please try again.');
  }
};

export const getEducationalInfo = async (userId: string): Promise<EducationalInfo | null> => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.educationalInfo as EducationalInfo;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting educational info:', error);
    throw new Error('Failed to retrieve educational information');
  }
};