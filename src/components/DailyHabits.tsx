
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
      { id: 101, title: "Drink 2 glasses of water before each meal", permanent: true },
      { id: 102, title: "Track your water intake throughout the day", permanent: false },
      { id: 103, title: "Reduce sugary drinks and alcohol consumption", permanent: false },
    ],
    2: [
      { id: 201, title: "50% cleansing vegetables in each meal", permanent: true },
      { id: 202, title: "Prepare vegetables in advance for easy access", permanent: false },
      { id: 203, title: "Experiment with herbs and spices for flavor", permanent: false },
    ],
    3: [
      { id: 301, title: "Eliminate added sugars from your diet", permanent: true },
      { id: 302, title: "Avoid wheat flour and refined grains", permanent: true },
      { id: 303, title: "Read food labels to identify hidden sugars", permanent: false },
    ],
    4: [
      { id: 401, title: "Include legumes in at least one meal daily", permanent: true },
      { id: 402, title: "Replace refined grains with buckwheat and quinoa", permanent: true },
      { id: 403, title: "Balance carbs with protein and vegetables", permanent: false },
    ],
    5: [
      { id: 501, title: "Limit concentrated fats to 2 tablespoons daily", permanent: true },
      { id: 502, title: "Choose healthy fats: olive oil, avocado, nuts", permanent: true },
      { id: 503, title: "Use measuring tools to control portions", permanent: false },
    ],
    6: [
      { id: 601, title: "Eat in a calm, seated position without distractions", permanent: true },
      { id: 602, title: "Chew each bite thoroughly (at least 20 times)", permanent: true },
      { id: 603, title: "Put utensils down between bites", permanent: false },
    ],
    7: [
      { id: 701, title: "3 organized meals without snacking", permanent: true },
      { id: 702, title: "Create a consistent eating schedule", permanent: true },
      { id: 703, title: "Ensure meals are nutritionally complete", permanent: false },
    ],
    8: [
      { id: 801, title: "Practice exposure to trigger foods without consumption", permanent: false },
      { id: 802, title: "Develop replacement strategies for cravings", permanent: true },
      { id: 803, title: "Reconnect with your core motivation", permanent: false },
    ],
    9: [
      { id: 901, title: "Follow your selected track plan", permanent: true },
      { id: 902, title: "Adapt previous principles to your chosen track", permanent: true },
      { id: 903, title: "Review and reinforce weeks 1-8 principles", permanent: false },
    ],
    10: [
      { id: 1001, title: "Eating window of 10-12 hours", permanent: true },
      { id: 1002, title: "Optimize protein intake for muscle preservation", permanent: true },
      { id: 1003, title: "Integrate gentle movement daily", permanent: false },
    ],
    11: [
      { id: 1101, title: "142 breathing before meals", permanent: true },
      { id: 1102, title: "Hold power poses for 2 minutes daily", permanent: true },
      { id: 1103, title: "Establish a consistent sleep schedule", permanent: true },
    ],
    12: [
      { id: 1201, title: "Apply caloric density knowledge to food choices", permanent: true },
      { id: 1202, title: "Establish clear personal boundaries with food", permanent: true },
      { id: 1203, title: "Practice assertive communication about your needs", permanent: false },
    ],
    13: [
      { id: 1301, title: "Apply the full Leptin lifestyle principles", permanent: true },
      { id: 1302, title: "Create strategies for challenging situations", permanent: true },
      { id: 1303, title: "Share your experience to solidify your identity", permanent: false },
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

  const completedCount = habits.filter(habit => habit.completed).length;
  const progressPercentage = habits.length > 0 ? (completedCount / habits.length) * 100 : 0;

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
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            {habits.map(habit => (
              <div key={habit.id} className="flex items-start space-x-2">
                <Checkbox 
                  id={`habit-${habit.id}`} 
                  checked={habit.completed} 
                  onCheckedChange={() => toggleHabit(habit.id)} 
                  className="mt-0.5"
                />
                <label 
                  htmlFor={`habit-${habit.id}`} 
                  className={`text-sm font-medium leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${habit.completed ? 'line-through text-muted-foreground' : ''}`}
                >
                  {habit.title}
                </label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">Check the habits you maintained today</p>
      </CardFooter>
    </Card>
  );
};

export default DailyHabits;
