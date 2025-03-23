import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { Droplets, BookOpen, CalendarCheck, Star, LineChart, Info, MenuSquare } from "lucide-react";
import WeeklyProgress from "@/components/WeeklyProgress";
import WaterTracker from "@/components/WaterTracker";
import DailyHabits from "@/components/DailyHabits";
import TipsCard from "@/components/TipsCard";

const Index = () => {
  const navigate = useNavigate();
  const [currentWeek, setCurrentWeek] = useState(1);
  const [selectedTab, setSelectedTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">שיטת הלפטין</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/journal")}>
              יומן מעקב
            </Button>
            <Button variant="outline" onClick={() => navigate("/profile")}>
              הפרופיל שלי
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
        <Tabs defaultValue="overview" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">סקירה כללית</TabsTrigger>
            <TabsTrigger value="tracks">המסלולים</TabsTrigger>
            <TabsTrigger value="tools">כלים להתמודדות</TabsTrigger>
            <TabsTrigger value="progress">התקדמות אישית</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ברוכים הבאים לשיטת הלפטין</CardTitle>
                <CardDescription>המסע לאיזון הורמונלי, בריאות וירידה במשקל</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  שיטת הלפטין היא תוכנית הוליסטית לאיזון הורמונלי ותזונה בריאה המבוססת על הבנת הקשר בין מאכלים ל"אפקט החסימה" - 
                  מצב בו אנו מאבדים את תחושת השובע ונתקעים במעגל של רעב מתמיד וחשקים.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Droplets className="text-blue-500 h-5 w-5" />
                    <span>הצפה לפטינית - מים וירקות מנקים</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="text-blue-500 h-5 w-5" />
                    <span>הימנעות ממאכלים מעוררי אפקט חסימה</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="text-blue-500 h-5 w-5" />
                    <span>חלון אכילה מוגדר</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="text-blue-500 h-5 w-5" />
                    <span>פיתוח זהות לפטינית</span>
                  </div>
                </div>
                <p>
                  התוכנית מבוססת על 9 שבועות של ניקוי לפטיני ולאחר מכן מעבר לאחד משלושת המסלולים להמשך השינוי ושמירה על התוצאות.
                </p>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button onClick={() => setSelectedTab("tracks")}>הכר את המסלולים</Button>
                <Button variant="outline" onClick={() => navigate("/education")}>חומרי הדרכה מלאים</Button>
              </CardFooter>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <WaterTracker />
              <DailyHabits />
            </div>
            
            <TipsCard />
          </TabsContent>
          
          <TabsContent value="tracks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>שלושת המסלולים</CardTitle>
                <CardDescription>לאחר 9 שבועות של ניקוי לפטיני, בחר את המסלול המתאים לך</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border rounded-lg p-4 bg-blue-50">
                  <h3 className="text-lg font-bold text-blue-800 mb-2">המסלול המהיר</h3>
                  <p className="mb-4">המסלול המהיר כולל:</p>
                  <ul className="list-disc mr-5 space-y-2">
                    <li>מים</li>
                    <li>ירקות מנקים</li>
                    <li>חלבונים</li>
                    <li>קטניות</li>
                  </ul>
                  <p className="mt-2 text-sm">* מאפשר את קצב הירידה במשקל המהיר ביותר</p>
                </div>
                
                <div className="border rounded-lg p-4 bg-green-50">
                  <h3 className="text-lg font-bold text-green-800 mb-2">מסלול הניקוי</h3>
                  <p className="mb-4">מסלול הניקוי כולל:</p>
                  <ul className="list-disc mr-5 space-y-2">
                    <li>מים</li>
                    <li>ירקות מנקים</li>
                    <li>חלבונים</li>
                    <li>קטניות</li>
                    <li>כוסמת וקינואה</li>
                  </ul>
                  <p className="mt-2 text-sm">* מאזן בין קצב ירידה במשקל לבין גיוון תזונתי</p>
                </div>
                
                <div className="border rounded-lg p-4 bg-purple-50">
                  <h3 className="text-lg font-bold text-purple-800 mb-2">המסלול המתון</h3>
                  <p className="mb-4">המסלול המתון כולל:</p>
                  <ul className="list-disc mr-5 space-y-2">
                    <li>מים</li>
                    <li>ירקות מנקים</li>
                    <li>חלבונים</li>
                    <li>קטניות</li>
                    <li>כוסמת וקינואה</li>
                    <li>רבע צלחת של: אורז, תפוחי אדמה, בטטה, סלק, תירס, קמח מלא, שיבולת שועל</li>
                  </ul>
                  <p className="mt-2 text-sm">* ירידה איטית יותר במשקל, אך עם יותר גמישות ומגוון</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => navigate("/path-selection")}>בחר את המסלול שלך</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="tools" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>כלים להתמודדות</CardTitle>
                <CardDescription>טכניקות וכלים מעשיים להתמודדות עם אתגרים בדרך</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-bold mb-2">התמודדות עם רגעי שבירה</h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="bg-blue-100 text-blue-700 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-1">1</div>
                      <div>
                        <h4 className="font-medium">הסחת דעת מנטלית</h4>
                        <p className="text-sm">לצאת להליכה, להתקלח, לעסוק בתחביב, כל דבר שעוצר את הדפוס המנטלי והרגשי של האכילה</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-blue-100 text-blue-700 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-1">2</div>
                      <div>
                        <h4 className="font-medium">קרבה אנושית</h4>
                        <p className="text-sm">לשתף אחרים בקושי שלך באותו רגע, ולא בדיעבד. רגע לפני ה"שבירה", שתף בהודעה בצ'אט או בקבוצה</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-blue-100 text-blue-700 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-1">3</div>
                      <div>
                        <h4 className="font-medium">דרך האמצע</h4>
                        <p className="text-sm">למצוא פשרה שהדופמין יסכים לה, כגון בננה עם כפית חמאת בוטנים במקום עוגיות</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-bold mb-2">השכפ"צ הלפטיני</h3>
                  <p className="mb-3">עקרונות בסיסיים להגנה בתקופות מאתגרות:</p>
                  <ul className="list-disc mr-5 space-y-1">
                    <li>מים לפני כל ארוחה ולאורך היום</li>
                    <li>ירקות מנקים (לפחות 50% מהצלחת)</li>
                    <li>ארוחות מסודרות (2-3 ביום)</li>
                    <li>חלון אכילה מוגדר (8-12 שעות)</li>
                  </ul>
                  <p className="mt-2 text-sm">* גם בתקופות מאתגרות, השכפ"צ יעזור לך לא לעלות במשקל ולשמור על האיזון ההורמונלי</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-bold mb-2">טכניקות לאיזון הורמונלי</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium">נשימות 142</h4>
                      <p className="text-sm">1 שניה נשימה, 4 שניות החזקה, 2 שניות נשיפה. 4-5 סבבים לפני ארוחות להפחתת קורטיזול וחשקים</p>
                    </div>
                    <div>
                      <h4 className="font-medium">תנוחת עוצמה (Power Pose)</h4>
                      <p className="text-sm">2 דקות עמידה בתנוחת עוצמה (ידיים על המותניים) להעלאת טסטוסטרון והפחתת קורטיזול</p>
                    </div>
                    <div>
                      <h4 className="font-medium">מודל בליס"ה</h4>
                      <p className="text-sm">ביסים קטנים, לעיסה, ידיים חופשיות, סדר אכילה, התמקדות</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => navigate("/tools")}>לכל הכלים והטכניקות</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="progress" className="space-y-6">
            <WeeklyProgress currentWeek={currentWeek} setCurrentWeek={setCurrentWeek} />
            
            <Card>
              <CardHeader>
                <CardTitle>הזהות הלפטינית שלי</CardTitle>
                <CardDescription>פיתוח זהות לפטינית הוא המפתח להצלחה לטווח ארוך</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>ארבעת שלבי המוטיבציה להצלחה לטווח ארוך:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-3 bg-gray-50">
                      <h3 className="font-bold">מוטיבציית כאב</h3>
                      <p className="text-sm">הכרה בחוסר הנוחות והקשיים שהיו לנו לפני התהליך</p>
                    </div>
                    
                    <div className="border rounded-lg p-3 bg-gray-50">
                      <h3 className="font-bold">מוטיבציית עונג</h3>
                      <p className="text-sm">חזון ברור של החיים הטובים יותר שאנו יוצרים</p>
                    </div>
                    
                    <div className="border rounded-lg p-3 bg-gray-50">
                      <h3 className="font-bold">מוטיבציית צמיחה</h3>
                      <p className="text-sm">הנאה מתהליך הלמידה וההתפתחות האישית</p>
                    </div>
                    
                    <div className="border rounded-lg p-3 bg-gray-50">
                      <h3 className="font-bold">מוטיבציית זהות</h3>
                      <p className="text-sm">הטמעת הלפטיניות כחלק מהזהות העצמית: "זה מי שאני"</p>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4" onClick={() => navigate("/identity")}>
                    למלא את דף עבודת הזהות שלי
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
