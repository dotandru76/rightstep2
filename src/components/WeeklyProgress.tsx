
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface WeeklyProgressProps {
  currentWeek: number;
  setCurrentWeek: (week: number) => void;
}

const WeeklyProgress: React.FC<WeeklyProgressProps> = ({ currentWeek, setCurrentWeek }) => {
  const totalWeeks = 13;
  const progressPercentage = (currentWeek / totalWeeks) * 100;

  // Weekly themes based on the Leptine Method
  const weeklyThemes = [
    { week: 1, title: "מים ושתייה", description: "הצפה לפטינית - 3-4 ליטר ביום" },
    { week: 2, title: "ירקות מנקים", description: "50% מהצלחת ירקות מנקים" },
    { week: 3, title: "הניקוי הלפטיני", description: "חופשה מסוכר, קמח ומאכלים טחונים" },
    { week: 4, title: "פחמימות לפטיניות", description: "קטניות, כוסמת וקינואה" },
    { week: 5, title: "הגבלת שומנים", description: "הגבלה של 2 כפות שומן מרוכז ביום" },
    { week: 6, title: "הרגלי אכילה", description: "תדירות וצורת האכילה" },
    { week: 7, title: "הפחתת תדירות", description: "2-3 ארוחות ביום ללא נשנושים" },
    { week: 8, title: "מוטיבציה מחודשת", description: "חיזוק המוטיבציה ופיתוח אדישות למאכל הקריפטונייט" },
    { week: 9, title: "בחירת מסלול", description: "מעבר לאחד משלושת המסלולים" },
    { week: 10, title: "העמקה לפטינית", description: "התאזנות הורמונלית והעלאת אנרגיה" },
    { week: 11, title: "אורח חיים תומך", description: "נשימות, תנוחת עוצמה והרגלי שינה" },
    { week: 12, title: "דיוק הדרך", description: "צפיפות קלורית וגבולות ברורים" },
    { week: 13, title: "לפטיני לכל החיים", description: "פיתוח הזהות הלפטינית ואסטרטגיות להתמדה" }
  ];

  const handlePreviousWeek = () => {
    if (currentWeek > 1) {
      setCurrentWeek(currentWeek - 1);
    }
  };

  const handleNextWeek = () => {
    if (currentWeek < totalWeeks) {
      setCurrentWeek(currentWeek + 1);
    }
  };

  const currentTheme = weeklyThemes.find(theme => theme.week === currentWeek) || weeklyThemes[0];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>התקדמות בתוכנית</CardTitle>
            <CardDescription>עקוב אחר התקדמותך בתוכנית 13 השבועות</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handlePreviousWeek} disabled={currentWeek === 1}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNextWeek} disabled={currentWeek === totalWeeks}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between mb-1">
            <span className="font-medium">שבוע {currentWeek} מתוך {totalWeeks}</span>
            <span className="text-sm">{progressPercentage.toFixed(0)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <h3 className="font-bold text-lg">{currentTheme.title}</h3>
            <p>{currentTheme.description}</p>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mt-4">
            {Array.from({ length: totalWeeks }).map((_, i) => (
              <Button 
                key={i}
                variant={currentWeek === i + 1 ? "default" : "outline"}
                className="h-10 min-w-0"
                onClick={() => setCurrentWeek(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyProgress;
