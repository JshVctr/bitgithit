import React, { useState } from 'react';
import { PlayingCard } from './PlayingCard';
import { useGame } from '../contexts/GameContext';
import { useTheme } from '../contexts/ThemeContext';
import { recordStrategyDecision } from '../utils/strategy';
import { RefreshCw } from 'lucide-react';

interface BlackjackGameProps {
  onDecisionFeedback?: (feedback: StrategyFeedback | null) => void;
}

export const BlackjackGame: React.FC<BlackjackGameProps> = ({ onDecisionFeedback }) => {
  const { gameState, dispatch } = useGame();
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  const [showResults, setShowResults] = useState(false);

  const handleNewGame = () => {
    dispatch({ type: 'NEW_GAME' });
    setShowResults(false);
  };


  const handleDealCards = () => {
    dispatch({ type: 'DEAL_CARDS' });
  };

  const handleHit = () => {
    recordStrategyDecision(gameState, 'HIT');
    dispatch({ type: 'HIT' });
  };

  const handleStand = () => {
    recordStrategyDecision(gameState, 'STAND');
    dispatch({ type: 'STAND' });
  };

  const handleDouble = () => {
    recordStrategyDecision(gameState, 'DOUBLE');
    dispatch({ type: 'DOUBLE' });
  };

  const currentPlayerHand = gameState.playerHands[gameState.currentHandIndex];
  const showDealerSecondCard = gameState.gamePhase === 'dealer' || gameState.gamePhase === 'finished';

  return (
    <div className={`${themeClasses.cardBg} backdrop-blur-sm border ${themeClasses.border} rounded-xl p-8 shadow-lg`}>
      {/* Dealer Section */}
      <div className="mb-12">
        <h3 className={`${themeClasses.text} text-lg font-semibold mb-4`}>Dealer</h3>
        <div className="flex space-x-4 mb-4">
          {gameState.dealerHand.cards.map((card, index) => (
            <div key={index}>
              <PlayingCard card={card} hidden={index === 1 && !showDealerSecondCard} />
            </div>
          ))}
        </div>
        <div className={`${themeClasses.text} font-semibold`}>
          Total: {showDealerSecondCard ? gameState.dealerHand.value : gameState.dealerHand.cards[0]?.value || '?'}
        </div>
      </div>

      {/* Player Section */}
      <div className="mb-6">
        <h3 className={`${themeClasses.text} text-base font-semibold mb-3`}>Your Hand</h3>
        <div className="flex space-x-3 mb-2">
          {currentPlayerHand.cards.map((card, index) => (
            <div key={index} className="transform scale-90">
              <PlayingCard card={card} />
            </div>
          ))}
        </div>
        <div className={`${themeClasses.text} font-semibold text-lg`}>
          Total: {currentPlayerHand.value}
          {currentPlayerHand.isSoft && currentPlayerHand.value <= 21 && ' (Soft)'}
        </div>
      </div>

      {/* Game Controls */}
      <div className="flex flex-wrap gap-3 mb-4">
        {gameState.gamePhase === 'ready' && (
          <button
            onClick={handleDealCards}
            className={`${themeClasses.accent} ${themeClasses.accentHover} text-white px-5 py-2 rounded-lg font-semibold transition-all`}
          >
            Deal Cards
          </button>
        )}

        {gameState.gamePhase === 'playing' && (
          <>
            <button
              onClick={handleHit}
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-semibold transition-all"
            >
              Hit
            </button>
            <button
              onClick={handleStand}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-semibold transition-all"
            >
              Stand
            </button>
            {gameState.canDouble && (
              <button
                onClick={handleDouble}
                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold transition-all"
              >
                Double
              </button>
            )}
            {gameState.canSplit && (
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-semibold transition-all"
              >
                Split
              </button>
            )}
          </>
        )}
      </div>

      {/* Game Status */}
      {gameState.lastAction && (
        <div className={`text-center mb-3 text-base font-semibold ${themeClasses.text}`}>
          {gameState.lastAction}
        </div>
      )}

      {/* New Game Button */}
      {(gameState.gamePhase === 'finished' || gameState.gamePhase === 'ready') && (
        <div className="text-center mt-4">
          <button
            onClick={handleNewGame}
            className={`flex items-center space-x-2 ${themeClasses.cardBg} ${themeClasses.text} ${themeClasses.surfaceHover} px-5 py-2 rounded-lg font-semibold transition-all mx-auto border ${themeClasses.border}`}
          >
            <RefreshCw className="h-4 w-4" />
            <span>New Game</span>
          </button>
        </div>
      )}
    </div>
  );
};