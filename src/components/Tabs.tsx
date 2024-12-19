import React from 'react';
import { Phone, MessageSquare } from 'lucide-react';

interface TabsProps {
  activeTab: 'call' | 'chat';
  onTabChange: (tab: 'call' | 'chat') => void;
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => onTabChange('call')}
            className={`
              flex items-center gap-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors
              ${activeTab === 'call'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            <Phone className="h-4 w-4" />
            Call with AI Teacher
          </button>
          <button
            onClick={() => onTabChange('chat')}
            className={`
              flex items-center gap-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors
              ${activeTab === 'chat'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            <MessageSquare className="h-4 w-4" />
            Chat with AI Teacher
          </button>
        </nav>
      </div>
    </div>
  );
};