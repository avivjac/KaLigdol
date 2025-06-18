import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function Question1({ onAnswer }) {
  const [selectedAnswer, setSelectedAnswer] = useState('');

  const options = [
    { id: 'water', text: 'מים', image: '💧', correct: false }, // שונה ל"מים", התשובה כבר לא נכונה
    { id: 'cup', text: 'כוס', image: '🥤', correct: false },
    { id: 'plate', text: 'צלחת', image: '🍽️', correct: false },
    { id: 'bread', text: 'לחם', image: '🍞', correct: true }  // לחם הוא התשובה הנכונה
  ];

  const handleAnswerSelect = (answerId) => {
    setSelectedAnswer(answerId);
    const option = options.find(opt => opt.id === answerId);
    onAnswer(answerId, option.correct ? 1 : 0, 1);
  };

  return (
    <div className="text-center space-y-8">
      <div className="text-3xl font-bold text-purple-700 mb-8">
        תראה את הלחם
      </div>

      <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
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