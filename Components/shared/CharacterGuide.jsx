import React from 'react';

export default function CharacterGuide({ message, position = "top-right" }) {
  const positions = {
    "top-right": "fixed top-6 right-6 z-50",
    "center": "mx-auto",
    "floating": "fixed bottom-6 right-6 z-50"
  };

  return (
    <div className={`${positions[position]} bounce-in`}>
      <div className="relative">
        <div className="bg-white child-friendly px-6 py-4 max-w-xs shadow-lg border-2 border-purple-200">
          <div className="text-purple-700 text-lg font-medium text-center">
            {message}
          </div>
          <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-r-2 border-b-2 border-purple-200 transform rotate-45"></div>
        </div>
        <div className="mt-2 text-center">
          <div className="text-6xl floating">🦊</div>
        </div>
      </div>
    </div>
  );
}