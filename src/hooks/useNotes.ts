import { useState, useEffect } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { StudyNote } from '../types/notes';

export const useNotes = (userId: string | null) => {
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setNotes([]);
      setLoading(false);
      return;
    }

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      doc(db, 'users', userId),
      (doc) => {
        if (doc.exists() && doc.data().notes) {
          setNotes(doc.data().notes as StudyNote[]);
        } else {
          setNotes([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching notes:', error);
        setError('Failed to fetch notes');
        setLoading(false);
      }
    );

    // Cleanup subscription
    return () => unsubscribe();
  }, [userId]);

  return { notes, loading, error };
};