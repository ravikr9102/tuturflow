import React, { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { ProfileDropdown } from './auth/ProfileDropdown';
import { LoginModal } from './auth/LoginModal';
import { EducationalInfoModal } from './auth/EducationalInfoModal';
import { CreditBalance } from './credits/CreditBalance';
import { useAuthContext } from '../context/AuthContext';
import { useCredits } from '../hooks/useCredits';

export const Header: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showEducationalInfoModal, setShowEducationalInfoModal] = useState(false);
  const { user } = useAuthContext();
  const { credits } = useCredits(user?.uid || null);

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                TutorFlow
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user && <CreditBalance credits={credits} />}
            <ProfileDropdown
              onLoginClick={() => setShowLoginModal(true)}
            />
          </div>
        </div>
      </div>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onShowEducationalInfo={() => {
            setShowLoginModal(false);
            setShowEducationalInfoModal(true);
          }}
        />
      )}

      {showEducationalInfoModal && (
        <EducationalInfoModal
          onClose={() => setShowEducationalInfoModal(false)}
        />
      )}
    </header>
  );
};