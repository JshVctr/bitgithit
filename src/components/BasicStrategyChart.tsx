import React, { useState } from 'react';
import { Target, Info } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const BasicStrategyChart: React.FC = () => {
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  // Basic strategy chart data
  const hardTotals = [
    ['', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'A'],
    ['5-8', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'],
    ['9', 'H', 'D', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'],
    ['10', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'H', 'H'],
    ['11', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'H'],
    ['12', 'H', 'H', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
    ['13', 'S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
    ['14', 'S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
    ['15', 'S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'R', 'H'],
    ['16', 'S', 'S', 'S', 'S', 'S', 'H', 'H', 'R', 'R', 'R'],
    ['17+', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
  ];

  const softTotals = [
    ['', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'A'],
    ['A,2', 'H', 'H', 'H', 'D', 'D', 'H', 'H', 'H', 'H', 'H'],
    ['A,3', 'H', 'H', 'H', 'D', 'D', 'H', 'H', 'H', 'H', 'H'],
    ['A,4', 'H', 'H', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'],
    ['A,5', 'H', 'H', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'],
    ['A,6', 'H', 'D', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'],
    ['A,7', 'S', 'D', 'D', 'D', 'D', 'S', 'S', 'H', 'H', 'H'],
    ['A,8', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
    ['A,9', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
  ];

  const pairs = [
    ['', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'A'],
    ['A,A', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['10,10', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
    ['9,9', 'P', 'P', 'P', 'P', 'P', 'S', 'P', 'P', 'S', 'S'],
    ['8,8', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['7,7', 'P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'],
    ['6,6', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H', 'H'],
    ['5,5', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'H', 'H'],
    ['4,4', 'H', 'H', 'H', 'P', 'P', 'H', 'H', 'H', 'H', 'H'],
    ['3,3', 'P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'],
    ['2,2', 'P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'],
  ];

  const getCellColor = (action: string) => {
    switch (action) {
      case 'H': return 'bg-red-100 text-red-700 border-red-200';
      case 'S': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'D': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'P': return 'bg-green-100 text-green-700 border-green-200';
      case 'R': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getActionName = (action: string) => {
    switch (action) {
      case 'H': return 'Hit';
      case 'S': return 'Stand';
      case 'D': return 'Double Down';
      case 'P': return 'Split';
      case 'R': return 'Surrender';
      default: return action;
    }
  };

  const renderChart = (title: string, data: string[][]) => (
    <div className="mb-8">
      <h3 className={`text-xl font-semibold ${themeClasses.text} mb-4`}>{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => {
                  const isHeader = rowIndex === 0 || cellIndex === 0;
                  const cellKey = `${title}-${rowIndex}-${cellIndex}`;

                  return (
                    <td
                      key={cellIndex}
                      className={`p-2 text-center font-medium border ${
                        isHeader
                          ? `${themeClasses.surface} ${themeClasses.text} ${themeClasses.border}`
                          : `${getCellColor(cell)} hover:opacity-80 cursor-pointer`
                      }`}
                      onClick={() => !isHeader && setSelectedCell(cellKey)}
                    >
                      {isHeader ? cell : getActionName(cell)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="max-w-none">
      <div className="flex items-center mb-6">
        <Target className="h-6 w-6 text-green-500 mr-2" />
        <h2 className={`text-3xl font-bold ${themeClasses.text}`}>Basic Strategy Charts</h2>
      </div>

      <div className={`${themeClasses.surface} border ${themeClasses.border} rounded-lg p-4 mb-8`}>
        <div className="flex items-center space-x-2 mb-2">
          <Info className="h-5 w-5 text-green-500" />
          <span className={`${themeClasses.text} font-medium`}>How to Use</span>
        </div>
        <p className={`${themeClasses.textSecondary} text-sm`}>
          Find your hand total in the left column, then follow that row to the dealer's upcard column.
          The intersection shows the mathematically optimal play.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-1 gap-8">
        {renderChart('Hard Totals', hardTotals)}
        {renderChart('Soft Totals', softTotals)}
        {renderChart('Pairs', pairs)}
      </div>

      <div className={`${themeClasses.surface} border ${themeClasses.border} rounded-lg p-6 mt-8`}>
        <h3 className={`text-xl font-semibold ${themeClasses.text} mb-4`}>Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-200 border border-red-300 rounded"></div>
            <span className={themeClasses.text}>Hit</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-200 border border-blue-300 rounded"></div>
            <span className={themeClasses.text}>Stand</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-200 border border-yellow-300 rounded"></div>
            <span className={themeClasses.text}>Double Down</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-200 border border-green-300 rounded"></div>
            <span className={themeClasses.text}>Split</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-purple-200 border border-purple-300 rounded"></div>
            <span className={themeClasses.text}>Surrender</span>
          </div>
        </div>
      </div>
    </div>
  );
};