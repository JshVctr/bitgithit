import React, { useState } from 'react';
import { Spade, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (username.length > 20) {
      setError('Username must be less than 20 characters');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores');
      return;
    }

    setIsLoading(true);
    const success = await login(username);
    setIsLoading(false);

    if (!success) {
      setError('Failed to login. Please try again.');
    }
  };

  return (
    <div className={`${themeClasses.bg} min-h-screen flex items-center justify-center px-6`}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Spade className="h-16 w-16 text-green-600" />
          </div>
          <h1 className={`text-5xl font-bold ${themeClasses.text} mb-3`}>Ratio</h1>
          <p className={`text-lg ${themeClasses.textSecondary}`}>
            Master the art of blackjack strategy
          </p>
        </div>

        <div className={`${themeClasses.cardBg} border ${themeClasses.border} rounded-xl p-8 shadow-xl`}>
          <h2 className={`text-2xl font-bold ${themeClasses.text} mb-6 text-center`}>
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className={`w-full ${themeClasses.cardBg} border ${themeClasses.border} ${themeClasses.text} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition`}
                disabled={isLoading}
                autoFocus
              />
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full ${themeClasses.accent} text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <span>Loading...</span>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  <span>Continue</span>
                </>
              )}
            </button>
          </form>

          <div className={`mt-6 pt-6 border-t ${themeClasses.border}`}>
            <p className={`text-sm ${themeClasses.textSecondary} text-center`}>
              New here? Just enter a username to create an account
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
