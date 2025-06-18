import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Question2({ onAnswer }) {
  const [selectedAnswer, setSelectedAnswer] = useState('');
  
  const options = [
    { id: 'cow', text: 'פרה', image: '🐄', correct: true },
    { id: 'cat', text: 'חתול', image: '🐱', correct: false },
    { id: 'dog', text: 'כלב', image: '🐕', correct: false },
    { id: 'bird', text: 'ציפור', image: '🐦', correct: false }
  ];

  const handleAnswerSelect = (answerId) => {
    setSelectedAnswer(answerId);
    const option = options.find(opt => opt.id === answerId);
    onAnswer(answerId, option.correct ? 1 : 0, 1);
  };

  return (
    <div className="text-center space-y-8">
      <div className="text-3xl font-bold text-green-700 mb-8">
        בחר בחיה שעושה "מוווו"
      </div>
      
      <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
        {options.map((option) => (
          <Card
            key={option.id}
            className={`child-friendly cursor-pointer transition-all duration-300 border-4 ${
              selectedAnswer === option.id 
                ? 'border-green-500 bg-green-50 scale-105' 
                : 'border-gray-200 hover:border-green-300 hover:scale-105'
            }`}
            onClick={() => handleAnswerSelect(option.id)}
          >
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">{option.image}</div>
              <div className="text-2xl font-semibold text-gray-800">{option.text}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}