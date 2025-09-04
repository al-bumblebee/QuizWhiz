import React, { useState } from 'react';
import { getHighScores, getDifficultyBadgeColor, formatTime, exportHighScores, importHighScores } from '../utils/storage';

const HighScores = ({ onClose }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy');
  const [showImportDialog, setShowImportDialog] = useState(false);
  const highScores = getHighScores();

  const difficulties = ['easy', 'medium', 'hard'];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        await importHighScores(file);
        alert('High scores imported successfully!');
        window.location.reload(); // Refresh to show imported scores
      } catch (error) {
        alert('Failed to import scores: ' + error.message);
      }
    }
    setShowImportDialog(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">🏆 High Scores</h2>
          <div className="flex items-center space-x-2">
            {/* Export Button */}
            <button
              onClick={exportHighScores}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              title="Export scores to file"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
            
            {/* Import Button */}
            <button
              onClick={() => setShowImportDialog(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              title="Import scores from file"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </button>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              aria-label="Close high scores"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Difficulty Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
          {difficulties.map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => setSelectedDifficulty(difficulty)}
              className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-all duration-200 ${
                selectedDifficulty === difficulty
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getDifficultyBadgeColor(difficulty)}`}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </span>
            </button>
          ))}
        </div>

        {/* Scores List */}
        <div className="space-y-3">
          {highScores[selectedDifficulty] && highScores[selectedDifficulty].length > 0 ? (
            <>
              <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-600 pb-2 border-b">
                <div className="col-span-1">#</div>
                <div className="col-span-3">Player</div>
                <div className="col-span-2">Score</div>
                <div className="col-span-2">%</div>
                <div className="col-span-2">Time</div>
                <div className="col-span-2">Date</div>
              </div>
              
              {highScores[selectedDifficulty].map((score, index) => (
                <div
                  key={`${score.id}-${index}`}
                  className={`grid grid-cols-12 gap-2 p-3 rounded-lg transition-colors duration-200 ${
                    index === 0
                      ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200'
                      : index === 1
                      ? 'bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200'
                      : index === 2
                      ? 'bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200'
                      : 'bg-gray-50 border border-gray-100'
                  }`}
                >
                  <div className="col-span-1 flex items-center">
                    {index === 0 && <span className="text-yellow-500">🥇</span>}
                    {index === 1 && <span className="text-gray-500">🥈</span>}
                    {index === 2 && <span className="text-orange-500">🥉</span>}
                    {index > 2 && <span className="font-medium text-gray-600">{index + 1}</span>}
                  </div>
                  
                  <div className="col-span-3 font-medium text-gray-800 truncate">
                    {score.playerName || 'Anonymous'}
                  </div>
                  
                  <div className="col-span-2 font-medium text-gray-800">
                    {score.score}/{score.totalQuestions}
                  </div>
                  
                  <div className="col-span-2">
                    <span className={`font-bold ${
                      score.percentage >= 90 ? 'text-green-600' :
                      score.percentage >= 70 ? 'text-blue-600' :
                      score.percentage >= 50 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {score.percentage}%
                    </span>
                  </div>
                  
                  <div className="col-span-2 text-gray-600 font-mono text-sm">
                    {formatTime(score.timeElapsed)}
                  </div>
                  
                  <div className="col-span-2 text-gray-500 text-sm">
                    {formatDate(score.date)}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                No scores yet for {selectedDifficulty} difficulty
              </h3>
              <p className="text-gray-500">
                Complete a quiz to see your high scores here!
              </p>
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-magenta-500 text-white rounded-xl font-semibold hover:bg-magenta-600 transition-colors duration-200"
          >
            Close
          </button>
        </div>

        {/* Import Dialog */}
        {showImportDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Import High Scores</h3>
              <p className="text-gray-600 mb-4">
                Select a JSON file previously exported from QuizWhiz to restore your high scores.
              </p>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowImportDialog(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HighScores;
