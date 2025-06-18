import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CharacterGuide from '../components/shared/CharacterGuide';
import { Home, Users, AlertTriangle, Play } from 'lucide-react'; // Removed Clock

export default function Instructions() {
  const navigate = useNavigate();

  const handleStartTest = () => {
    navigate(createPageUrl('TestQuestion?question=1'));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <CharacterGuide message="קראו את ההנחיות בעיון לפני תחילת הבדיקה" />
      
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">הנחיות להורים</h1>
        <p className="text-xl text-gray-600">קראו בעיון לפני תחילת הבדיקה</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Removed Card for Time */}
        <Card className="child-friendly border-2 border-green-200 bg-white/90">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-green-700 flex items-center justify-center gap-3">
              <Home className="w-8 h-8" />
              סביבה
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-700 text-center leading-relaxed">
              הקפידו על סביבה שקטה ונוחה, ללא הפרעות במהלך הבדיקה.
            </p>
          </CardContent>
        </Card>

        <Card className="child-friendly border-2 border-purple-200 bg-white/90"> {/* Adjusted to take full width if only one item in row */}
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-purple-700 flex items-center justify-center gap-3">
              <Users className="w-8 h-8" />
              תמיכה
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-700 text-center leading-relaxed">
              מותר לעודד את הילד, אך אנא אל תספקו תשובות או רמזים במהלך הבדיקה.
            </p>
          </CardContent>
        </Card>
        
        <Card className="child-friendly border-2 border-red-200 bg-red-50 md:col-span-2">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-700 flex items-center justify-center gap-3">
              <AlertTriangle className="w-8 h-8" />
              חשוב!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-red-700 text-center leading-relaxed font-medium">
              אנא אל תתערבו בתהליך פתרון הבעיות של הילד. תנו לו להשלים את המטלות באופן עצמאי.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Button
          onClick={handleStartTest}
          className="text-2xl px-12 py-6 child-friendly bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white border-0"
        >
          <Play className="w-8 h-8 ml-3" />
          התחלת הבדיקה
        </Button>
      </div>
    </div>
  );
}