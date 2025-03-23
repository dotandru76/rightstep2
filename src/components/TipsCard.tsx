
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LightbulbIcon, RefreshCw } from "lucide-react";

const TipsCard = () => {
  const tips = [
    "כל פעם שאתה בוחר בארוחה לפטינית, אתה מחזק את הזהות הלפטינית שלך",
    "אם אתה חש רעב, וודא שאכלת מספיק ירקות מנקים וחלבון בארוחה האחרונה",
    "רוב העלייה במשקל אחרי ארוחת פינוק היא מנוזלים, לא משומן",
    "זכור את ההבדל בין 'רעב פה' (דופמין) לבין 'רעב בטן' (צורך אמיתי)",
    "נשימות 142 לפני ארוחה יכולות להפחית משמעותית את הרעב והחשקים",
    "חשוב להבדיל בין נפילה לבין כישלון - הלפטיני האמיתי לומד מכל נפילה",
    "הקפד על השכפ\"צ הלפטיני גם בתקופות מאתגרות: מים, ירקות, ארוחות מסודרות, חלון אכילה",
    "שתיית מים לפני כל ארוחה מפחיתה צריכה קלורית ב-30% בממוצע",
    "להישאר בתנוחת עוצמה (ידיים על המותניים) למשך 2 דקות מוריד קורטיזול ומעלה טסטוסטרון",
    "לדבר על הקשיים שלך עם אחרים הוא אחד הכלים החזקים ביותר להתמודדות עם רגעי שבירה",
    "גיוון מוגזם בארוחות מעלה את כמות האכילה ב-40% - בחר 5-8 ארוחות קבועות",
    "אחד המפתחות להצלחה לטווח ארוך הוא למלא את 4 שלבי המוטיבציה: כאב, עונג, צמיחה וזהות",
  ];

  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const getRandomTip = () => {
    const newIndex = Math.floor(Math.random() * tips.length);
    setCurrentTipIndex(newIndex);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LightbulbIcon className="h-5 w-5 text-yellow-500" />
          טיפ לפטיני
        </CardTitle>
        <CardDescription>טיפים והמלצות לאורח חיים לפטיני מוצלח</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 rounded-lg p-4 min-h-[100px] flex items-center">
          <p className="text-center w-full">{tips[currentTipIndex]}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={getRandomTip} className="w-full flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          טיפ חדש
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TipsCard;
