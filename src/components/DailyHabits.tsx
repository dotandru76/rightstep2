import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarCheck } from "lucide-react";

interface DailyHabitsProps {
  currentWeek?: number;
}

const DailyHabits: React.FC<DailyHabitsProps> = ({ currentWeek = 1 }) => {
  // Base habits that apply to all weeks
  const baseHabits = [
    { id: 1, title: "Drink 8 glasses of water", permanent: true },
  ];

  // Week-specific habits
  const weeklyHabits = {
    1: [
      { id: 101, title: "Drink 2 glasses before meals", permanent: true },
      { id: 102, title: "Track water intake", permanent: false },
    ],
    2: [
      { id: 201, title: "50% cleansing vegetables", permanent: true },
      { id: 202, title: "Prepare vegetables in advance", permanent: false },
    ],
    3: [
      { id: 301, title: "Eliminate added sugars", permanent: true },
      { id: 302, title: "Avoid wheat flour", permanent: true },
    ],
    4: [
      { id: 401, title: "Include legumes in meals", permanent: true },
      { id: 402, title: "Use buckwheat and quinoa", permanent: true },
    ],
    5: [
      { id: 501, title: "Limit fats to 2 tbsp daily", permanent: true },
      { id: 502, title: "Choose healthy fats", permanent: true },
    ],
    6: [
      { id: 601, title: "Eat without distractions", permanent: true },
      { id: 602, title: "Chew thoroughly (20+ times)", permanent: true },
    ],
    7: [
      { id: 701, title: "3 meals without snacking", permanent: true },
      { id: 702, title: "Keep consistent eating schedule", permanent: true },
    ],
    8: [
      { id: 802, title: "Manage cravings with alternatives", permanent: true },
      { id: 803, title: "Reconnect with core motivation", permanent: false },
    ],
    9: [
      { id: 901, title: "Follow your selected track", permanent: true },
      { id: 902, title: "Adapt previous principles", permanent: true },
    ],
    10: [
      { id: 1001, title: "10-12 hour eating window", permanent: true },
      { id: 1002, title: "Optimize protein intake", permanent: true },
    ],
    11: [
      { id: 1101, title: "142 breathing before meals", permanent: true },
      { id: 1102, title: "2-minute power poses daily", permanent: true },
    ],
    12: [
      { id: 1201, title: "Apply caloric density knowledge", permanent: true },
      { id: 1202, title: "Maintain personal food boundaries", permanent: true },
    ],
    13: [
      { id: 1301, title: "Apply full Leptin principles", permanent: true },
      { id: 1302, title: "Use strategies for challenges", permanent: true },
    ],
  };

  const [habits, setHabits] = useState<{id: number, title: string, completed: boolean, permanent?: boolean}[]>([]);

  useEffect(() => {
    // Build the habits list based on current week
    let currentHabits = [...baseHabits];
    
    // Add permanent habits from previous weeks
    for (let i = 1; i <= Math.min(currentWeek, 13); i++) {
      const weekHabits = weeklyHabits[i as keyof typeof weeklyHabits] || [];
      if (i === currentWeek) {
        // Add all habits from current week
        currentHabits = [...currentHabits, ...weekHabits];
      } else {
        // Only add permanent habits from previous weeks
        const permanentHabits = weekHabits.filter(habit => habit.permanent);
        currentHabits = [...currentHabits, ...permanentHabits];
      }
    }

    // Initialize all habits as uncompleted
    setHabits(currentHabits.map(habit => ({
      ...habit,
      completed: false
    })));
  }, [currentWeek]);

  const toggleHabit = (id: number) => {
    setHabits(habits.map(habit => 
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    ));
  };

  // Display only up to 7 habits maximum for a cleaner UI
  const displayedHabits = habits.slice(0, 7);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CalendarCheck className="h-5 w-5 text-green-500" />
          Today's Habits
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[240px] overflow-y-auto pr-2">
          {displayedHabits.map(habit => (
            <div key={habit.id} className="flex items-start space-x-2">
              <Checkbox 
                id={`habit-${habit.id}`} 
                checked={habit.completed} 
                onCheckedChange={() => toggleHabit(habit.id)} 
                className="mt-0.5"
              />
              <label 
                htmlFor={`habit-${habit.id}`} 
                className={`text-sm font-medium leading-tight ${habit.completed ? 'line-through text-muted-foreground' : ''}`}
              >
                {habit.title}
              </label>
            </div>
          ))}
          {habits.length > 7 && (
            <div className="text-sm text-muted-foreground pt-1">
              +{habits.length - 7} more habits...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyHabits;
