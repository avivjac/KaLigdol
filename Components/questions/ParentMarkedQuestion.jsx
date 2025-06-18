import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function ParentMarkedQuestion({ questionText, onAnswer, questionId, maxPoints = 1 }) {
  const [answerMarked, setAnswerMarked] = useState(null);

  const handleMark = (isCorrect) => {
    setAnswerMarked(isCorrect);
    onAnswer(isCorrect ? 'נכון' : 'לא נכון', isCorrect ? maxPoints : 0, maxPoints);
  };

  React.useEffect(() => {
    const utterance = new SpeechSynthesisUtterance(questionText);
    utterance.lang = 'he-IL';
    speechSynthesis.speak(utterance);
  }, [questionText]);

  return (
    <div className="text-center space-y-8">
      <div className="text-3xl font-bold text-teal-700 mb-8">
        {questionText}
      </div>
      
      <div className="text-xl font-medium text-gray-700 mb-2">סמנו את תשובת הילד (הורה):</div>
      <div className="flex justify-center gap-6">
        <Button
          variant={answerMarked === true ? "default" : "outline"}
          className={`text-2xl px-8 py-5 child-friendly border-2 ${
            answerMarked === true 
              ? 'bg-teal-500 text-white border-teal-500' 
              : 'border-teal-300 hover:bg-teal-50'
          }`}
          onClick={() => handleMark(true)}
        >
          נכון
        </Button>
        <Button
          variant={answerMarked === false ? "default" : "outline"}
          className={`text-2xl px-8 py-5 child-friendly border-2 ${
            answerMarked === false 
              ? 'bg-red-500 text-white border-red-500' 
              : 'border-red-300 hover:bg-red-50'
          }`}
          onClick={() => handleMark(false)}
        >
          לא נכון
        </Button>
      </div>
    </div>
  );
}