import React, { useState } from 'react';
import { X, GraduationCap } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Board, ClassLevel, Medium } from '../../types/auth';

interface EducationalInfoModalProps {
  onClose: () => void;
}

export const EducationalInfoModal: React.FC<EducationalInfoModalProps> = ({ onClose }) => {
  const { saveEducationalInfo } = useAuth();
  const [educationalInfo, setEducationalInfo] = useState({
    board: '' as Board,
    classLevel: '' as ClassLevel,
    medium: '' as Medium,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveEducationalInfo(educationalInfo);
      onClose();
    } catch (error) {
      console.error('Error saving educational info:', error);
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
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-100 p-3 rounded-full">
              <GraduationCap className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Complete Your Profile
          </h2>
          <p className="text-gray-600">
            Help us personalize your learning experience
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="board" className="block text-sm font-medium text-gray-700 mb-2">
              Select Your Board
            </label>
            <select
              id="board"
              value={educationalInfo.board}
              onChange={(e) => setEducationalInfo(prev => ({ ...prev, board: e.target.value as Board }))}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition-all"
              required
            >
              <option value="">Choose a board</option>
              <option value="CBSE">CBSE</option>
              <option value="ICSE">ICSE</option>
              <option value="State Board">State Board</option>
            </select>
          </div>

          <div>
            <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-2">
              Select Your Class
            </label>
            <select
              id="class"
              value={educationalInfo.classLevel}
              onChange={(e) => setEducationalInfo(prev => ({ ...prev, classLevel: e.target.value as ClassLevel }))}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition-all"
              required
            >
              <option value="">Choose your class</option>
              {['6th', '7th', '8th', '9th', '10th', '11th', '12th'].map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="medium" className="block text-sm font-medium text-gray-700 mb-2">
              Select Your Medium
            </label>
            <select
              id="medium"
              value={educationalInfo.medium}
              onChange={(e) => setEducationalInfo(prev => ({ ...prev, medium: e.target.value as Medium }))}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition-all"
              required
            >
              <option value="">Choose medium of instruction</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Regional">Regional</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 transition-colors font-medium mt-8"
          >
            Complete Profile
          </button>
        </form>
      </div>
    </div>
  );
};