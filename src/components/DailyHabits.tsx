
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarCheck } from "lucide-react";

const DailyHabits = () => {
  const [habits, setHabits] = useState([
    { id: 1, title: "Drink 8 glasses of water", completed: false },
    { id: 2, title: "50% cleansing vegetables in each meal", completed: false },
    { id: 3, title: "3 organized meals", completed: false },
    { id: 4, title: "Eating window of 8-12 hours", completed: false },
    { id: 5, title: "142 breathing before meals", completed: false },
    { id: 6, title: "BLISS principles when eating", completed: false }
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
          Daily Habits
        </CardTitle>
        <CardDescription>Track your Leptin habits</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>{completedCount} of {habits.length} completed</span>
            <span>{progressPercentage.toFixed(0)}%</span>
          </div>
          <div className="space-y-2">
            {habits.map(habit => (
              <div key={habit.id} className="flex items-center space-x-2">
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
        <p className="text-sm text-muted-foreground">Check the habits you managed to maintain today</p>
      </CardFooter>
    </Card>
  );
};

export default DailyHabits;
