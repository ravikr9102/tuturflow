import React, { useState, useRef, useEffect } from 'react';
import { UserCircle, LogOut, User } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { useCredits } from '../../hooks/useCredits';
import { useNavigate } from 'react-router-dom';

interface ProfileDropdownProps {
  onLoginClick: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  onLoginClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuthContext();
  const { credits, loading } = useCredits(user?.uid || null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt="Profile"
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <UserCircle className="h-8 w-8" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50">
          {user ? (
            <>
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">
                  {user.displayName || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/profile');
                  }}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-50 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLoginClick();
                }}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
              >
                Log In / Sign Up
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};