import React from 'react';
import { CheckCircle, Lightbulb, XCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { StrategyFeedback } from '../utils/strategy';

interface ActionFeedbackProps {
  feedback: StrategyFeedback | null;
}

export const ActionFeedback: React.FC<ActionFeedbackProps> = ({ feedback }) => {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  if (!feedback) return null;

  const Icon = feedback.isOptimal ? CheckCircle : XCircle;
  const accentClass = feedback.isOptimal ? 'text-green-500' : 'text-amber-500';

  return (
    <div className={`${themeClasses.cardBg} border ${themeClasses.border} rounded-xl p-4 shadow-sm transition-all`}>
      <div className="flex items-start space-x-3">
        <Icon className={`${accentClass} h-5 w-5 mt-0.5`} />
        <div className="space-y-1">
          <p className={`${themeClasses.text} font-semibold text-sm`}>{feedback.message}</p>
          <div className="flex items-center space-x-2 text-sm">
            <span className={`${themeClasses.textSecondary} font-medium`}>Your move:</span>
            <span className={`${themeClasses.text} uppercase tracking-wide`}>{feedback.playerAction}</span>
          </div>
          {!feedback.isOptimal && (
            <div className="flex items-center space-x-2 text-sm">
              <span className={`${themeClasses.textSecondary} font-medium`}>Optimal:</span>
              <span className={`${themeClasses.text} uppercase tracking-wide`}>{feedback.optimalAction}</span>
            </div>
          )}
          <div className="flex items-start space-x-2 text-sm">
            <Lightbulb className={`${themeClasses.textSecondary} h-4 w-4 mt-0.5`} />
            <p className={`${themeClasses.textSecondary}`}>{feedback.recommendationReason}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
