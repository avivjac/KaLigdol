
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ParentScoredQuestion({ questionText, visual, scoringLogic, onAnswer, questionId, maxPoints = 2 }) { // הוספתי maxPoints
  const [childAnswer, setChildAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);

  const handleSubmitAnswer = () => {
    if (!childAnswer.trim()) return;

    let score = 0;
    if (scoringLogic) { // אם יש לוגיקת ניקוד מוגדרת
        score = scoringLogic(childAnswer);
    } else {
        // ברירת מחדל: אם ההורה רשם משהו, ניתן נקודה על השתתפות.
        // המערכת לא יכולה באמת לנקד תשובה פתוחה ללא לוגיקה מפורשת.
        // אפשר להשתמש ב-LLM כאן, אך זה מורכב יותר.
        // score = childAnswer.trim() ? 1 : 0; // לדוגמה, אם רק רוצים לבדוק אם הילד ענה משהו.
        // בשביל השאלות הספציפיות, ההיגיון יוגדר ב-TestQuestion.jsx
    }
    
    // onAnswer יופעל מהדף הראשי עם הניקוד הסופי שחושב שם
    // כאן רק נסמן שהתשובה נרשמה
    onAnswer(childAnswer, 0, maxPoints); // שולח את התשובה, הניקוד יחושב בדף הראשי
    setIsAnswered(true); 
  };
  
  React.useEffect(() => {
    const utterance = new SpeechSynthesisUtterance(questionText);
    utterance.lang = 'he-IL';
    speechSynthesis.speak(utterance);
  }, [questionText]);

  return (
    <div className="text-center space-y-6">
      <div className="text-3xl font-bold text-indigo-700 mb-6">
        {questionText}
      </div>
      
      {visual && <div className="text-6xl mb-6">{visual}</div>}
      
      <Card className="child-friendly border-2 border-indigo-200 bg-indigo-50/50 max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-xl text-indigo-600">תשובת הילד (לרישום ההורה):</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={childAnswer}
            onChange={(e) => setChildAnswer(e.target.value)}
            placeholder="כתבו כאן את תשובת הילד..."
            className="text-lg p-3 child-friendly border-2 border-indigo-300 min-h-[80px]"
            rows={3}
            disabled={isAnswered}
          />
        </CardContent>
      </Card>

      {!isAnswered && (
        <Button
          onClick={handleSubmitAnswer}
          disabled={!childAnswer.trim()}
          className="text-lg p-4 child-friendly bg-indigo-600 hover:bg-indigo-700 text-white mt-4"
        >
          אישור תשובה
        </Button>
      )}
      {isAnswered && <p className="text-green-600 font-semibold">התשובה נרשמה. המשיכו לשאלה הבאה.</p>}
       <p className="text-sm text-gray-500 mt-2">הניקוד יינתן אוטומטית על ידי המערכת.</p>
    </div>
  );
}
