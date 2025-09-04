// localStorage utility functions for QuizWhiz
import scoresData from '../data/scores.json';

const STORAGE_KEYS = {
  HIGH_SCORES: 'quizwhiz_high_scores',
  USER_PREFERENCES: 'quizwhiz_preferences',
  PLAYER_NAME: 'quizwhiz_player_name',
  ALL_SCORES: 'quizwhiz_all_scores'
};

// High Scores Management
export const getHighScores = () => {
  try {
    // For development: use localStorage
    const scores = localStorage.getItem(STORAGE_KEYS.HIGH_SCORES);
    if (scores) {
      return JSON.parse(scores);
    }
    
    // Fallback to initial data
    return scoresData || { easy: [], medium: [], hard: [] };
  } catch (error) {
    console.error('Error reading high scores:', error);
    return { easy: [], medium: [], hard: [] };
  }
};

// Get all scores (for displaying complete history)
export const getAllScores = () => {
  try {
    const scores = localStorage.getItem(STORAGE_KEYS.ALL_SCORES);
    return scores ? JSON.parse(scores) : { easy: [], medium: [], hard: [] };
  } catch (error) {
    console.error('Error reading all scores:', error);
    return { easy: [], medium: [], hard: [] };
  }
};

// Save score to both high scores and all scores
export const saveScore = (difficulty, score, totalQuestions, timeElapsed, playerName = 'Anonymous') => {
  try {
    const percentage = Math.round((score / totalQuestions) * 100);
    
    const newScore = {
      score,
      totalQuestions,
      percentage,
      timeElapsed,
      playerName: playerName.trim() || 'Anonymous',
      date: new Date().toISOString(),
      id: Date.now() + Math.random() // Ensure unique IDs
    };

    // Save to all scores (complete history)
    const allScores = getAllScores();
    if (!allScores[difficulty]) {
      allScores[difficulty] = [];
    }
    
    // Check for duplicate scores (prevent saving the same score multiple times)
    const isDuplicate = allScores[difficulty].some(existingScore => 
      existingScore.score === newScore.score &&
      existingScore.totalQuestions === newScore.totalQuestions &&
      existingScore.playerName === newScore.playerName &&
      existingScore.timeElapsed === newScore.timeElapsed &&
      Math.abs(new Date(existingScore.date).getTime() - new Date(newScore.date).getTime()) < 5000 // Within 5 seconds
    );
    
    if (!isDuplicate) {
      allScores[difficulty].unshift(newScore); // Add to beginning
      localStorage.setItem(STORAGE_KEYS.ALL_SCORES, JSON.stringify(allScores));
    }

    // Save to high scores (top 10 only)
    const highScores = getHighScores();
    if (!highScores[difficulty]) {
      highScores[difficulty] = [];
    }

    // Check for duplicate in high scores as well
    const isHighScoreDuplicate = highScores[difficulty].some(existingScore => 
      existingScore.score === newScore.score &&
      existingScore.totalQuestions === newScore.totalQuestions &&
      existingScore.playerName === newScore.playerName &&
      existingScore.timeElapsed === newScore.timeElapsed &&
      Math.abs(new Date(existingScore.date).getTime() - new Date(newScore.date).getTime()) < 5000
    );

    if (!isHighScoreDuplicate) {
      highScores[difficulty].push(newScore);
      
      // Sort by percentage (descending), then by time (ascending for same percentage)
      highScores[difficulty].sort((a, b) => {
        if (b.percentage !== a.percentage) {
          return b.percentage - a.percentage;
        }
        return a.timeElapsed - b.timeElapsed;
      });

      // Keep only top 10 scores per difficulty
      highScores[difficulty] = highScores[difficulty].slice(0, 10);
      localStorage.setItem(STORAGE_KEYS.HIGH_SCORES, JSON.stringify(highScores));
    }

    return newScore;
  } catch (error) {
    console.error('Error saving score:', error);
    return null;
  }
};

// Legacy function for backward compatibility
export const saveHighScore = (difficulty, score, totalQuestions, timeElapsed, playerName = 'Anonymous') => {
  return saveScore(difficulty, score, totalQuestions, timeElapsed, playerName);
};

export const isNewHighScore = (difficulty, score, totalQuestions) => {
  const highScores = getHighScores();
  const percentage = Math.round((score / totalQuestions) * 100);
  
  if (!highScores[difficulty] || highScores[difficulty].length < 10) {
    return true;
  }

  const lowestHighScore = highScores[difficulty][highScores[difficulty].length - 1];
  return percentage > lowestHighScore.percentage;
};

// User Preferences
export const getUserPreferences = () => {
  try {
    const prefs = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    return prefs ? JSON.parse(prefs) : {
      lastDifficulty: 'easy',
      soundEnabled: true,
      animationsEnabled: true
    };
  } catch (error) {
    console.error('Error reading user preferences:', error);
    return { lastDifficulty: 'easy', soundEnabled: true, animationsEnabled: true };
  }
};

export const saveUserPreferences = (preferences) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving user preferences:', error);
  }
};

// Player Name Management
export const getPlayerName = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.PLAYER_NAME) || '';
  } catch (error) {
    console.error('Error reading player name:', error);
    return '';
  }
};

export const savePlayerName = (name) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PLAYER_NAME, name.trim());
  } catch (error) {
    console.error('Error saving player name:', error);
  }
};

// Export/Import functions for data backup
export const exportHighScores = () => {
  const highScores = getHighScores();
  const dataStr = JSON.stringify(highScores, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `quizwhiz-scores-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
};

export const importHighScores = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedScores = JSON.parse(e.target.result);
        localStorage.setItem(STORAGE_KEYS.HIGH_SCORES, JSON.stringify(importedScores));
        resolve(importedScores);
      } catch (error) {
        reject(new Error('Invalid file format'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

// Check if localStorage is available and working
export const isStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    console.warn('localStorage is not available:', error);
    return false;
  }
};

// Clean up duplicate scores (call this once to fix existing data)
export const cleanupDuplicateScores = () => {
  try {
    // Clean high scores
    const highScores = getHighScores();
    Object.keys(highScores).forEach(difficulty => {
      if (highScores[difficulty] && Array.isArray(highScores[difficulty])) {
        // Remove duplicates based on score, playerName, and time
        const seen = new Set();
        highScores[difficulty] = highScores[difficulty].filter(score => {
          const key = `${score.score}-${score.totalQuestions}-${score.playerName}-${score.timeElapsed}`;
          if (seen.has(key)) {
            return false; // Remove duplicate
          }
          seen.add(key);
          return true; // Keep unique
        });
      }
    });
    localStorage.setItem(STORAGE_KEYS.HIGH_SCORES, JSON.stringify(highScores));

    // Clean all scores
    const allScores = getAllScores();
    Object.keys(allScores).forEach(difficulty => {
      if (allScores[difficulty] && Array.isArray(allScores[difficulty])) {
        const seen = new Set();
        allScores[difficulty] = allScores[difficulty].filter(score => {
          const key = `${score.score}-${score.totalQuestions}-${score.playerName}-${score.timeElapsed}`;
          if (seen.has(key)) {
            return false;
          }
          seen.add(key);
          return true;
        });
      }
    });
    localStorage.setItem(STORAGE_KEYS.ALL_SCORES, JSON.stringify(allScores));

    console.log('Duplicate scores cleaned up successfully');
  } catch (error) {
    console.error('Error cleaning up duplicates:', error);
  }
};

// Utility functions
export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'easy': return 'text-green-600';
    case 'medium': return 'text-yellow-600';
    case 'hard': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

export const getDifficultyBadgeColor = (difficulty) => {
  switch (difficulty) {
    case 'easy': return 'bg-green-100 text-green-700 border-green-200';
    case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'hard': return 'bg-red-100 text-red-700 border-red-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};
