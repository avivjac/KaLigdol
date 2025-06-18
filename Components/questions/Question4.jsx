import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function Question4({ onAnswer }) {
  const [selectedAnswer, setSelectedAnswer] = useState('');
  
  const options = [
    { 
      id: 'leg', 
      text: 'רגל', 
      imageSrc: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c17484_.jpg', 
      correct: true 
    },
    { 
      id: 'head', 
      text: 'ראש', 
      imageSrc: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/59f218962_.jpg', 
      correct: false 
    },
    { 
      id: 'arm', 
      text: 'יד', 
      imageSrc: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/cfd3cd038_.jpg', 
      correct: false 
    },
    { 
      id: 'body', 
      text: 'גוף', 
      imageSrc: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/499e1c7c5_.jpg', 
      correct: false 
    }
  ];

  const handleAnswerSelect = (answerId) => {
    setSelectedAnswer(answerId);
    const option = options.find(opt => opt.id === answerId);
    onAnswer(answerId, option.correct ? 1 : 0, 1);
  };

  return (
    <div className="text-center space-y-8">
      <div className="text-3xl font-bold text-pink-700 mb-6">
        מה חסר לדובי שבתמונה?
      </div>
      
      {/* התמונה של הדובי עם החלק החסר */}
      <div className="mb-6 flex justify-center">
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/2979ea5a2_WhatsAppImage2025-06-05at162656_9f0a95b0.jpg" 
          alt="דובי חסר רגל" 
          className="w-64 h-64 object-contain rounded-lg shadow-lg"
        />
      </div>
      
      <div className="text-xl font-medium text-gray-700 mb-2">בחרו את החלק החסר:</div>
      <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto">
        {options.map((option) => (
          <Card
            key={option.id}
            className={`child-friendly cursor-pointer transition-all duration-300 border-4 ${
              selectedAnswer === option.id 
                ? 'border-pink-500 bg-pink-50 scale-105' 
                : 'border-gray-200 hover:border-pink-300 hover:scale-105'
            }`}
            onClick={() => handleAnswerSelect(option.id)}
          >
            <CardContent className="p-4 text-center"> {/* Adjusted padding for images */}
              <img 
                src={option.imageSrc} 
                alt={option.text} 
                className="w-24 h-24 object-contain mx-auto mb-2" // Image styling
              />
              <div className="text-lg font-semibold text-gray-800">{option.text}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}