import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function Question6({ onAnswer }) {
  const [selectedAnswer, setSelectedAnswer] = useState('');
  
  const matrixItems = [
    { position: 'top-left', emoji: '🏀', label: 'כדורסל' },
    { position: 'top-right', emoji: '🏀', label: 'כדורסל' },
    { position: 'bottom-left', emoji: '🏀', label: 'כדורסל' },
    { position: 'bottom-right', emoji: '', label: '' } 
  ];
  
  const options = [
    { id: 'soccer', text: 'כדורגל', emoji: '⚽', correct: false },
    { id: 'basketball', text: 'כדורסל', emoji: '🏀', correct: true },
    { id: 'baseball', text: 'בייסבול', emoji: '⚾', correct: false },
    { id: 'volleyball', text: 'כדורעף', emoji: '🏐', correct: false }
  ];

  const handleAnswerSelect = (answerId) => {
    setSelectedAnswer(answerId);
    const option = options.find(opt => opt.id === answerId);
    onAnswer(answerId, option.correct ? 1 : 0, 1);
  };
  
  return (
    <div className="text-center space-y-8">
      <div className="text-3xl font-bold text-purple-700 mb-6">
        השלם את המשבצת הריקה
      </div>
      
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
        {matrixItems.map((item) => (
          <Card 
            key={item.position} 
            className={`child-friendly border-2 border-purple-200 h-24 flex items-center justify-center ${
              item.position === 'bottom-right' ? 'bg-gray-100 border-dashed' : ''
            }`}
          >
            <div className="text-4xl">{item.emoji}</div>
          </Card>
        ))}
      </div>
      
      <div className="text-xl font-medium text-gray-700 mb-4">בחרו את התשובה הנכונה:</div>
      <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
        {options.map((option) => (
          <Card
            key={option.id}
            className={`child-friendly cursor-pointer transition-all duration-300 border-4 ${
              selectedAnswer === option.id 
                ? 'border-purple-500 bg-purple-50 scale-105' 
                : 'border-gray-200 hover:border-purple-300 hover:scale-105'
            }`}
            onClick={() => handleAnswerSelect(option.id)}
          >
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-2">{option.emoji}</div>
              <div className="text-lg font-semibold text-gray-800">{option.text}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}