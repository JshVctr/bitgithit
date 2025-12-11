import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Login } from './components/Login';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { Stats } from './pages/Stats';
import { Learn } from './pages/Learn';
import { Quiz } from './pages/Quiz';
import { Play } from './pages/Play';
import { GameProvider } from './contexts/GameContext';
import { UserProvider, useUser } from './contexts/UserContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LearningProvider } from './contexts/LearningContext';
import { XpToastStack } from './components/XpToastStack';

export type Page = 'home' | 'profile' | 'stats' | 'learn' | 'quiz' | 'play';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { userId, isLoading: authLoading } = useAuth();
  const { loadUserData } = useUser();

  useEffect(() => {
    if (userId) {
      loadUserData(userId);
    }
  }, [userId, loadUserData]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'profile':
        return <Profile />;
      case 'stats':
        return <Stats />;
      case 'learn':
        return <Learn />;
      case 'quiz':
        return <Quiz />;
      case 'play':
        return <Play />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!userId) {
    return <Login />;
  }

  return (
    <div className="min-h-screen">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      <XpToastStack />
      <main className="pt-16">
        {renderPage()}
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserProvider>
          <GameProvider>
            <LearningProvider>
              <AppContent />
            </LearningProvider>
          </GameProvider>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
