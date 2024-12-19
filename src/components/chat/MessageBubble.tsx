import React from 'react';
import { Bot } from 'lucide-react';
import { Message } from '../../types';
import { formatMarkdown } from '../../utils/markdown.utils';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isAI = message.sender === 'ai';

  return (
    <div className={`flex items-start gap-4 mb-4 ${isAI ? '' : 'flex-row-reverse'}`}>
      {isAI && (
        <div className="flex-shrink-0 bg-gray-50 p-2 rounded-lg">
          <Bot className="h-6 w-6 text-indigo-600" />
        </div>
      )}
      <div
        className={`px-4 py-2 rounded-lg max-w-[80%] ${
          isAI
            ? 'bg-gray-50'
            : 'bg-indigo-600 ml-auto'
        }`}
      >
        <div 
          className={`markdown-content ${isAI ? 'ai-message' : 'user-message'}`}
          dangerouslySetInnerHTML={{ 
            __html: formatMarkdown(message.content)
          }}
        />
      </div>
    </div>
  );
};