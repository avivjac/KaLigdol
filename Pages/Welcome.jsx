
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Child } from '@/entities/Child';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CharacterGuide from '../components/shared/CharacterGuide';
import { Baby, ArrowLeft, CalendarDays } from 'lucide-react';

export default function Welcome() {
  const navigate = useNavigate();
  const [childData, setChildData] = useState({
    first_name: '',
    last_name: '',
    id_number: '',
    birth_date: '',
    gender: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [calculatedAge, setCalculatedAge] = useState(''); // New state for calculated age

  const calculateAgeInMonths = (birthDateString) => {
    if (!birthDateString) return null;
    const birthDate = new Date(birthDateString);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    
    if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
      years--;
      months += 12;
    }
    return years * 12 + months;
  };

  const formatAge = (birthDateString) => {
    const totalMonths = calculateAgeInMonths(birthDateString);
    if (totalMonths === null || totalMonths < 0) return '';
    
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    
    let ageString = '';
    if (years > 0) {
      ageString += `${years} ${years === 1 ? 'שנה' : 'שנים'}`;
    }
    if (months > 0) {
      if (years > 0) ageString += ' ו-';
      ageString += `${months} ${months === 1 ? 'חודש' : 'חודשים'}`;
    }
    if (!ageString) return 'פחות מחודש';
    return ageString;
  };
  
  useEffect(() => {
    // Only calculate and display age if birth date is valid
    if (childData.birth_date && !validateField('birth_date', childData.birth_date)) {
      setCalculatedAge(formatAge(childData.birth_date));
    } else {
      setCalculatedAge('');
    }
  }, [childData.birth_date]);

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'first_name':
      case 'last_name':
        if (!value.trim()) error = 'שדה חובה';
        else if (!/^[א-ת\s]+$/.test(value) && !/^[a-zA-Z\s]+$/.test(value)) error = 'יש להזין אותיות בלבד (עברית או אנגלית)';
        break;
      case 'id_number':
        if (!value.trim()) error = 'שדה חובה';
        else if (!/^\d{8,9}$/.test(value)) error = 'מספר תעודת זהות צריך להכיל 8 או 9 ספרות';
        break;
      case 'birth_date':
        if (!value) {
          error = 'שדה חובה';
        } else {
          const selectedDate = new Date(value);
          const currentDate = new Date();
          if (selectedDate > currentDate) {
            error = 'תאריך לידה לא יכול להיות בעתיד';
          } else {
            const year = selectedDate.getFullYear();
            if (year < 1900 || year > currentDate.getFullYear()) {
              error = 'שנה לא תקינה';
            } else {
              const ageInMonths = calculateAgeInMonths(value);
              const minAgeMonths = (2 * 12) + 9; // 2 שנים ו-9 חודשים = 33 חודשים
              const maxAgeMonths = (7 * 12) + 6; // 7 שנים ו-6 חודשים = 90 חודשים

              if (ageInMonths < minAgeMonths) {
                error = 'גיל הילד חייב להיות לפחות שנתיים ו-9 חודשים.';
              } else if (ageInMonths > maxAgeMonths) {
                error = 'גיל הילד יכול להיות לכל היותר 7 שנים ו-6 חודשים.';
              }
            }
          }
        }
        break;
      case 'gender':
        if (!value) error = 'שדה חובה';
        break;
      default:
        break;
    }
    return error;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({}); 

    let formIsValid = true;
    const currentErrors = {};
    
    Object.keys(childData).forEach(key => {
      const error = validateField(key, childData[key]);
      if (error) {
        currentErrors[key] = error;
        formIsValid = false;
      }
    });

    if (!formIsValid) {
      setErrors(currentErrors);
      setIsLoading(false);
      return; 
    }

    try {
      const child = await Child.create(childData);
      localStorage.setItem('currentChildId', child.id);
      localStorage.setItem('currentChildLastName', childData.last_name); 
      navigate(createPageUrl('Instructions'));
    } catch (error) {
      console.error('Error creating child:', error);
      setErrors({ form: 'אירעה שגיאה בשמירת הנתונים. נסו שוב.' }); 
    }

    setIsLoading(false);
  };

  const handleInputChange = (field, value) => {
    setChildData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field] || (field === 'birth_date' && errors.birth_date)) {
      const error = validateField(field, value); // Re-validate on change
      setErrors(prev => {
        const newErrors = { ...prev };
        if (error) {
          newErrors[field] = error;
        } else {
          delete newErrors[field];
        }
        return newErrors;
      });
    }
  };

  const handleBlur = (field) => {
    const error = validateField(field, childData[field]);
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    } else { 
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <CharacterGuide message="שלום! בואו נתחיל את הבדיקה" position="top-right" />

      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
          <Baby className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">בדיקת התפתחות ילדים</h1>
        <p className="text-xl text-gray-600">מבחן WPPSI דיגיטלי</p>
      </div>

      <Card className="child-friendly border-2 border-purple-200 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl text-purple-700 flex items-center justify-center gap-2">
            פרטי הילד
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.form && <p className="text-red-500 text-sm text-center">{errors.form}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="first_name" className="text-lg font-medium text-gray-700">
                  שם פרטי
                </Label>
                <Input
                  id="first_name"
                  value={childData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  onBlur={() => handleBlur('first_name')}
                  required
                  className={`text-lg p-4 child-friendly border-2 ${errors.first_name ? 'border-red-500' : 'border-blue-200'}`}
                  placeholder="הכניסו את השם הפרטי"
                />
                {errors.first_name && <p className="text-red-500 text-xs">{errors.first_name}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="last_name" className="text-lg font-medium text-gray-700">
                  שם משפחה
                </Label>
                <Input
                  id="last_name"
                  value={childData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  onBlur={() => handleBlur('last_name')}
                  required
                  className={`text-lg p-4 child-friendly border-2 ${errors.last_name ? 'border-red-500' : 'border-blue-200'}`}
                  placeholder="הכניסו את שם המשפחה"
                />
                {errors.last_name && <p className="text-red-500 text-xs">{errors.last_name}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="id_number" className="text-lg font-medium text-gray-700">
                מספר תעודת זהות
              </Label>
              <Input
                id="id_number"
                value={childData.id_number}
                onChange={(e) => handleInputChange('id_number', e.target.value)}
                onBlur={() => handleBlur('id_number')}
                required
                className={`text-lg p-4 child-friendly border-2 ${errors.id_number ? 'border-red-500' : 'border-blue-200'}`}
                placeholder="הכניסו מספר תעודת זהות"
              />
              {errors.id_number && <p className="text-red-500 text-xs">{errors.id_number}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="birth_date" className="text-lg font-medium text-gray-700">
                  תאריך לידה
                </Label>
                <Input
                  id="birth_date"
                  type="date"
                  value={childData.birth_date}
                  onChange={(e) => handleInputChange('birth_date', e.target.value)}
                  onBlur={() => handleBlur('birth_date')}
                  required
                  min="1900-01-01" 
                  max={new Date().toISOString().split('T')[0]} 
                  className={`text-lg p-4 child-friendly border-2 ${errors.birth_date ? 'border-red-500' : 'border-blue-200'}`}
                />
                {errors.birth_date && <p className="text-red-500 text-xs">{errors.birth_date}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="gender" className="text-lg font-medium text-gray-700">
                  מגדר
                </Label>
                <Select
                  value={childData.gender}
                  onValueChange={(value) => handleInputChange('gender', value)}
                >
                  <SelectTrigger
                    className={`text-lg p-4 child-friendly border-2 ${errors.gender ? 'border-red-500' : 'border-blue-200'} h-[58px]`} // Adjusted height to match Input
                    onBlur={() => handleBlur('gender')} 
                  >
                    <SelectValue placeholder="בחרו מגדר" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">זכר</SelectItem>
                    <SelectItem value="female">נקבה</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-red-500 text-xs">{errors.gender}</p>}
              </div>
            </div>
            
            {calculatedAge && (
              <div className="space-y-1">
                <Label className="text-lg font-medium text-gray-700">גיל הילד</Label>
                <div className="text-lg p-4 child-friendly border-2 border-gray-300 bg-gray-50 rounded-lg flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-gray-500" />
                  {calculatedAge}
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full text-xl p-6 child-friendly bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
            >
              {isLoading ? 'שומר פרטים...' : 'אישור והמשך'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
