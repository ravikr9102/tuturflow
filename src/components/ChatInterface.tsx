import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { MessageBubble } from './chat/MessageBubble';
import { SuggestedQuestions } from './chat/SuggestedQuestions';
import { ChatInput } from './chat/ChatInput';
import { ChatHistory } from './chat/ChatHistory';
import { VoiceWidget } from './VoiceWidget';
import { generateChatResponse } from '../services/openai.service';
import { useAuthContext } from '../context/AuthContext';
import { createMessage, formatMessagesForOpenAI, createInitialMessage } from '../utils/message.utils';
import { deductCredits } from '../services/credits.service';
import { CHAT_CREDIT_COST, CALL_MINUTE_COST } from '../types/credits';
import { useCredits } from '../hooks/useCredits';
import { useChats } from '../hooks/useChats';
import { updateChatSession, createChatSession } from '../services/chat.service';

const SUGGESTED_QUESTIONS = [
  { id: '1', text: "Can you explain this like I'm 5?", emoji: '🤔' },
  { id: '2', text: 'Show me an example, please!', emoji: '😊' },
  { id: '3', text: 'Why should I learn this?', emoji: '🤓' },
  { id: '4', text: 'Make this fun to remember!', emoji: '✨' },
];

interface ChatInterfaceProps {
  mode: 'call' | 'chat';
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ mode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthContext();
  const { credits } = useCredits(user?.uid || null);
  const { chats, activeSessionId } = useChats(user?.uid || null);
  const mounted = useRef(true);

  const hasUserMessages = messages.some(message => message.sender === 'user');

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (activeSessionId && chats.length > 0) {
      const activeChat = chats.find(chat => chat.id === activeSessionId);
      if (activeChat && mounted.current) {
        setMessages(activeChat.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      }
    } else if (mounted.current) {
      const initialMessage = createInitialMessage(user?.displayName);
      setMessages([initialMessage]);
    }
  }, [activeSessionId, chats, user?.displayName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleNewChat = () => {
    if (mounted.current) {
      const initialMessage = createInitialMessage(user?.displayName);
      setMessages([initialMessage]);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading || !mounted.current) return;

    if (!user) {
      const errorMessage = createMessage(
        "Please log in to continue chatting with the AI tutor.",
        'ai'
      );
      if (mounted.current) {
        setMessages(prev => [...prev, errorMessage]);
      }
      return;
    }

    const creditType = mode === 'chat' ? 'chat' : 'call';
    const creditCost = mode === 'chat' ? CHAT_CREDIT_COST : CALL_MINUTE_COST;
    const creditBalance = mode === 'chat' ? credits?.chatBalance : credits?.callMinutes;

    if (credits && creditBalance < creditCost) {
      const errorMessage = createMessage(
        `You've run out of ${creditType} credits. Please purchase more credits to continue ${mode === 'call' ? 'calling' : 'chatting'}.`,
        'ai'
      );
      if (mounted.current) {
        setMessages(prev => [...prev, errorMessage]);
      }
      return;
    }

    const userMessage = createMessage(content, 'user');
    if (mounted.current) {
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);
    }

    try {
      const deductionSuccess = await deductCredits(
        user.uid,
        creditCost,
        creditType,
        `${mode === 'call' ? 'Voice' : 'Chat'} interaction with AI tutor`
      );

      if (!deductionSuccess) {
        const errorMessage = createMessage(
          "Failed to process credits. Please try again.",
          'ai'
        );
        if (mounted.current) {
          setMessages(prev => [...prev, errorMessage]);
        }
        return;
      }

      if (!activeSessionId) {
        await createChatSession(user.uid);
      }

      const chatMessages = formatMessagesForOpenAI([...messages, userMessage]);
      const response = await generateChatResponse(chatMessages);
      
      if (mounted.current && response) {
        const aiMessage = createMessage(
          response,
          'ai'
        );
        
        setMessages(prev => [...prev, aiMessage]);

        if (activeSessionId) {
          await updateChatSession(user.uid, activeSessionId, {
            content: userMessage.content,
            sender: 'user'
          });
          await updateChatSession(user.uid, activeSessionId, {
            content: aiMessage.content,
            sender: 'ai'
          });
        }
      }
    } catch (error) {
      console.error('Failed to get AI response:', error);
      if (mounted.current) {
        const errorMessage = createMessage(
          "I apologize, but I'm having trouble responding right now. Please try again later.",
          'ai'
        );
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      if (mounted.current) {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm h-full flex">
      {mode === 'chat' && (
        <ChatHistory
          chats={chats}
          activeSessionId={activeSessionId}
          onNewChat={handleNewChat}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      )}
      <div className="flex-1 p-6 flex flex-col">
        {mode === 'call' ? (
          <div className="h-full">
            <VoiceWidget />
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex items-center space-x-2 p-4">
                  <div className="animate-bounce h-2 w-2 bg-gray-400 rounded-full"></div>
                  <div className="animate-bounce h-2 w-2 bg-gray-400 rounded-full delay-100"></div>
                  <div className="animate-bounce h-2 w-2 bg-gray-400 rounded-full delay-200"></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="mt-auto">
              {!hasUserMessages && (
                <SuggestedQuestions
                  questions={SUGGESTED_QUESTIONS}
                  onQuestionClick={handleSendMessage}
                />
              )}
              <ChatInput 
                onSendMessage={handleSendMessage} 
                isLoading={isLoading}
                disabled={!user || (credits?.chatBalance || 0) < CHAT_CREDIT_COST}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};