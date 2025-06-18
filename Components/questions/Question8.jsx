
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function Question8({ onAnswer }) {
  const [selectedAnswer, setSelectedAnswer] = useState('');
  
  const options = [
    { id: 'one', text: '1', number: 1, correct: false },
    { id: 'two', text: '2', number: 2, correct: true },
    { id: 'three', text: '3', number: 3, correct: false },
    { id: 'four', text: '4', number: 4, correct: false }
  ];

  const handleAnswerSelect = (answerId) => {
    setSelectedAnswer(answerId);
    const option = options.find(opt => opt.id === answerId);
    onAnswer(answerId, option.correct ? 1 : 0, 1);
  };
  
  // הקראת השאלה מוסרה לדף הראשי
  // React.useEffect(() => {
  //   const utterance = new SpeechSynthesisUtterance('כמה אוזניים יש לך?');
  //   utterance.lang = 'he-IL';
  //   speechSynthesis.speak(utterance);
  // }, []);

  return (
    <div className="text-center space-y-8">
      <div className="text-3xl font-bold text-teal-700 mb-8">
        כמה אוזניים יש לך?
      </div>
      
      {/* הסרתי את ציור האוזניים */}
      
      <div className="text-xl font-medium text-gray-700 mb-4">בחרו את המספר הנכון:</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
        {options.map((option) => (
          <Card
            key={option.id}
            className={`child-friendly cursor-pointer transition-all duration-300 border-4 ${
              selectedAnswer === option.id 
                ? 'border-teal-500 bg-teal-50 scale-105' 
                : 'border-gray-200 hover:border-teal-300 hover:scale-105'
            }`}
            onClick={() => handleAnswerSelect(option.id)}
          >
            <CardContent className="p-8 text-center">
              <div className="text-6xl font-bold text-teal-600">{option.text}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
