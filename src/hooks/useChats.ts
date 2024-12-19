import { useState, useEffect } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { ChatSession, UserChats } from '../types/chat';

export const useChats = (userId: string | null) => {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setChats([]);
      setActiveSessionId(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'users', userId),
      (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          const chatData = userData.chats as UserChats;
          if (chatData) {
            setChats(chatData.sessions || []);
            setActiveSessionId(chatData.activeSessionId);
          } else {
            setChats([]);
            setActiveSessionId(null);
          }
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching chats:', error);
        setError('Failed to fetch chat history');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { chats, activeSessionId, loading, error };
};