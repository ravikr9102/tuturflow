import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../config/firebase';
import { StudyNote } from '../types/notes';

export const saveNote = async (userId: string, note: Omit<StudyNote, 'id' | 'userId'>): Promise<void> => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const userRef = doc(db, 'users', userId);
    const newNote: StudyNote = {
      ...note,
      id: Date.now().toString(),
      userId,
    };

    await updateDoc(userRef, {
      'notes': arrayUnion(newNote)
    });
  } catch (error) {
    console.error('Error saving note:', error);
    throw new Error('Failed to save note. Please try again.');
  }
};

export const getUserNotes = async (userId: string): Promise<StudyNote[]> => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists() && docSnap.data().notes) {
      return docSnap.data().notes as StudyNote[];
    }
    
    return [];
  } catch (error) {
    console.error('Error getting user notes:', error);
    throw new Error('Failed to retrieve notes');
  }
};

export const updateNote = async (userId: string, updatedNote: StudyNote): Promise<void> => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    
    if (!docSnap.exists()) {
      throw new Error('User document not found');
    }

    const currentNotes = docSnap.data().notes as StudyNote[] || [];
    const updatedNotes = currentNotes.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    );

    await updateDoc(userRef, { notes: updatedNotes });
  } catch (error) {
    console.error('Error updating note:', error);
    throw new Error('Failed to update note. Please try again.');
  }
};

export const deleteNote = async (userId: string, noteId: string): Promise<void> => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    
    if (!docSnap.exists()) {
      throw new Error('User document not found');
    }

    const currentNotes = docSnap.data().notes as StudyNote[] || [];
    const updatedNotes = currentNotes.filter(note => note.id !== noteId);

    await updateDoc(userRef, { notes: updatedNotes });
  } catch (error) {
    console.error('Error deleting note:', error);
    throw new Error('Failed to delete note. Please try again.');
  }
};