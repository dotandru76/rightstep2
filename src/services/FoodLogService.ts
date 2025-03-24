
interface FoodLogEntry {
  id: string;
  timestamp: number;
  foodItems: string[];
  calories: number;
  imageUrl?: string;
  suitable: boolean;
}

interface DailyLog {
  date: string;
  entries: FoodLogEntry[];
  totalCalories: number;
}

class FoodLogService {
  private storageKey = 'foodLogEntries';
  
  saveEntry(entry: Omit<FoodLogEntry, 'id'>): FoodLogEntry {
    const entries = this.getAllEntries();
    const newEntry = {
      ...entry,
      id: this.generateId()
    };
    
    entries.push(newEntry);
    localStorage.setItem(this.storageKey, JSON.stringify(entries));
    
    return newEntry;
  }
  
  getAllEntries(): FoodLogEntry[] {
    try {
      const entries = localStorage.getItem(this.storageKey);
      return entries ? JSON.parse(entries) : [];
    } catch (error) {
      console.error('Error retrieving food log entries:', error);
      return [];
    }
  }
  
  getDailyLog(date: string): DailyLog {
    const allEntries = this.getAllEntries();
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const entriesForDay = allEntries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return entryDate >= startOfDay && entryDate <= endOfDay;
    });
    
    const totalCalories = entriesForDay.reduce((sum, entry) => sum + entry.calories, 0);
    
    return {
      date,
      entries: entriesForDay,
      totalCalories
    };
  }
  
  getCurrentDayLog(): DailyLog {
    const today = new Date().toISOString().split('T')[0];
    return this.getDailyLog(today);
  }
  
  deleteEntry(id: string): boolean {
    const entries = this.getAllEntries();
    const filteredEntries = entries.filter(entry => entry.id !== id);
    
    if (filteredEntries.length !== entries.length) {
      localStorage.setItem(this.storageKey, JSON.stringify(filteredEntries));
      return true;
    }
    
    return false;
  }
  
  clearAllEntries(): void {
    localStorage.removeItem(this.storageKey);
  }
  
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
  
  // Extract calories from nutrients array or text
  extractCalories(nutrients: { label: string; value: string }[]): number {
    // First, look for specific "Calories" entries
    for (const nutrient of nutrients) {
      if (nutrient.label.toLowerCase().includes('calorie') || nutrient.label.toLowerCase() === 'calories') {
        // Extract numeric value from the string
        const calorieMatch = nutrient.value.match(/\d+/);
        if (calorieMatch) {
          return parseInt(calorieMatch[0], 10);
        }
      }
    }
    
    // If we have multiple items, try to sum them up (e.g., Calories (Cucumber): 15-20, Calories (Tomato): 20-25)
    let totalCalories = 0;
    let foundCalorieItem = false;
    
    for (const nutrient of nutrients) {
      if (nutrient.label.toLowerCase().includes('calorie')) {
        const matches = nutrient.value.match(/(\d+)(?:-(\d+))?/);
        if (matches) {
          // If there's a range like "15-20", take the average
          if (matches[2]) {
            const min = parseInt(matches[1], 10);
            const max = parseInt(matches[2], 10);
            totalCalories += Math.round((min + max) / 2);
          } else {
            totalCalories += parseInt(matches[1], 10);
          }
          foundCalorieItem = true;
        }
      }
    }
    
    if (foundCalorieItem) {
      return totalCalories;
    }
    
    // Default calories if not found
    return 0;
  }
}

export const foodLogService = new FoodLogService();
