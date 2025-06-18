
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Question7({ onAnswer }) {
  const [userCubes, setUserCubes] = useState([]);
  const [hasAnswered, setHasAnswered] = useState(false);

  // צורת המטרה: 3 קוביות בשורה + 1 קוביה על האמצעית
  const targetPattern = [
    { id: 't1', x: 0, y: 1 }, // שמאל תחתון
    { id: 't2', x: 1, y: 1 }, // אמצע תחתון
    { id: 't3', x: 2, y: 1 }, // ימין תחתון  
    { id: 't4', x: 1, y: 0 }  // אמצע עליון
  ];

  const handleCubeClick = (position) => {
    if (hasAnswered) return; // אין אפשרות לשנות אחרי שענו
    
    const isOccupied = userCubes.some(cube => cube.x === position.x && cube.y === position.y);
    
    if (isOccupied) {
      // הסר קוביה מהמיקום
      setUserCubes(prev => prev.filter(cube => !(cube.x === position.x && cube.y === position.y)));
    } else {
      // הוסף קוביה למיקום (ללא הגבלה על כמות)
      const newCube = {
        id: Date.now() + Math.random(), // מזהה ייחודי
        x: position.x,
        y: position.y
      };
      setUserCubes(prev => [...prev, newCube]);
    }
  };

  const handleFinishBuilding = () => {
    // חישוב ניקוד על סמך התאמה לדפוס המטרה
    const isCorrect = targetPattern.every(target => 
      userCubes.some(cube => cube.x === target.x && cube.y === target.y)
    ) && userCubes.length === targetPattern.length;
    
    setHasAnswered(true);
    onAnswer(isCorrect ? 'correct_pattern' : 'incorrect_pattern', isCorrect ? 1 : 0, 1);
  };

  // הקראת השאלה מוסרה לדף הראשי
  // React.useEffect(() => {
  //   const utterance = new SpeechSynthesisUtterance('בנו את אותה צורה כמו במודל. לחצו על המשבצות כדי להוסיף או להסיר קוביות.');
  //   utterance.lang = 'he-IL';
  //   speechSynthesis.speak(utterance);
  // }, []);

  const renderGrid = (cubes, title, isTarget = false) => (
    <Card className="child-friendly border-2 border-indigo-200 p-4">
      <CardContent>
        <h3 className="text-xl font-semibold text-center mb-4">{title}</h3>
        <div className="grid grid-cols-3 gap-1 w-48 h-32 mx-auto">
          {Array.from({ length: 6 }, (_, index) => {
            const x = index % 3;
            const y = Math.floor(index / 3);
            const hasCube = cubes.some(cube => cube.x === x && cube.y === y);
            
            return (
              <div
                key={`${x}-${y}`}
                className={`border-2 border-gray-300 flex items-center justify-center transition-all duration-200 ${
                  hasCube ? 'bg-blue-500' : 'bg-gray-100'
                } ${!isTarget && !hasAnswered ? 'hover:bg-blue-200 cursor-pointer' : ''}`}
                onClick={!isTarget ? () => handleCubeClick({ x, y }) : undefined}
              >
                {hasCube && (
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-blue-800 rounded border border-blue-900 shadow-md"></div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="text-center space-y-8">
      <div className="text-3xl font-bold text-indigo-700 mb-6">
        בנו את אותה צורה
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {renderGrid(targetPattern, 'המטרה', true)}
        {renderGrid(userCubes, 'הבנייה שלכם')}
      </div>
      
      {!hasAnswered && (
        <Button
          onClick={handleFinishBuilding}
          className="text-lg px-8 py-4 child-friendly bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          סיימתי לבנות
        </Button>
      )}
      
      {hasAnswered && (
        <p className="text-green-600 font-semibold text-xl">
          כל הכבוד! סיימת לבנות.
        </p>
      )}
    </div>
  );
}
