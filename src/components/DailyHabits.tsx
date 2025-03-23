
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarCheck } from "lucide-react";

const DailyHabits = () => {
  const [habits, setHabits] = useState([
    { id: 1, title: "שתיית 8 כוסות מים", completed: false },
    { id: 2, title: "50% ירקות מנקים בכל ארוחה", completed: false },
    { id: 3, title: "3 ארוחות מסודרות", completed: false },
    { id: 4, title: "חלון אכילה של 8-12 שעות", completed: false },
    { id: 5, title: "נשימות 142 לפני ארוחות", completed: false },
    { id: 6, title: "עקרונות בליס\"ה באכילה", completed: false }
  ]);

  const toggleHabit = (id: number) => {
    setHabits(habits.map(habit => 
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    ));
  };

  const completedCount = habits.filter(habit => habit.completed).length;
  const progressPercentage = (completedCount / habits.length) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarCheck className="h-5 w-5 text-green-500" />
          הרגלים יומיים
        </CardTitle>
        <CardDescription>עקוב אחר ההרגלים הלפטיניים שלך</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>{completedCount} מתוך {habits.length} הושלמו</span>
            <span>{progressPercentage.toFixed(0)}%</span>
          </div>
          <div className="space-y-2">
            {habits.map(habit => (
              <div key={habit.id} className="flex items-center space-x-2 rtl:space-x-reverse">
                <Checkbox 
                  id={`habit-${habit.id}`} 
                  checked={habit.completed} 
                  onCheckedChange={() => toggleHabit(habit.id)} 
                />
                <label 
                  htmlFor={`habit-${habit.id}`} 
                  className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${habit.completed ? 'line-through text-muted-foreground' : ''}`}
                >
                  {habit.title}
                </label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">סמן את ההרגלים שהצלחת לשמור עליהם היום</p>
      </CardFooter>
    </Card>
  );
};

export default DailyHabits;
