import React, { useState, useEffect } from 'react';

const Timer = ({ duration = 30, onTimeUp, isActive = true, onTick }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!isActive) return;

    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (onTick) onTick(newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isActive, onTimeUp, onTick]);

  const getColorClass = () => {
    const percentage = (timeLeft / duration) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = () => {
    const percentage = (timeLeft / duration) * 100;
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const percentage = (timeLeft / duration) * 100;

  return (
    <div className="flex items-center space-x-4">
      {/* Circular Progress */}
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-gray-200"
          />
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            className={getProgressColor()}
            strokeDasharray={`${percentage * 1.76} 176`}
            style={{
              transition: 'stroke-dasharray 1s ease-in-out',
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xl font-bold ${getColorClass()}`}>
            {timeLeft}
          </span>
        </div>
      </div>

      {/* Linear Progress Bar */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-600">Time Remaining</span>
          <span className={`text-sm font-bold ${getColorClass()}`}>
            {timeLeft}s
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ease-linear ${getProgressColor()}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Timer;
