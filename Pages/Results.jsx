
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Child, TestResult } from '@/entities/all';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CharacterGuide from '../components/shared/CharacterGuide';
import { Trophy, User, Calendar, Target, RefreshCw, Download, CheckCircle, AlertTriangle } from 'lucide-react'; // Removed Clock

export default function Results() {
  const navigate = useNavigate();
  const [child, setChild] = useState(null);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    loadResults();
  }, []);

  const calculateAge = (birthDateString) => {
    if (!birthDateString) return null;
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const loadResults = async () => {
    try {
      const childId = localStorage.getItem('currentChildId');
      const answersJson = localStorage.getItem('testAnswers');
      
      if (!childId || !answersJson) {
        navigate(createPageUrl('Welcome'));
        return;
      }

      const answers = JSON.parse(answersJson);
      const childData = await Child.get(childId);
      
      const totalScore = answers.reduce((sum, answer) => sum + (Number(answer.score) || 0), 0);
      const maxScore = 7; 
      
      const conclusion = getConclusion(totalScore);
      
      const testResultData = {
        child_id: childId,
        total_score: totalScore,
        max_score: maxScore,
        answers: answers.map(a => ({ // Ensure only relevant fields are saved
            question_id: a.question_id,
            answer: a.answer,
            score: a.score,
            maxPointsPossible: a.maxPointsPossible,
            time_taken: a.time_taken // Include time_taken from answers
        })),
        recommendation: conclusion.type
      };
      
      // The outline simplifies logic for creating/getting results, assuming new test always creates new result for now.
      // The previous logic checked for existing results with identical answers. Given the requirement to remove all timer functionality,
      // and the outline's simplification note, we'll proceed with always creating a new result for this specific task.
      // If `test_duration` was a factor in `TestResult.filter` or `JSON.stringify` comparison, its removal necessitates this change.
      // For now, always create a new result to match the simplified instruction.
      let testResult = await TestResult.create(testResultData);
      
      setChild(childData);
      setResults(testResult);
    } catch (error) {
      console.error('Error loading results:', error);
    }
    
    setIsLoading(false);
  };

  const getConclusion = (score) => {
    if (score <= 1) {
      return {
        title: 'ציון נמוך מאוד',
        subtitle: '', 
        type: 'very_low',
        color: 'bg-red-100 text-red-800 border-red-200'
      };
    } else if (score === 2) {
      return {
        title: 'ציון נמוך',
        subtitle: '', 
        type: 'low',
        color: 'bg-red-100 text-red-800 border-red-200'
      };
    } else if (score === 3) {
      return {
        title: 'מעט נמוך מהממוצע',
        subtitle: '', 
        type: 'below_average',
        color: 'bg-orange-100 text-orange-800 border-orange-200'
      };
    } else if (score === 4) {
      return {
        title: 'ממוצע',
        subtitle: '', 
        type: 'average',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      };
    } else if (score === 5) {
      return {
        title: 'גבוה מן הממוצע',
        subtitle: '', 
        type: 'above_average',
        color: 'bg-blue-100 text-blue-800 border-blue-200'
      };
    } else if (score === 6) {
      return {
        title: 'ציון גבוה',
        subtitle: '', 
        type: 'high',
        color: 'bg-green-100 text-green-800 border-green-200'
      };
    } else if (score >= 7) {
      return {
        title: 'ציון מעולה',
        subtitle: '', 
        type: 'excellent',
        color: 'bg-green-100 text-green-800 border-green-200'
      };
    }
    return {
        title: 'לא ניתן לחשב ציון',
        subtitle: '',
        type: 'undefined',
        color: 'bg-gray-100 text-gray-800 border-gray-200'
    };
  };

  const getQuestionTitle = (questionId) => {
    const questions = {
      1: "זיהוי לחם",
      2: "זיהוי חיה שעושה מוווו",
      4: "זיהוי חלק חסר בדובי",
      5: "זיהוי הפס הארוך ביותר",
      6: "השלמת משבצת ריקה (כדורסל)",
      7: "בניית צורה עם קוביות",
      8: "ספירת אוזניים"
    };
    return questions[questionId] || `שאלה ${questionId}`;
  };

  const getErrorReason = (answer) => {
    // If time taken is more than 30 seconds, it's a time penalty
    if (answer.time_taken > 30) {
      return "חריגה מהזמן המוקצב (30 שניות)";
    }
    // If score is 0 but time is within limit, it's a wrong answer
    if (answer.score === 0) {
      return "תשובה שגויה";
    }
    return null; // No error (correct answer)
  };

  const generatePDFReport = async () => {
    setIsGeneratingPDF(true);
    
    try {
      const conclusion = getConclusion(results?.total_score || 0);
      
      const pdfContent = `
        <!DOCTYPE html>
        <html dir="rtl" lang="he">
        <head>
          <meta charset="UTF-8">
          <title>דו"ח בדיקת התפתחות ילדים - WPPSI</title>
          <style>
            body { font-family: Arial, sans-serif; direction: rtl; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .section { margin-bottom: 30px; page-break-inside: avoid; }
            .section-title { background-color: #f0f0f0; padding: 10px; font-size: 18px; font-weight: bold; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 15px 0; }
            .info-item { padding: 8px; border: 1px solid #ddd; }
            .score-box { text-align: center; font-size: 24px; padding: 20px; border: 2px solid #333; margin: 20px 0; }
            .conclusion { padding: 15px; border: 2px solid; border-radius: 5px; text-align: center; font-weight: bold; margin: 20px 0; }
            .conclusion.very_low, .conclusion.low { background-color: #fef2f2; border-color: #fecaca; color: #991b1b; }
            .conclusion.below_average { background-color: #fff7ed; border-color: #fed7aa; color: #c2410c; }
            .conclusion.average { background-color: #fefce8; border-color: #fef3c7; color: #a16207; }
            .conclusion.above_average { background-color: #dbeafe; border-color: #bfdbfe; color: #1d4ed8; }
            .conclusion.high, .conclusion.excellent { background-color: #dcfce7; border-color: #bbf7d0; color: #166534; }
            .question-results { border-collapse: collapse; width: 100%; }
            .question-results th, .question-results td { border: 1px solid #ddd; padding: 8px; text-align: center; }
            .question-results th { background-color: #f2f2f2; }
            .correct { color: green; font-weight: bold; }
            .incorrect { color: red; }
            .time-penalty { color: orange; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>דו"ח בדיקת התפתחות ילדים</h1>
            <h2>מבחן WPPSI דיגיטלי</h2>
            <p>תאריך הבדיקה: ${new Date().toLocaleDateString('he-IL')}</p>
          </div>

          <div class="section">
            <div class="section-title">פרטי הילד</div>
            <div class="info-grid">
              <div class="info-item"><strong>שם:</strong> ${child?.first_name} ${child?.last_name}</div>
              <div class="info-item"><strong>תעודת זהות:</strong> ${child?.id_number}</div>
              <div class="info-item"><strong>תאריך לידה:</strong> ${child?.birth_date && new Date(child.birth_date).toLocaleDateString('he-IL')}</div>
              <div class="info-item"><strong>גיל:</strong> ${child?.birth_date ? `${calculateAge(child.birth_date)} שנים` : ''}</div>
              <div class="info-item"><strong>מגדר:</strong> ${child?.gender === 'male' ? 'זכר' : 'נקבה'}</div>
              <div class="info-item"><strong>תאריך ביצוע הבדיקה:</strong> ${results?.created_date && new Date(results.created_date).toLocaleDateString('he-IL')}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">תוצאות כלליות</div>
            <div class="score-box">
              ציון כולל: ${results?.total_score} מתוך 7 שאלות
            </div>
            <div class="conclusion ${conclusion.type}">
              <div style="font-size: 1.2em; margin-bottom: 10px;">${conclusion.title}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">תוצאות מפורטות לכל שאלה</div>
            <table class="question-results">
              <thead>
                <tr>
                  <th>מס' שאלה</th>
                  <th>תיאור השאלה</th>
                  <th>תשובה</th>
                  <th>זמן תגובה (שניות)</th>
                  <th>ציון</th>
                  <th>תוצאה</th>
                  <th>הערות</th>
                </tr>
              </thead>
              <tbody>
                ${results?.answers?.map(answer => {
                  // Filter out question 3 if it somehow made it into the answers array
                  if (answer.question_id === 3) return ''; 
                  
                  const errorReason = getErrorReason(answer);
                  const isTimeExceeded = answer.time_taken > 30;
                  return `
                    <tr>
                      <td>${answer.question_id}</td>
                      <td>${getQuestionTitle(answer.question_id)}</td>
                      <td>${answer.answer}</td>
                      <td>${answer.time_taken}</td>
                      <td>${answer.score} / ${answer.maxPointsPossible || 1}</td>
                      <td class="${answer.score > 0 ? 'correct' : (isTimeExceeded ? 'time-penalty' : 'incorrect')}">
                        ${answer.score > 0 ? '✓' : '✗'}
                      </td>
                      <td class="${isTimeExceeded ? 'time-penalty' : ''}">${errorReason || 'תשובה נכונה'}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="section-title">מסקנות והמלצות</div>
            <div style="padding: 15px;">
              <div class="conclusion ${conclusion.type}">
                <strong>${conclusion.title}</strong>
              </div>
              
              ${conclusion.type === 'very_low' || conclusion.type === 'low' ? `
                <p><strong>המלצות לפעולה:</strong></p>
                <ul>
                  <li>מומלץ לפנות לקלינאי תקשורת לבדיקה מקיפה יותר והתערבות מוקדמת במידת הצורך.</li>
                </ul>
              ` : conclusion.type === 'below_average' ? `
                <p><strong>המלצות:</strong></p>
                <ul>
                  <li>מומלץ מעקב והתבוננות, עידוד פעילויות למידה מגוונות. ניתן לשקול בדיקה חוזרת בעוד מספר חודשים.</li>
                </ul>
              ` : `
                <p><strong>המלצות:</strong></p>
                <ul>
                  <li>המשיכו לעודד פעילויות למידה מגוונות. התפתחות תקינה. בדיקה חוזרת מומלצת בעוד שנה.</li>
                </ul>
              `}
            </div>
          </div>

          <div style="margin-top: 50px; text-align: center; font-size: 12px; color: #666;">
            <p>דו"ח זה נוצר על ידי מערכת בדיקת ההתפתחות הדיגיטלית</p>
            <p>לשאלות נוספות, פנו לגורם המקצועי המטפל</p>
          </div>
        </body>
        </html>
      `;

      const printWindow = window.open('', '_blank');
      printWindow.document.write(pdfContent);
      printWindow.document.close();
      
      setTimeout(() => {
        printWindow.print();
      }, 500);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
    
    setIsGeneratingPDF(false);
  };

  const getCharacterMessage = () => {
    if (!results) return 'טוען תוצאות...';
    
    const conclusion = getConclusion(results.total_score);
    switch (conclusion.type) {
      case 'excellent':
      case 'high':
        return 'מעולה! הילד מתפתח יפה!';
      case 'above_average':
      case 'average':
        return 'תוצאות טובות!';
      case 'below_average':
        return 'כדאי לעקוב ולעודד';
      case 'low':
      case 'very_low':
        return 'כדאי להתייעץ עם מומחה';
      default:
        return 'התוצאות מוכנות!';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-xl text-gray-600">מחשב תוצאות...</p>
      </div>
    );
  }

  const conclusion = getConclusion(results?.total_score || 0);

  return (
    <div className="max-w-4xl mx-auto">
      <CharacterGuide message={getCharacterMessage()} />
      
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">תוצאות הבדיקה</h1>
        <p className="text-xl text-gray-600">בדיקת התפתחות ילדים - WPPSI</p>
      </div>

      <div className="grid gap-6 mb-8">
        {/* Child Info */}
        <Card className="child-friendly border-2 border-blue-200 bg-white/90">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-700 flex items-center gap-3">
              <User className="w-6 h-6" />
              פרטי הילד
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
              <div>
                <span className="font-semibold text-gray-700">שם: </span>
                {child?.first_name} {child?.last_name}
              </div>
              <div>
                <span className="font-semibold text-gray-700">תעודת זהות: </span>
                {child?.id_number}
              </div>
              <div>
                <span className="font-semibold text-gray-700">תאריך לידה: </span>
                {child?.birth_date && new Date(child.birth_date).toLocaleDateString('he-IL')}
              </div>
              <div>
                <span className="font-semibold text-gray-700">גיל: </span>
                {child?.birth_date && `${calculateAge(child.birth_date)} שנים`}
              </div>
              <div>
                <span className="font-semibold text-gray-700">מגדר: </span>
                {child?.gender === 'male' ? 'זכר' : 'נקבה'}
              </div>
              <div>
                <span className="font-semibold text-gray-700">תאריך הבדיקה: </span>
                {results?.created_date && new Date(results.created_date).toLocaleDateString('he-IL')}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score */}
        <Card className="child-friendly border-2 border-purple-200 bg-white/90">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-700 flex items-center gap-3">
              <Target className="w-6 h-6" />
              ציון כולל
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-6xl font-bold text-purple-600 mb-4">
              {results?.total_score} / 7
            </div>
            <div className="text-xl text-gray-600">
              שאלות נענו נכון
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <Card className="child-friendly border-2 border-indigo-200 bg-white/90">
          <CardHeader>
            <CardTitle className="text-2xl text-indigo-700 flex items-center gap-3">
              <CheckCircle className="w-6 h-6" />
              תוצאות מפורטות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {results?.answers?.map((answer, index) => {
                if (answer.question_id === 3) return null; 

                const errorReason = getErrorReason(answer);
                const isTimeExceeded = answer.time_taken > 30;

                return (
                  <div key={answer.question_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">
                        {answer.question_id}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{getQuestionTitle(answer.question_id)}</div>
                        <div className="text-sm text-gray-600">תשובה: {answer.answer}</div>
                        <div className="text-sm text-gray-500">זמן תגובה: {answer.time_taken} שניות</div>
                        {errorReason && (
                          <div className={`text-sm font-medium ${isTimeExceeded ? 'text-orange-600' : 'text-red-600'}`}>
                            {errorReason}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-left">
                      <div className={`font-bold ${answer.score > 0 ? 'text-green-600' : (isTimeExceeded ? 'text-orange-600' : 'text-red-600')}`}>
                        {answer.score} / {answer.maxPointsPossible || 1}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Conclusion */}
        <Card className="child-friendly border-2 border-green-200 bg-white/90">
          <CardHeader>
            <CardTitle className="text-2xl text-green-700 flex items-center gap-3">
              <Calendar className="w-6 h-6" />
              מסקנות
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Badge className={`text-2xl p-4 ${conclusion.color} border-2`}>
              <div>
                <div className="font-bold">{conclusion.title}</div>
              </div>
            </Badge>
            
            <div className="mt-8 space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">המלצות כלליות:</h3>
              
              {(conclusion.type === 'very_low' || conclusion.type === 'low') && (
                <div className="bg-red-50 p-4 rounded-lg text-red-800">
                  מומלץ לפנות לקלינאי תקשורת לבדיקה מקיפה יותר והתערבות מוקדמת במידת הצורך.
                </div>
              )}
              
              {conclusion.type === 'below_average' && (
                <div className="bg-orange-50 p-4 rounded-lg text-orange-800">
                  מומלץ מעקב והתבוננות, עידוד פעילויות למידה מגוונות. ניתן לשקול בדיקה חוזרת בעוד מספר חודשים.
                </div>
              )}
              
              {(conclusion.type === 'average' || conclusion.type === 'above_average' || conclusion.type === 'high' || conclusion.type === 'excellent') && (
                <div className="bg-green-50 p-4 rounded-lg text-green-800">
                  המשיכו לעודד פעילויות למידה מגוונות. התפתחות תקינה. בדיקה חוזרת מומלצת בעוד שנה.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <Button
          onClick={() => {
            localStorage.removeItem('testAnswers');
            localStorage.removeItem('currentChildId'); // Also clear childId
            localStorage.removeItem('currentChildLastName'); // Also clear childLastName
            navigate(createPageUrl('Welcome'));
          }}
          variant="outline"
          className="child-friendly border-2 border-blue-300 text-lg p-4"
        >
          <RefreshCw className="w-5 h-5 ml-2" />
          בדיקה חדשה
        </Button>
        
        <Button
          onClick={generatePDFReport}
          disabled={isGeneratingPDF}
          className="child-friendly bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-lg p-4"
        >
          <Download className="w-5 h-5 ml-2" />
          {isGeneratingPDF ? 'מכין דו"ח...' : 'הורדת דו"ח PDF'}
        </Button>
      </div>
    </div>
  );
}
