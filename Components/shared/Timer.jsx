import React, { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';

export default function Timer({ onTimeUpdate, isActive = true, shouldStop = false }) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive && !shouldStop) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => {
          const newTime = prev + 1;
          if (onTimeUpdate) {
            onTimeUpdate(newTime);
          }
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, shouldStop, onTimeUpdate]);
  
  useEffect(() => {
    setElapsedTime(0); 
    if (onTimeUpdate) {
      onTimeUpdate(0);
    }
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-center gap-3 bg-white child-friendly px-6 py-4 border-2 border-blue-200 shadow-md">
      <Clock className="w-8 h-8 text-blue-500" />
      <span className="text-3xl font-bold text-blue-600 tracking-wider">
        {formatTime(elapsedTime)}
      </span>
      {shouldStop && (
        <span className="text-sm text-gray-500 ml-2">(עצור)</span>
      )}
    </div>
  );
}