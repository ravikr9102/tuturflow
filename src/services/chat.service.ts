import { doc, getDoc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { ChatSession } from '../types/chat';

export const createChatSession = async (userId: string): Promise<ChatSession> => {
  const newSession: ChatSession = {
    id: Date.now().toString(),
    title: 'New Chat',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId,
    messages: []
  };

  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    await updateDoc(userRef, {
      'chats.sessions': arrayUnion(newSession),
      'chats.activeSessionId': newSession.id
    });
  } else {
    await setDoc(userRef, {
      chats: {
        sessions: [newSession],
        activeSessionId: newSession.id
      }
    }, { merge: true });
  }

  return newSession;
};

export const updateChatSession = async (
  userId: string,
  sessionId: string,
  message: { content: string; sender: 'user' | 'ai' }
): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    throw new Error('User document not found');
  }

  const userData = userDoc.data();
  const sessions = userData.chats?.sessions || [];
  const sessionIndex = sessions.findIndex((s: ChatSession) => s.id === sessionId);

  if (sessionIndex === -1) {
    throw new Error('Chat session not found');
  }

  const updatedSessions = [...sessions];
  const session = { ...updatedSessions[sessionIndex] };

  // Update session with new message
  session.messages = [
    ...session.messages,
    {
      id: Date.now().toString(),
      ...message,
      timestamp: new Date().toISOString()
    }
  ];

  // Update session title if it's the first user message
  if (session.title === 'New Chat' && message.sender === 'user') {
    session.title = message.content.slice(0, 40) + (message.content.length > 40 ? '...' : '');
  }

  session.updatedAt = new Date().toISOString();
  updatedSessions[sessionIndex] = session;

  await updateDoc(userRef, {
    'chats.sessions': updatedSessions
  });
};

export const getUserChats = async (userId: string): Promise<ChatSession[]> => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    return [];
  }

  const userData = userDoc.data();
  return userData.chats?.sessions || [];
};

export const setActiveChat = async (userId: string, sessionId: string): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    'chats.activeSessionId': sessionId
  });
};

export const deleteChat = async (userId: string, sessionId: string): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    throw new Error('User document not found');
  }

  const userData = userDoc.data();
  const sessions = userData.chats?.sessions || [];
  const updatedSessions = sessions.filter((s: ChatSession) => s.id !== sessionId);

  await updateDoc(userRef, {
    'chats.sessions': updatedSessions,
    'chats.activeSessionId': updatedSessions.length > 0 ? updatedSessions[0].id : null
  });
};