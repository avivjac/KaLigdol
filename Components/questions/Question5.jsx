
import React, { useState } from 'react';

export default function Question5({ onAnswer }) {
  const [selectedStickId, setSelectedStickId] = useState(null);
  
  // פסים באורכים קבועים ללא ערבוב
  const sticks = [
    { id: 's1', length: 80, isLongest: false, color: '#3B82F6' },
    { id: 's2', length: 120, isLongest: false, color: '#EF4444' },
    { id: 's3', length: 160, isLongest: true, color: '#10B981' }, // הארוך ביותר
    { id: 's4', length: 100, isLongest: false, color: '#F59E0B' }
  ];

  const handleStickSelect = (stick) => {
    setSelectedStickId(stick.id);
    onAnswer(stick.id, stick.isLongest ? 1 : 0, 1);
  };

  // הקראת השאלה מוסרה לדף הראשי
  // React.useEffect(() => {
  //   const utterance = new SpeechSynthesisUtterance('לחצו על הפס הארוך ביותר.');
  //   utterance.lang = 'he-IL';
  //   speechSynthesis.speak(utterance);
  // }, []);

  return (
    <div className="text-center space-y-8">
      <div className="text-3xl font-bold text-orange-700 mb-12">
        לחצו על הפס הארוך ביותר
      </div>
      
      <div className="flex justify-center items-end gap-x-8 h-48">
        {sticks.map((stick) => (
          <div
            key={stick.id}
            className={`cursor-pointer transition-all duration-200 rounded-lg border-2 ${
              selectedStickId === stick.id ? 'border-black scale-110 shadow-lg' : 'border-gray-300'
            }`}
            style={{ 
              height: `${stick.length}px`, 
              width: '24px',
              backgroundColor: selectedStickId === stick.id ? stick.color : stick.color + '80'
            }}
            onClick={() => handleStickSelect(stick)}
          >
          </div>
        ))}
      </div>
    </div>
  );
}
