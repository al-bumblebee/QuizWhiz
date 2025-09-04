import React, { useEffect, useState } from 'react';
import { saveScore, isNewHighScore, formatTime } from '../utils/storage';

const Results = ({ questions, answers, onRestart, difficulty, totalTime, playerName }) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [isHighScore, setIsHighScore] = useState(false);
  const [scoreAnimationComplete, setScoreAnimationComplete] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false); // Prevent duplicate saves

  // Calculate score
  const score = answers.reduce((total, answer, index) => {
    return total + (answer === questions[index].correctIndex ? 1 : 0);
  }, 0);

  const percentage = Math.round((score / questions.length) * 100);

  // Determine performance message
  const getPerformanceMessage = () => {
    if (percentage >= 90) return { message: "Outstanding! 🎉", color: "text-green-600", emoji: "🏆" };
    if (percentage >= 70) return { message: "Great job! 👏", color: "text-blue-600", emoji: "🎯" };
    if (percentage >= 50) return { message: "Good effort! 👍", color: "text-yellow-600", emoji: "👍" };
    return { message: "Keep practicing! 💪", color: "text-red-600", emoji: "💪" };
  };

  const performance = getPerformanceMessage();

  // Check and save high score
  useEffect(() => {
    if (scoreSaved) return; // Prevent duplicate saves

    const checkAndSaveScore = async () => {
      // Always save the score to complete history
      saveScore(difficulty, score, questions.length, totalTime, playerName);
      setScoreSaved(true); // Mark as saved
      
      // Check if it's a high score for celebration (optional)
      if (isNewHighScore(difficulty, score, questions.length)) {
        setIsHighScore(true);
        setShowCelebration(true);
        
        // Stop celebration after 3 seconds
        setTimeout(() => setShowCelebration(false), 3000);
      }
    };

    // Delay to allow score animation
    const timeoutId = setTimeout(() => {
      setScoreAnimationComplete(true);
      checkAndSaveScore();
    }, 1000);

    // Cleanup timeout if component unmounts
    return () => clearTimeout(timeoutId);
  }, [difficulty, score, questions.length, totalTime, playerName, scoreSaved]);

  // Confetti effect
  const createConfetti = () => {
    const confettiColors = ['#d946ef', '#f97316', '#10b981', '#3b82f6', '#ef4444'];
    return Array.from({ length: 50 }, (_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 animate-confetti"
        style={{
          backgroundColor: confettiColors[i % confettiColors.length],
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`,
          animationDuration: `${2 + Math.random() * 2}s`
        }}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Confetti */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-10">
          {createConfetti()}
        </div>
      )}

      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8 animate-scaleIn">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 animate-slideInLeft">
            Quiz Complete{playerName && playerName !== 'Anonymous' ? `, ${playerName}!` : '!'}
          </h1>

          <div className="mb-6">
            <div className={`text-6xl md:text-7xl font-bold text-magenta-600 mb-2 ${scoreAnimationComplete ? 'score-counter' : 'animate-pulse'}`}>
              {score}/{questions.length}
            </div>
            <div className="text-2xl md:text-3xl font-semibold text-gray-600 mb-2 animate-slideInRight">
              {percentage}% Score
            </div>
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="text-lg text-gray-600">
                <span className="font-medium">Time:</span> {formatTime(totalTime)}
              </div>
              <div className="text-lg text-gray-600 capitalize">
                <span className="font-medium">Difficulty:</span> {difficulty}
              </div>
            </div>
            <div className={`text-xl md:text-2xl font-medium ${performance.color} animate-fadeIn`}>
              <span className="mr-2">{performance.emoji}</span>
              {performance.message}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200 animate-slideInLeft">
            <div className="text-2xl font-bold text-green-600">{score}</div>
            <div className="text-sm text-gray-600">Correct</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-xl border border-red-200 animate-slideInLeft" style={{ animationDelay: '0.1s' }}>
            <div className="text-2xl font-bold text-red-600">{questions.length - score}</div>
            <div className="text-sm text-gray-600">Incorrect</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200 animate-slideInLeft" style={{ animationDelay: '0.2s' }}>
            <div className="text-2xl font-bold text-blue-600">{percentage}%</div>
            <div className="text-sm text-gray-600">Accuracy</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200 animate-slideInLeft" style={{ animationDelay: '0.3s' }}>
            <div className="text-2xl font-bold text-purple-600">{formatTime(totalTime)}</div>
            <div className="text-sm text-gray-600">Total Time</div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center animate-slideInLeft">
            Question Review
          </h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {questions.map((question, index) => {
              const userAnswer = answers[index];
              const isCorrect = userAnswer === question.correctIndex;
              
              return (
                <div 
                  key={question.id}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 hover-lift animate-fadeIn ${
                    isCorrect 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-red-200 bg-red-50'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      Question {index + 1}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      isCorrect 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-800 mb-3">
                    {question.question}
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-600 w-20">
                        Your answer:
                      </span>
                      <span className={`font-medium ${
                        isCorrect ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {userAnswer !== undefined ? question.options[userAnswer] : 'No answer'}
                      </span>
                    </div>
                    
                    {!isCorrect && (
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-600 w-20">
                          Correct:
                        </span>
                        <span className="font-medium text-green-700">
                          {question.options[question.correctIndex]}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRestart}
            className="px-8 py-4 bg-magenta-500 text-white rounded-xl font-semibold text-lg hover:bg-magenta-600 transition-all duration-200 transform hover:scale-105 shadow-lg btn-press animate-pulse"
          >
            Take Quiz Again
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold text-lg hover:bg-gray-200 transition-all duration-200 transform hover:scale-105 shadow-md btn-press"
          >
            Choose New Difficulty
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
