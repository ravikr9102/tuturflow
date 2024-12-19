import React from 'react';
import { X, Mail, Facebook } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface LoginModalProps {
  onClose: () => void;
  onShowEducationalInfo: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ 
  onClose, 
  onShowEducationalInfo 
}) => {
  const { signInWithProvider } = useAuth();

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    try {
      const { needsEducationalInfo } = await signInWithProvider(provider);
      if (needsEducationalInfo) {
        onShowEducationalInfo();
      } else {
        onClose();
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="fixed tracking-wide inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md relative overflow-hidden p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full transition-all"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center mb-8 mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to TutorFlow
          </h2>
          <p className="text-gray-600">
            Continue with your preferred login method
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => handleSocialLogin('google')}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl border-2 border-gray-100 bg-white hover:bg-gray-50 transition-colors group"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span className="text-gray-700 font-medium">Continue with Google</span>
          </button>
          
          <button
            onClick={() => handleSocialLogin('facebook')}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-[#1877F2] hover:bg-[#1874EA] transition-colors text-white"
          >
            <Facebook className="h-5 w-5" />
            <span className="font-medium">Continue with Facebook</span>
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            By continuing, you agree to our{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-700">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-700">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};