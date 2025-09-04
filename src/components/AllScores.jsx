import React, { useState } from 'react';
import { getAllScores, getDifficultyBadgeColor, formatTime } from '../utils/storage';

const AllScores = ({ onClose }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy');
  const [currentPage, setCurrentPage] = useState(1);
  const scoresPerPage = 20;
  
  const allScores = getAllScores();
  const difficulties = ['easy', 'medium', 'hard'];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Pagination
  const totalScores = allScores[selectedDifficulty]?.length || 0;
  const totalPages = Math.ceil(totalScores / scoresPerPage);
  const startIndex = (currentPage - 1) * scoresPerPage;
  const endIndex = startIndex + scoresPerPage;
  const currentScores = allScores[selectedDifficulty]?.slice(startIndex, endIndex) || [];

  const handleDifficultyChange = (difficulty) => {
    setSelectedDifficulty(difficulty);
    setCurrentPage(1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">📊 All Quiz Attempts</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Close all scores"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Difficulty Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
          {difficulties.map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => handleDifficultyChange(difficulty)}
              className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-all duration-200 ${
                selectedDifficulty === difficulty
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getDifficultyBadgeColor(difficulty)}`}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} ({allScores[difficulty]?.length || 0})
              </span>
            </button>
          ))}
        </div>

        {/* Scores List */}
        <div className="space-y-3">
          {currentScores.length > 0 ? (
            <>
              <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-600 pb-2 border-b">
                <div className="col-span-3">Player</div>
                <div className="col-span-2">Score</div>
                <div className="col-span-2">%</div>
                <div className="col-span-2">Time</div>
                <div className="col-span-3">Date</div>
              </div>
              
              {currentScores.map((score, index) => (
                <div
                  key={`${score.id}-${index}`}
                  className="grid grid-cols-12 gap-2 p-3 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors duration-200"
                >
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
                  
                  <div className="col-span-3 text-gray-500 text-sm">
                    {formatDate(score.date)}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                No attempts yet for {selectedDifficulty} difficulty
              </h3>
              <p className="text-gray-500">
                Quiz attempts will appear here as people take the quiz.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-6">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            
            <span className="px-4 py-2 text-sm text-gray-600">
              Page {currentPage} of {totalPages} ({totalScores} total attempts)
            </span>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}

        {/* Close Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-magenta-500 text-white rounded-xl font-semibold hover:bg-magenta-600 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllScores;
