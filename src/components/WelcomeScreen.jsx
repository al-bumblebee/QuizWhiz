import React, { useState, useEffect } from 'react';
import DifficultySelector from './DifficultySelector';
import HighScores from './HighScores';
import AllScores from './AllScores';
import { getPlayerName, savePlayerName, cleanupDuplicateScores } from '../utils/storage';

const WelcomeScreen = ({ onStart, questionCounts }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy');
  const [showHighScores, setShowHighScores] = useState(false);
  const [showAllScores, setShowAllScores] = useState(false);
  const [playerName, setPlayerName] = useState('');

  useEffect(() => {
    // Load saved player name
    const savedName = getPlayerName();
    setPlayerName(savedName);
    
    // Make cleanup function available globally for debugging
    window.cleanupDuplicateScores = cleanupDuplicateScores;
  }, []);

  const handleStart = () => {
    // Save player name before starting
    savePlayerName(playerName);
    onStart(selectedDifficulty, playerName.trim() || 'Anonymous');
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    if (name.length <= 20) { // Limit name length
      setPlayerName(name);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8 text-center animate-fadeIn">
          {/* App Logo/Title */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4 animate-slideInLeft">
              Quiz<span className="text-magenta-500">Whiz</span>
            </h1>
            <p className="text-xl text-gray-600 font-medium animate-slideInRight">
              Test your knowledge with our interactive quiz
            </p>
          </div>

          {/* Player Name Input */}
          <div className="mb-8 animate-scaleIn">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">
                👤 Enter Your Name
              </h3>
              <div className="flex flex-col items-center">
                <input
                  type="text"
                  value={playerName}
                  onChange={handleNameChange}
                  placeholder="Enter your name (optional)"
                  className="w-full max-w-sm px-4 py-3 border-2 border-gray-200 rounded-xl text-center font-medium text-gray-800 focus:border-magenta-500 focus:outline-none transition-colors duration-200"
                  maxLength={20}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Your name will appear on the high scores leaderboard
                </p>
              </div>
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="mb-8 animate-scaleIn">
            <DifficultySelector
              selectedDifficulty={selectedDifficulty}
              onSelect={setSelectedDifficulty}
              questionCounts={questionCounts}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <button
              onClick={handleStart}
              className="px-12 py-4 bg-magenta-500 text-white rounded-xl font-bold text-xl hover:bg-magenta-600 transition-all duration-200 transform hover:scale-105 shadow-lg btn-press animate-pulse"
            >
              Start {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)} Quiz
              {playerName.trim() && (
                <span className="block text-sm font-normal mt-1 opacity-90">
                  Good luck, {playerName.trim()}! 🎯
                </span>
              )}
            </button>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowHighScores(true)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-lg hover:bg-gray-200 transition-all duration-200 transform hover:scale-105 shadow-md btn-press"
              >
                🏆 High Scores
              </button>
              
              <button
                onClick={() => setShowAllScores(true)}
                className="px-6 py-3 bg-blue-100 text-blue-700 rounded-xl font-semibold text-lg hover:bg-blue-200 transition-all duration-200 transform hover:scale-105 shadow-md btn-press"
              >
                📊 All Attempts
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gray-50 rounded-xl p-6 animate-fadeIn">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              How to Play
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 mb-4">
              <div className="flex items-center space-x-3">
                <span className="w-8 h-8 bg-magenta-100 text-magenta-600 rounded-full flex items-center justify-center font-bold">
                  1
                </span>
                <span>Read each question carefully</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="w-8 h-8 bg-magenta-100 text-magenta-600 rounded-full flex items-center justify-center font-bold">
                  2
                </span>
                <span>Select one of the four answer options</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="w-8 h-8 bg-magenta-100 text-magenta-600 rounded-full flex items-center justify-center font-bold">
                  3
                </span>
                <span>Answer before time runs out</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="w-8 h-8 bg-magenta-100 text-magenta-600 rounded-full flex items-center justify-center font-bold">
                  4
                </span>
                <span>Review your results and aim for high scores</span>
              </div>
            </div>
            
            {/* Data Persistence Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
              <div className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">📱 Your Data</p>
                  <p>High scores are saved in your browser and persist between sessions. Use the export feature in High Scores to backup your data.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* High Scores Modal */}
      {showHighScores && (
        <HighScores onClose={() => setShowHighScores(false)} />
      )}

      {/* All Scores Modal */}
      {showAllScores && (
        <AllScores onClose={() => setShowAllScores(false)} />
      )}
    </>
  );
};

export default WelcomeScreen;
