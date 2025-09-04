import React, { useState, useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import WelcomeScreen from "./components/WelcomeScreen";
import Quiz from "./components/Quiz";
import Results from "./components/Results";
import questionsData from "./data/questions.json";
import { getUserPreferences, saveUserPreferences, cleanupDuplicateScores } from "./utils/storage";

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]); // store selected option index per question
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');
  const [startTime, setStartTime] = useState(null);
  const [totalTime, setTotalTime] = useState(0);
  const [questionCounts, setQuestionCounts] = useState({ easy: 0, medium: 0, hard: 0 });
  const [playerName, setPlayerName] = useState('Anonymous');

  useEffect(() => {
    // Clean up any existing duplicate scores
    cleanupDuplicateScores();
    
    // Load user preferences
    const preferences = getUserPreferences();
    setDifficulty(preferences.lastDifficulty);

    // Count questions by difficulty
    const counts = {
      easy: questionsData.easy?.length || 0,
      medium: questionsData.medium?.length || 0,
      hard: questionsData.hard?.length || 0
    };
    setQuestionCounts(counts);
  }, []);

  const handleStart = (selectedDifficulty, name = 'Anonymous') => {
    // Save user preference
    const preferences = getUserPreferences();
    saveUserPreferences({ ...preferences, lastDifficulty: selectedDifficulty });

    // Load questions for selected difficulty
    const difficultyQuestions = questionsData[selectedDifficulty] || [];
    setQuestions(difficultyQuestions);
    setDifficulty(selectedDifficulty);
    setPlayerName(name);
    setQuizStarted(true);
    setStartTime(Date.now());
  };

  const handleAnswer = (optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (answers[currentIndex] == null) {
      // Show alert with animation
      const alertDiv = document.createElement('div');
      alertDiv.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-shake';
      alertDiv.textContent = 'Please select an answer before proceeding.';
      document.body.appendChild(alertDiv);
      
      setTimeout(() => {
        alertDiv.remove();
      }, 3000);
      return;
    }
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Quiz completed
      const endTime = Date.now();
      setTotalTime(Math.floor((endTime - startTime) / 1000));
      setShowResults(true);
    }
  };

  const handleTimeUp = () => {
    // Auto-proceed when time runs out without an answer
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const endTime = Date.now();
      setTotalTime(Math.floor((endTime - startTime) / 1000));
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setAnswers([]);
    setCurrentIndex(0);
    setShowResults(false);
    setQuizStarted(false);
    setStartTime(null);
    setTotalTime(0);
  };

  if (questions.length === 0 && quizStarted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-magenta-500 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white">
        {!quizStarted ? (
          <WelcomeScreen 
            onStart={handleStart} 
            questionCounts={questionCounts}
          />
        ) : !showResults ? (
          <Quiz
            question={questions[currentIndex]}
            currentIndex={currentIndex}
            total={questions.length}
            selected={answers[currentIndex]}
            onAnswer={handleAnswer}
            onNext={handleNext}
            difficulty={difficulty}
            onTimeUp={handleTimeUp}
          />
        ) : (
          <Results 
            questions={questions} 
            answers={answers} 
            onRestart={handleRestart}
            difficulty={difficulty}
            totalTime={totalTime}
            playerName={playerName}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;