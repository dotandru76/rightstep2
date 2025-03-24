
import { toast } from "sonner";

// Interface for the analysis result from Google Vision API
export interface FoodAnalysisResult {
  suitable: boolean;
  explanation: string;
  nutrients: { label: string; value: string }[];
  detectedItems: string[];
}

export class GoogleVisionService {
  private apiKey: string | null = null;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || null;
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    // Store in localStorage for persistence
    localStorage.setItem("googleVisionApiKey", apiKey);
    return true;
  }

  getApiKey(): string | null {
    // Try to get from instance, then from localStorage
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem("googleVisionApiKey");
    }
    return this.apiKey;
  }

  async analyzeImage(imageData: string, currentWeek: number): Promise<FoodAnalysisResult> {
    const apiKey = this.getApiKey();
    
    if (!apiKey) {
      toast.error("Google Vision API key is missing. Please set it in the form below.");
      throw new Error("API key is missing");
    }

    try {
      // Remove the data:image/jpeg;base64, prefix if present
      const base64Image = imageData.replace(/^data:image\/\w+;base64,/, "");
      
      // Prepare the request to Google Vision API
      const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [{
            image: {
              content: base64Image
            },
            features: [
              { type: 'LABEL_DETECTION', maxResults: 10 },
              { type: 'OBJECT_LOCALIZATION', maxResults: 10 }
            ]
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Google Vision API error:", errorData);
        toast.error("Failed to analyze image: " + (errorData.error?.message || "Unknown error"));
        throw new Error("API request failed");
      }

      const data = await response.json();
      
      // Extract labels from the response
      const labels = data.responses[0]?.labelAnnotations || [];
      const objects = data.responses[0]?.localizedObjectAnnotations || [];
      
      // Collect food-related labels
      const foodItems = labels
        .filter((label: any) => 
          label.description.toLowerCase().match(/food|fruit|vegetable|meat|dish|meal|cuisine|breakfast|lunch|dinner|snack/i))
        .map((label: any) => label.description);
        
      // Add objects that might be food
      objects
        .filter((obj: any) => 
          obj.name.toLowerCase().match(/food|fruit|vegetable|meat|dish|meal|cuisine|breakfast|lunch|dinner|snack/i))
        .forEach((obj: any) => {
          if (!foodItems.includes(obj.name)) {
            foodItems.push(obj.name);
          }
        });
        
      console.log("Detected food items:", foodItems);
      
      // Analyze these food items in the context of the current program week
      return this.analyzeFoodForProgram(foodItems, currentWeek);
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast.error("Failed to analyze image. Please try again.");
      throw error;
    }
  }

  private analyzeFoodForProgram(foodItems: string[], currentWeek: number): FoodAnalysisResult {
    // This is where we'd implement the logic to determine if the detected food
    // is suitable for the current program week. For now, we'll use a simplified approach.
    
    // Week-specific keywords to look for in food items
    const weekKeywords: Record<number, { positive: string[], negative: string[] }> = {
      1: { 
        positive: ['water', 'hydrating', 'liquid', 'soup', 'broth', 'cucumber', 'watermelon'], 
        negative: ['dehydrating', 'alcohol', 'caffeine', 'soda', 'coffee'] 
      },
      2: { 
        positive: ['vegetable', 'vegetables', 'greens', 'salad', 'broccoli', 'spinach', 'kale', 'lettuce', 'cauliflower', 'zucchini'], 
        negative: ['processed', 'fried', 'sugar', 'cake', 'candy', 'chocolate'] 
      },
      3: { 
        positive: ['whole', 'natural', 'protein', 'lean', 'fruit', 'vegetable'], 
        negative: ['sugar', 'flour', 'processed', 'packaged', 'frozen dinner', 'candy', 'soda', 'sweet'] 
      },
      4: { 
        positive: ['legume', 'legumes', 'bean', 'beans', 'lentil', 'chickpea', 'buckwheat', 'quinoa'], 
        negative: ['refined', 'white bread', 'white rice', 'pasta'] 
      },
      5: { 
        positive: ['lean', 'grilled', 'baked', 'steamed', 'boiled'], 
        negative: ['fried', 'fatty', 'oil', 'butter', 'cream', 'cheese'] 
      }
    };

    // Default to the current week or week 1 if current week doesn't have specific keywords
    const weekData = weekKeywords[currentWeek] || weekKeywords[1];
    
    // Check for positive and negative matches
    const positiveMatches = foodItems.filter(item => 
      weekData.positive.some(keyword => 
        item.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    
    const negativeMatches = foodItems.filter(item => 
      weekData.negative.some(keyword => 
        item.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    
    // Determine suitability based on matches
    const suitable = positiveMatches.length > negativeMatches.length;
    
    // Generate explanation
    let explanation = "";
    if (suitable) {
      explanation = `This meal contains ${positiveMatches.join(", ")}, which aligns well with Week ${currentWeek}'s focus.`;
    } else if (negativeMatches.length > 0) {
      explanation = `This meal contains ${negativeMatches.join(", ")}, which may not be ideal for Week ${currentWeek}'s focus.`;
    } else {
      explanation = `We couldn't identify enough specific foods that align with Week ${currentWeek}'s focus.`;
    }
    
    // Mock nutrient data based on detected items
    // In a real app, you'd look up actual nutritional data for these items
    const nutrients = [
      { label: "Calories", value: `${Math.floor(Math.random() * 500 + 200)} kcal` },
      { label: "Protein", value: `${Math.floor(Math.random() * 30 + 10)}g` },
      { label: "Carbs", value: `${Math.floor(Math.random() * 60 + 20)}g` },
      { label: "Fat", value: `${Math.floor(Math.random() * 30 + 5)}g` }
    ];
    
    // Add a specific nutrient based on the week
    if (currentWeek === 1) {
      nutrients.push({ label: "Water", value: `${Math.floor(Math.random() * 30 + 60)}%` });
    } else if (currentWeek === 2) {
      nutrients.push({ label: "Fiber", value: `${Math.floor(Math.random() * 10 + 5)}g` });
    } else if (currentWeek === 3) {
      nutrients.push({ label: "Added Sugar", value: suitable ? "0g" : `${Math.floor(Math.random() * 10 + 5)}g` });
    }
    
    return {
      suitable,
      explanation,
      nutrients,
      detectedItems: foodItems
    };
  }
}

export const googleVisionService = new GoogleVisionService();
