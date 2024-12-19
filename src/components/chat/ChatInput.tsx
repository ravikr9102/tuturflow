import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isLoading,
  disabled 
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={
          disabled 
            ? "Please log in or purchase more credits to continue chatting"
            : "Ask me anything! I'm here to help you learn 👋"
        }
        className={`w-full truncate px-4 py-3 pr-12 border rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
          disabled ? 'bg-gray-50 text-gray-500' : ''
        }`}
        disabled={disabled || isLoading}
      />
      <button
        type="submit"
        disabled={disabled || isLoading}
        className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 ${
          disabled || isLoading
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-indigo-600 hover:text-indigo-700'
        }`}
      >
        <Send className="h-5 w-5" />
      </button>
    </form>
  );
};