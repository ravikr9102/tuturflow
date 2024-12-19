import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, GraduationCap, Clock, LogOut } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import { useCredits } from '../hooks/useCredits';
import { PurchaseCredits } from '../components/payment/PurchaseCredits';
import { Board, ClassLevel, Medium } from '../types/auth';
import { saveEducationalInfo, getEducationalInfo } from '../services/firestore.service';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();
  const { credits } = useCredits(user?.uid || null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [educationalInfo, setEducationalInfo] = useState({
    board: '' as Board,
    classLevel: '' as ClassLevel,
    medium: '' as Medium,
  });

  useEffect(() => {
    const fetchEducationalInfo = async () => {
      if (!user) return;
      
      try {
        const info = await getEducationalInfo(user.uid);
        if (info) {
          setEducationalInfo(info);
        }
      } catch (error) {
        console.error('Error fetching educational info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEducationalInfo();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleEducationalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await saveEducationalInfo(user.uid, educationalInfo);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving educational info:', error);
    }
  };

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <Home className="h-5 w-5" />
          <span>Back to Home</span>
        </button>
      </div>

      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 mb-8 text-white">
        <div className="flex items-center gap-4">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="h-16 w-16 rounded-full border-2 border-white"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-2xl font-bold">
                {user.displayName?.[0] || user.email?.[0] || '?'}
              </span>
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold">{user.displayName}</h1>
            <p className="text-white/80">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 grid-cols-1">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-900">Educational Information</h2>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-indigo-600 hover:text-indigo-700"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
            </div>
          ) : isEditing ? (
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
                Save Changes
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">
                <span className="font-medium">Board:</span>{' '}
                {educationalInfo.board || 'Not set'}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Class:</span>{' '}
                {educationalInfo.classLevel || 'Not set'}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Medium:</span>{' '}
                {educationalInfo.medium || 'Not set'}
              </p>
            </div>
          )}
        </div>

        <PurchaseCredits />

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="h-6 w-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Transaction History</h2>
          </div>
<div className='overflow-auto max-h-64'>
          {credits?.transactions && credits.transactions.length > 0 ? (
            <div className="space-y-4">
              {credits.transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div>
                    <p className="text-gray-900 font-medium">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`font-medium ${
                      transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'credit' ? '+' : '-'}
                    {transaction.amount} Credits
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No transactions yet</p>
          )}</div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
};