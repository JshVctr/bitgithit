import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: string;
}

export interface Session {
  date: string;
  handsPlayed: number;
  result: 'win' | 'loss' | 'push';
  netWin: number;
}

export interface QuizStats {
  basicStrategy: { correct: number; total: number };
  cardCounting: { correct: number; total: number };
}

export interface UserStats {
  gamesPlayed: number;
  handsPlayed: number;
  winRate: number;
  strategyAccuracy: number;
  strategyDecisions?: number;
  strategyCorrect?: number;
  countingAccuracy: number;
  recentSessions: Session[];
}

export interface UserPreferences {
  showStrategyHints: boolean;
  enableCardCounting: boolean;
  autoAdvance: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface User {
  id: string;
  name: string;
  email: string;
  level: number;
  experience: number;
  memberSince: string;
  achievements: Achievement[];
  stats: UserStats;
  quizStats: QuizStats;
  preferences: UserPreferences;
}

export interface XpGain {
  id: string;
  amount: number;
  reason?: string;
  level?: number;
  levelUp?: boolean;
}

export const getXpForLevel = (level: number) => {
  const easyStart = 30;
  const tierSize = 5;
  const tier = Math.floor((level - 1) / tierSize);
  const increment = 10 + tier * 10;

  return easyStart + (level - 1) * increment;
};

const defaultUser: User = {
  id: '',
  name: '21 Player',
  email: 'player@21.com',
  level: 1,
  experience: 0,
  memberSince: new Date().toISOString(),
  achievements: [],
  stats: {
    gamesPlayed: 0,
    handsPlayed: 0,
    winRate: 0,
    strategyAccuracy: 0,
    strategyDecisions: 0,
    strategyCorrect: 0,
    countingAccuracy: 0,
    recentSessions: [],
  },
  quizStats: {
    basicStrategy: { correct: 0, total: 0 },
    cardCounting: { correct: 0, total: 0 },
  },
  preferences: {
    showStrategyHints: true,
    enableCardCounting: true,
    autoAdvance: false,
    difficulty: 'beginner',
  },
};

interface UserContextType {
  user: User;
  isLoading: boolean;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updateStats: (stats: Partial<UserStats>) => void;
  updateQuizStats: (type: 'basicStrategy' | 'cardCounting', correct: boolean) => void;
  addAchievement: (achievement: Omit<Achievement, 'unlockedAt'>) => Promise<void>;
  addExperience: (amount: number, reason?: string) => Promise<void>;
  xpGains: XpGain[];
  dismissXpGain: (id: string) => void;
  nextLevelXp: number;
  loadUserData: (userId: string) => Promise<void>;
  savePreferences: (preferences: UserPreferences) => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(defaultUser);
  const [xpGains, setXpGains] = useState<XpGain[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const nextLevelXp = getXpForLevel(user.level);

  const loadUserData = async (userId: string) => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      const { data: stats, error: statsError } = await supabase
        .from('game_stats')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      const { data: sessions, error: sessionsError } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('session_date', { ascending: false })
        .limit(10);

      const { data: achievements, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', userId)
        .order('unlocked_at', { ascending: false });

      const { data: preferences, error: preferencesError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      const { data: quizResults, error: quizError } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', userId);

      const basicStrategyQuizzes = quizResults?.filter(q => q.quiz_type === 'basic-strategy') || [];
      const cardCountingQuizzes = quizResults?.filter(q => q.quiz_type === 'card-counting') || [];

      const basicStrategyCorrect = basicStrategyQuizzes.reduce((sum, q) => sum + q.correct_answers, 0);
      const basicStrategyTotal = basicStrategyQuizzes.reduce((sum, q) => sum + q.question_count, 0);
      const cardCountingCorrect = cardCountingQuizzes.reduce((sum, q) => sum + q.correct_answers, 0);
      const cardCountingTotal = cardCountingQuizzes.reduce((sum, q) => sum + q.question_count, 0);

      const recentSessions: Session[] = (sessions || []).map(s => ({
        date: s.session_date,
        handsPlayed: s.hands_played,
        result: s.result as 'win' | 'loss' | 'push',
        netWin: s.net_result,
      }));

      const achievementsList: Achievement[] = (achievements || []).map(a => ({
        id: a.achievement_id,
        title: a.title,
        description: a.description,
        unlockedAt: a.unlocked_at,
      }));

      const winRate = stats && stats.hands_played > 0
        ? stats.hands_won / stats.hands_played
        : 0;

      const strategyAccuracy = stats && stats.strategy_total > 0
        ? stats.strategy_correct / stats.strategy_total
        : 0;

      const countingAccuracy = stats && stats.counting_total > 0
        ? stats.counting_correct / stats.counting_total
        : 0;

      setUser({
        id: profile.id,
        name: profile.name,
        email: profile.email || '',
        level: profile.level,
        experience: profile.experience,
        memberSince: profile.member_since || profile.created_at,
        achievements: achievementsList,
        stats: {
          gamesPlayed: stats?.games_played || 0,
          handsPlayed: stats?.hands_played || 0,
          winRate,
          strategyAccuracy,
          strategyDecisions: stats?.strategy_total || 0,
          strategyCorrect: stats?.strategy_correct || 0,
          countingAccuracy,
          recentSessions,
        },
        quizStats: {
          basicStrategy: {
            correct: basicStrategyCorrect,
            total: basicStrategyTotal,
          },
          cardCounting: {
            correct: cardCountingCorrect,
            total: cardCountingTotal,
          },
        },
        preferences: preferences ? {
          showStrategyHints: preferences.show_strategy_hints,
          enableCardCounting: preferences.enable_card_counting,
          autoAdvance: preferences.auto_advance,
          difficulty: preferences.difficulty as 'beginner' | 'intermediate' | 'advanced',
        } : defaultUser.preferences,
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user.id) return;

    setUser(prev => ({ ...prev, ...data }));

    try {
      const updateData: any = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.email !== undefined) updateData.email = data.email;

      if (Object.keys(updateData).length > 0) {
        await supabase
          .from('user_profiles')
          .update({ ...updateData, updated_at: new Date().toISOString() })
          .eq('id', user.id);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const savePreferences = async (preferences: UserPreferences) => {
    if (!user.id) return;

    setUser(prev => ({ ...prev, preferences }));

    try {
      await supabase
        .from('user_preferences')
        .update({
          show_strategy_hints: preferences.showStrategyHints,
          enable_card_counting: preferences.enableCardCounting,
          auto_advance: preferences.autoAdvance,
          difficulty: preferences.difficulty,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const updateStats = (stats: Partial<UserStats>) => {
    setUser(prev => ({
      ...prev,
      stats: { ...prev.stats, ...stats }
    }));
  };

  const updateQuizStats = (type: 'basicStrategy' | 'cardCounting', correct: boolean) => {
    setUser(prev => {
      const newStats = {
        ...prev.quizStats,
        [type]: {
          correct: prev.quizStats[type].correct + (correct ? 1 : 0),
          total: prev.quizStats[type].total + 1
        }
      };

      const totalCorrect = newStats.basicStrategy.correct + newStats.cardCounting.correct;
      const totalQuestions = newStats.basicStrategy.total + newStats.cardCounting.total;

      return {
        ...prev,
        quizStats: newStats,
        stats: {
          ...prev.stats,
          strategyAccuracy: totalQuestions > 0 ? totalCorrect / totalQuestions : 0
        }
      };
    });
  };

  const addAchievement = async (achievement: Omit<Achievement, 'unlockedAt'>) => {
    if (!user.id) return;

    const newAchievement: Achievement = {
      ...achievement,
      unlockedAt: new Date().toISOString()
    };

    setUser(prev => ({
      ...prev,
      achievements: [...prev.achievements, newAchievement]
    }));

    try {
      await supabase
        .from('achievements')
        .insert({
          user_id: user.id,
          achievement_id: newAchievement.id,
          title: newAchievement.title,
          description: newAchievement.description,
          unlocked_at: newAchievement.unlockedAt,
        });
    } catch (error) {
      console.error('Error adding achievement:', error);
    }
  };

  const addExperience = async (amount: number, reason?: string) => {
    if (!user.id) return;

    setUser(prev => {
      let xpPool = prev.experience + amount;
      let newLevel = prev.level;
      let leveledUp = false;

      let required = getXpForLevel(newLevel);
      while (xpPool >= required) {
        xpPool -= required;
        newLevel += 1;
        required = getXpForLevel(newLevel);
        leveledUp = true;
      }

      setXpGains(current => [
        ...current,
        {
          id: crypto.randomUUID(),
          amount,
          reason,
          level: newLevel,
          levelUp: leveledUp,
        },
      ]);

      (async () => {
        try {
          await supabase
            .from('user_profiles')
            .update({
              level: newLevel,
              experience: xpPool,
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id);
        } catch (error) {
          console.error('Error updating experience:', error);
        }
      })();

      return {
        ...prev,
        level: newLevel,
        experience: xpPool,
      };
    });
  };

  const dismissXpGain = (id: string) => {
    setXpGains(prev => prev.filter(gain => gain.id !== id));
  };

  return (
    <UserContext.Provider value={{
      user,
      isLoading,
      updateProfile,
      updateStats,
      updateQuizStats,
      addAchievement,
      addExperience,
      xpGains,
      dismissXpGain,
      nextLevelXp,
      loadUserData,
      savePreferences,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
