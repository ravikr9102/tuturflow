import React from 'react';
import { LogIn } from 'lucide-react';

interface AuthRequiredOverlayProps {
  message?: string;
  subMessage?: string;
}

export const AuthRequiredOverlay: React.FC<AuthRequiredOverlayProps> = ({
  message = "Please log in to access this feature",
  subMessage = "Create an account or log in to continue"
}) => {
  return (
    <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
      <LogIn className="h-12 w-12 text-indigo-600 mb-4" />
      <p className="text-lg font-medium text-gray-900 mb-2">
        {message}
      </p>
      <p className="text-sm text-gray-600">
        {subMessage}
      </p>
    </div>
  );
};