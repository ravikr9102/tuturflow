import React from 'react';
import { MessageSquarePlus, Trash2, Clock, Menu } from 'lucide-react';
import { ChatSession } from '../../types/chat';
import { createChatSession, setActiveChat, deleteChat } from '../../services/chat.service';
import { useAuthContext } from '../../context/AuthContext';

interface ChatHistoryProps {
  chats: ChatSession[];
  activeSessionId: string | null;
  onNewChat: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  chats,
  activeSessionId,
  onNewChat,
  isCollapsed,
  onToggleCollapse
}) => {
  const { user } = useAuthContext();

  const handleNewChat = async () => {
    if (!user) return;
    try {
      await createChatSession(user.uid);
      onNewChat();
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  const handleChatSelect = async (sessionId: string) => {
    if (!user) return;
    try {
      await setActiveChat(user.uid, sessionId);
    } catch (error) {
      console.error('Error setting active chat:', error);
    }
  };

  const handleDeleteChat = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (!user) return;
    
    try {
      await deleteChat(user.uid, sessionId);
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  return (
    <div className={`bg-gray-50 border-r h-full flex flex-col transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-60'}`}>
      <div className="flex items-center justify-between p-4">
        {
          !isCollapsed && 
           <button
          onClick={handleNewChat}
          className={`flex items-center gap-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 px-4 py-2 transition-colors`}
        >
           <MessageSquarePlus className="h-4 w-4" />
         <span>New Chat</span>
        </button>
        }
        <button
          onClick={onToggleCollapse}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <div className="text-center text-gray-500 mt-4 px-4">
            {!isCollapsed && (
              <>
                <p>No chat history yet</p>
                <p className="text-sm">Start a new chat to begin</p>
              </>
            )}
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleChatSelect(chat.id)}
              className={`group flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-100 ${
                chat.id === activeSessionId ? 'bg-gray-100' : ''
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Clock 
  className={`h-4 w-4 text-gray-400 flex-shrink-0 ${isCollapsed ? 'text-indigo-600 hover:text-indigo-700' : 'text-gray-400'}`} 
/>
                {!isCollapsed && (
                  <span className="truncate text-sm">{chat.title}</span>
                )}
              </div>
              {!isCollapsed && (
                <button
                  onClick={(e) => handleDeleteChat(e, chat.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                  title="Delete chat"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};