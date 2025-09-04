import React, { useEffect, useState } from 'react';
import Timer from './Timer';

const Quiz = ({ 
  question, 
  currentIndex, 
  total, 
  selected, 
  onAnswer, 
  onNext, 
  difficulty,
  onTimeUp 
}) => {
  const [isAnswered, setIsAnswered] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  if (!question) return null;

  // Timer durations based on difficulty
  const getTimerDuration = () => {
    switch (difficulty) {
      case 'easy': return 45;
      case 'medium': return 30;
      case 'hard': return 20;
      default: return 30;
    }
  };

  // Reset state when question changes
  useEffect(() => {
    setIsAnswered(false);
    setShowFeedback(false);
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key;
      
      // Handle number keys for option selection (only if not answered yet)
      if (!isAnswered && key >= '1' && key <= '4') {
        const optionIndex = parseInt(key) - 1;
        if (optionIndex < question.options.length) {
          handleAnswer(optionIndex);
        }
      } 
      // Handle Enter key for proceeding (works after selection or after feedback)
      else if (key === 'Enter' && (selected != null || isAnswered)) {
        event.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [question, selected, onNext, isAnswered]);

  const handleAnswer = (optionIndex) => {
    if (isAnswered) return;
    
    onAnswer(optionIndex);
    setIsAnswered(true);
    
    // Show immediate feedback
    setTimeout(() => {
      setShowFeedback(true);
    }, 100);
  };

  const handleNext = () => {
    if (selected == null && !isAnswered) {
      // Shake animation for no selection
      const nextButton = document.querySelector('.next-button');
      if (nextButton) {
        nextButton.classList.add('animate-shake');
        setTimeout(() => nextButton.classList.remove('animate-shake'), 500);
      }
      return;
    }
    onNext();
  };

  const handleTimeUp = () => {
    if (!isAnswered) {
      setIsAnswered(true);
      onTimeUp();
    }
  };

  const getOptionStyle = (index) => {
    if (!showFeedback) {
      return selected === index
        ? 'border-magenta-500 bg-magenta-50 text-magenta-700 shadow-md animate-scaleIn'
        : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-magenta-300 hover:bg-magenta-25 hover-lift';
    }

    // Show feedback
    const isCorrect = index === question.correctIndex;
    const isSelected = index === selected;

    if (isCorrect) {
      return 'border-green-500 bg-green-100 text-green-800 option-correct';
    } else if (isSelected && !isCorrect) {
      return 'border-red-500 bg-red-100 text-red-800 option-incorrect';
    } else {
      return 'border-gray-200 bg-gray-100 text-gray-500 opacity-60';
    }
  };

  const getOptionIcon = (index) => {
    if (!showFeedback) {
      return selected === index
        ? 'border-magenta-500 bg-magenta-500 text-white'
        : 'border-gray-300 text-gray-500';
    }

    const isCorrect = index === question.correctIndex;
    const isSelected = index === selected;

    if (isCorrect) {
      return 'border-green-500 bg-green-500 text-white';
    } else if (isSelected && !isCorrect) {
      return 'border-red-500 bg-red-500 text-white';
    } else {
      return 'border-gray-300 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 question-enter">
        {/* Timer */}
        <div className="mb-6">
          <Timer
            duration={getTimerDuration()}
            onTimeUp={handleTimeUp}
            isActive={!isAnswered}
            onTick={setTimeLeft}
          />
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Question {currentIndex + 1} of {total}
            </span>
            <span className="text-sm font-medium text-magenta-600 capitalize">
              {difficulty} Level • {Math.round(((currentIndex + 1) / total) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-magenta-500 to-magenta-600 h-2 rounded-full progress-smooth"
              style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
              role="progressbar"
              aria-valuenow={currentIndex + 1}
              aria-valuemin={1}
              aria-valuemax={total}
              aria-label={`Question ${currentIndex + 1} of ${total}`}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 leading-relaxed question-text animate-slideInLeft">
            {question.question}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-4 mb-8" role="radiogroup" aria-labelledby="question-text">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={isAnswered}
              className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-magenta-500 focus:ring-offset-2 option-button btn-press ${getOptionStyle(index)} ${
                isAnswered ? 'cursor-not-allowed' : 'hover:scale-105 cursor-pointer'
              }`}
              role="radio"
              aria-checked={selected === index}
              aria-label={`Option ${String.fromCharCode(65 + index)}: ${option}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center">
                <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 text-sm font-semibold transition-all duration-200 ${getOptionIcon(index)}`}>
                  {showFeedback && index === question.correctIndex ? '✓' : 
                   showFeedback && index === selected && index !== question.correctIndex ? '✗' :
                   String.fromCharCode(65 + index)}
                </span>
                <span className="text-lg font-medium">{option}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Feedback Message */}
        {showFeedback && (
          <div className={`mb-4 p-4 rounded-xl text-center animate-scaleIn ${
            selected === question.correctIndex 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            <div className="text-2xl mb-2">
              {selected === question.correctIndex ? '🎉' : '😔'}
            </div>
            <p className="font-medium">
              {selected === question.correctIndex 
                ? 'Correct! Well done!' 
                : `Incorrect. The correct answer was: ${question.options[question.correctIndex]}`}
            </p>
          </div>
        )}

        {/* Keyboard Instructions */}
        <div className="mb-4 text-center text-sm text-gray-500 animate-fadeIn">
          {!isAnswered ? (
            <>Use keys 1-4 to select options • {timeLeft}s remaining</>
          ) : (
            <>Press Enter to continue to next question</>
          )}
        </div>

        {/* Next Button */}
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            disabled={!isAnswered && selected == null}
            className={`next-button px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-magenta-500 focus:ring-offset-2 btn-press ${
              isAnswered || selected != null
                ? 'bg-magenta-500 text-white hover:bg-magenta-600 shadow-lg hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            aria-label={currentIndex === total - 1 ? 'Finish quiz' : 'Go to next question'}
          >
            {currentIndex === total - 1 ? 'Finish Quiz' : 'Next Question'}
            {(isAnswered || selected != null) && (
              <span className="ml-2 text-sm opacity-75">(Press Enter)</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
