import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  userId: string | null;
  username: string | null;
  isLoading: boolean;
  login: (username: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUserId = localStorage.getItem('ratio-user-id');
    const savedUsername = localStorage.getItem('ratio-username');

    if (savedUserId && savedUsername) {
      setUserId(savedUserId);
      setUsername(savedUsername);
    }

    setIsLoading(false);
  }, []);

  const login = async (username: string): Promise<boolean> => {
    try {
      const trimmedUsername = username.trim().toLowerCase();

      if (!trimmedUsername) {
        return false;
      }

      const { data: existingUser, error: fetchError } = await supabase
        .from('user_profiles')
        .select('id, username, name, email, level, experience')
        .eq('username', trimmedUsername)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching user:', fetchError);
        return false;
      }

      let user = existingUser;

      if (!user) {
        const { data: newUser, error: createError } = await supabase
          .from('user_profiles')
          .insert({
            username: trimmedUsername,
            name: trimmedUsername,
            email: '',
            level: 1,
            experience: 0,
            member_since: new Date().toISOString(),
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating user:', createError);
          return false;
        }

        user = newUser;

        await supabase.from('game_stats').insert({
          user_id: newUser.id,
          games_played: 0,
          hands_played: 0,
          hands_won: 0,
          hands_lost: 0,
          hands_pushed: 0,
          natural_21s: 0,
          busts: 0,
          strategy_correct: 0,
          strategy_total: 0,
          counting_correct: 0,
          counting_total: 0,
        });

        await supabase.from('user_preferences').insert({
          user_id: newUser.id,
          show_strategy_hints: true,
          enable_card_counting: true,
          auto_advance: false,
          difficulty: 'beginner',
          theme: 'light',
        });
      }

      if (user) {
        setUserId(user.id);
        setUsername(user.username);
        localStorage.setItem('ratio-user-id', user.id);
        localStorage.setItem('ratio-username', user.username);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUserId(null);
    setUsername(null);
    localStorage.removeItem('ratio-user-id');
    localStorage.removeItem('ratio-username');
  };

  return (
    <AuthContext.Provider value={{ userId, username, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
