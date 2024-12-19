import React, { useState } from 'react';
import { X, Facebook, Mail } from 'lucide-react';
import { Board, ClassLevel, Medium } from '../../types/auth';
import { useAuth } from '../../hooks/useAuth';

interface SignupModalProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export const SignupModal: React.FC<SignupModalProps> = ({ onClose, onSwitchToLogin }) => {
  const { signInWithProvider, saveEducationalInfo } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [educationalInfo, setEducationalInfo] = useState({
    board: '' as Board,
    classLevel: '' as ClassLevel,
    medium: '' as Medium,
  });

  const handleSocialSignup = async (provider: 'google' | 'facebook') => {
    try {
      await signInWithProvider(provider);
      setStep(2);
    } catch (error) {
      console.error('Signup error:', error);
      // Handle error (show error message to user)
    }
  };

  const handleEducationalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveEducationalInfo(educationalInfo);
      onClose();
    } catch (error) {
      console.error('Error saving educational info:', error);
      // Handle error (show error message to user)
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        {step === 1 ? (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Join TutorFlow</h2>
            <div className="space-y-4">
              <button
                onClick={() => handleSocialSignup('google')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Mail className="h-5 w-5 text-red-500" />
                <span>Continue with Google</span>
              </button>
              <button
                onClick={() => handleSocialSignup('facebook')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Facebook className="h-5 w-5 text-blue-600" />
                <span>Continue with Facebook</span>
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={onSwitchToLogin}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Sign in
                </button>
              </p>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Educational Information</h2>
            <form onSubmit={handleEducationalInfoSubmit} className="space-y-6">
              <div>
                <label htmlFor="board" className="block text-sm font-medium text-gray-700">
                  Board
                </label>
                <select
                  id="board"
                  value={educationalInfo.board}
                  onChange={(e) => setEducationalInfo(prev => ({ ...prev, board: e.target.value as Board }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select Board</option>
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                  <option value="State Board">State Board</option>
                </select>
              </div>

              <div>
                <label htmlFor="class" className="block text-sm font-medium text-gray-700">
                  Class
                </label>
                <select
                  id="class"
                  value={educationalInfo.classLevel}
                  onChange={(e) => setEducationalInfo(prev => ({ ...prev, classLevel: e.target.value as ClassLevel }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select Class</option>
                  {['6th', '7th', '8th', '9th', '10th', '11th', '12th'].map((cls) => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="medium" className="block text-sm font-medium text-gray-700">
                  Medium
                </label>
                <select
                  id="medium"
                  value={educationalInfo.medium}
                  onChange={(e) => setEducationalInfo(prev => ({ ...prev, medium: e.target.value as Medium }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select Medium</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Regional">Regional</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Complete Signup
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};