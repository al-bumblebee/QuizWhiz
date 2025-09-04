import React from 'react';
import { getDifficultyBadgeColor } from '../utils/storage';

const DifficultySelector = ({ selectedDifficulty, onSelect, questionCounts }) => {
  const difficulties = [
    {
      level: 'easy',
      label: 'Easy',
      description: 'Basic questions for beginners',
      icon: '🟢',
      timePerQuestion: 45
    },
    {
      level: 'medium',
      label: 'Medium',
      description: 'Moderate difficulty questions',
      icon: '🟡',
      timePerQuestion: 30
    },
    {
      level: 'hard',
      label: 'Hard',
      description: 'Challenging questions for experts',
      icon: '🔴',
      timePerQuestion: 20
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
        Choose Difficulty Level
      </h3>
      
      <div className="grid gap-4 md:grid-cols-3">
        {difficulties.map((diff) => (
          <button
            key={diff.level}
            onClick={() => onSelect(diff.level)}
            className={`p-6 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 text-left ${
              selectedDifficulty === diff.level
                ? 'border-magenta-500 bg-magenta-50 shadow-lg'
                : 'border-gray-200 bg-white hover:border-magenta-300 hover:bg-magenta-25'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">{diff.icon}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyBadgeColor(diff.level)}`}>
                {diff.label}
              </span>
            </div>
            
            <h4 className="font-bold text-lg text-gray-800 mb-2">
              {diff.label}
            </h4>
            
            <p className="text-gray-600 text-sm mb-3">
              {diff.description}
            </p>
            
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Questions:</span>
                <span className="font-medium">{questionCounts[diff.level] || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Time per question:</span>
                <span className="font-medium">{diff.timePerQuestion}s</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DifficultySelector;
