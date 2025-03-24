
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { foodLogService } from '@/services/FoodLogService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

const FoodLogSummary = () => {
  const [dailyLog, setDailyLog] = React.useState(foodLogService.getCurrentDayLog());
  
  const refreshLog = () => {
    setDailyLog(foodLogService.getCurrentDayLog());
  };
  
  const handleDeleteEntry = (id: string) => {
    if (foodLogService.deleteEntry(id)) {
      toast.success("Food entry removed from log");
      refreshLog();
    }
  };
  
  React.useEffect(() => {
    // Refresh log when component mounts
    refreshLog();
    
    // Set up a refresh interval to catch new entries that might be added
    const intervalId = setInterval(refreshLog, 30000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Utensils className="h-5 w-5 text-orange-500" />
          Today's Food Log
          <span className="ml-auto text-sm font-normal text-muted-foreground">
            Total: {dailyLog.totalCalories} calories
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {dailyLog.entries.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Food Items</TableHead>
                <TableHead className="text-right">Calories</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dailyLog.entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{formatTime(entry.timestamp)}</TableCell>
                  <TableCell>{entry.foodItems.join(', ')}</TableCell>
                  <TableCell className="text-right">{entry.calories}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteEntry(entry.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No food entries logged today. Analyze your food to start tracking!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FoodLogSummary;
