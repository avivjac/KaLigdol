import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import CharacterGuide from '../components/shared/CharacterGuide';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// Import all question components
import Question1 from '../components/questions/Question1';
import Question2 from '../components/questions/Question2';
import Question4 from '../components/questions/Question4';
import Question5 from '../components/questions/Question5';
import Question6 from '../components/questions/Question6';
import Question7 from '../components/questions/Question7';
import Question8 from '../components/questions/Question8';

export default function TestQuestion() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [questionAnswered, setQuestionAnswered] = useState(false);
  const [currentElapsedTime, setCurrentElapsedTime] = useState(0);
  const intervalRef = useRef(null);

  const childLastName = localStorage.getItem('currentChildLastName') || "";

  const questionsConfig = [
    { id: 1, component: Question1, maxPoints: 1, questionText: "תראה את הלחם" },
    { id: 2, component: Question2, maxPoints: 1, questionText: "בחר בחיה שעושה \"מוווו\"" },
    { id: 4, component: Question4, maxPoints: 1, questionText: "מה חסר לדובי שבתמונה? לחצו על החלק החסר." },
    { id: 5, component: Question5, maxPoints: 1, questionText: "לחצו על הפס הארוך ביותר." },
    { id: 6, component: Question6, maxPoints: 1, questionText: "השלם את המשבצת הריקה" },
    { id: 7, component: Question7, maxPoints: 1, questionText: "בנו את אותה צורה כמו במודל. לחצו על המשבצות כדי להוסיף או להסיר קוביות." },
    { id: 8, component: Question8, maxPoints: 1, questionText: "כמה אוזניים יש לך?" }
  ];

  const totalQuestions = questionsConfig.length;
  const currentQuestionConfig = questionsConfig[currentQuestionIndex];

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const questionParam = parseInt(urlParams.get('question')) || 1;
    const questionIndex = questionsConfig.findIndex(q => q.id === questionParam);

    setCurrentQuestionIndex(questionIndex >= 0 ? questionIndex : 0);
    setQuestionAnswered(false);
    
    // Reset and start timer for new question (background only)
    setCurrentElapsedTime(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setCurrentElapsedTime(prev => prev + 1);
    }, 1000);

    const savedAnswers = localStorage.getItem('testAnswers');
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }

    // Cleanup interval on unmount or question change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [location.search]);

  // Effect to stop timer when question is answered
  useEffect(() => {
    if (questionAnswered && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [questionAnswered]);

  const handleAnswer = useCallback((answerPayload, scoreFromComponent, maxPointsFromComponent) => {
    console.log('handleAnswer called with:', answerPayload, scoreFromComponent, maxPointsFromComponent, 'time:', currentElapsedTime);
    
    let finalScore = 0;
    let finalMaxPoints = currentQuestionConfig.maxPoints;

    if (scoreFromComponent !== undefined) {
        finalScore = Number(scoreFromComponent);
    }
    if (maxPointsFromComponent !== undefined) {
        finalMaxPoints = Number(maxPointsFromComponent);
    }

    // Apply 30-second time limit penalty
    const timeTaken = currentElapsedTime;
    if (timeTaken > 30) {
        console.log(`Time penalty applied: Time taken ${timeTaken}s > 30s limit. Score set to 0.`);
        finalScore = 0;
    }
    
    const newAnswer = {
      question_id: currentQuestionConfig.id,
      answer: String(answerPayload),
      score: finalScore,
      time_taken: timeTaken
    };

    const updatedAnswers = [...answers.filter(a => a.question_id !== currentQuestionConfig.id), newAnswer];
    setAnswers(updatedAnswers);
    
    console.log('Setting questionAnswered to true after handling answer.');
    setQuestionAnswered(true);
    
    localStorage.setItem('testAnswers', JSON.stringify(updatedAnswers));
  }, [answers, currentElapsedTime, currentQuestionConfig]);

  const navigateToQuestion = (index) => {
    if (index >= 0 && index < totalQuestions) {
      navigate(createPageUrl(`TestQuestion?question=${questionsConfig[index].id}`));
    } else if (index >= totalQuestions) {
      navigate(createPageUrl('Results'));
    }
  };

  const handleNext = () => {
    console.log('handleNext called, questionAnswered:', questionAnswered);
    if (questionAnswered) {
       navigateToQuestion(currentQuestionIndex + 1);
    } else {
      console.log('Cannot proceed - question not answered yet');
    }
  };

  const handlePrevious = () => {
    navigateToQuestion(currentQuestionIndex - 1);
  };

  const CurrentQuestionComponent = currentQuestionConfig?.component;
  const currentQuestionProps = currentQuestionConfig?.props || {};
  const currentQuestionId = currentQuestionConfig?.id;

  const getCharacterMessage = () => {
    if (questionAnswered) return "כל הכבוד! התשובה נשמרה.";
    if (currentQuestionIndex === 0) return "בואו נתחיל עם השאלה הראשונה!";
    return "עוד שאלה נחמדה בשבילכם!";
  };

  if (!CurrentQuestionComponent) {
    return <div className="text-center text-xl p-10">טוען שאלה...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <CharacterGuide message={getCharacterMessage()} />

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">
            שאלה {currentQuestionIndex + 1} מתוך {totalQuestions}
          </h1>
          <div className="text-lg text-gray-600">
            בדיקת התפתחות ילדים
          </div>
        </div>

        <div className="bg-gray-200 rounded-full h-3 overflow-hidden child-friendly">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <Card className="child-friendly border-2 border-purple-200 bg-white/90 mb-8 min-h-[350px] flex items-center justify-center">
        <CardContent className="p-6 md:p-8 w-full">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-purple-700">
              {currentQuestionConfig.questionText}
            </h2>
          </div>
          <CurrentQuestionComponent
            onAnswer={handleAnswer}
            questionId={currentQuestionId}
            childLastName={childLastName}
            {...currentQuestionProps}
          />
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <Button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          variant="outline"
          className="child-friendly border-2 border-gray-300 text-lg px-6 py-3"
        >
          <ArrowRight className="w-5 h-5 ml-2" />
          הקודם
        </Button>

        <div className="flex space-x-2 rtl:space-x-reverse">
          {questionsConfig.map((q, i) => (
            <div
              key={q.id}
              className={`w-3 h-3 rounded-full transition-colors ${
                i === currentQuestionIndex
                  ? 'bg-purple-500 scale-125'
                  : answers.find(a => a.question_id === q.id)
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          disabled={!questionAnswered}
          className={`child-friendly text-lg px-6 py-3 ${
            questionAnswered
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {currentQuestionIndex >= totalQuestions - 1 ? 'סיום הבדיקה' : 'הבא'}
          <ArrowLeft className="w-5 h-5 mr-2" />
        </Button>
      </div>

      {/* Debug info - remove in production */}
      <div className="mt-4 text-sm text-gray-500 text-center">
        Debug: questionAnswered = {questionAnswered ? 'true' : 'false'}
      </div>
    </div>
  );
}