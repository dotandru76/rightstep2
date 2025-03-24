
import { toast } from "sonner";

// Interface for the analysis result from Gemini API
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
      toast.error("Gemini API key is missing. Please set it in the form below.");
      throw new Error("API key is missing");
    }

    try {
      // Remove the data:image/jpeg;base64, prefix if present
      const base64Image = imageData.replace(/^data:image\/\w+;base64,/, "");
      
      // Prepare the request to Gemini API - Using the newer gemini-1.5-flash model
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Analyze this food image and identify all food items. 
                  I am in week ${currentWeek} of a healthy eating program. 
                  For week ${currentWeek}, tell me if this food is appropriate and why. 
                  Also estimate basic nutritional information. 
                  Format your response as JSON with these fields:
                  {
                    "detectedItems": ["list of detected food items"],
                    "suitable": true or false,
                    "explanation": "explanation of why it's suitable or not for the current week",
                    "nutrients": [{"label": "nutrient name", "value": "amount"}]
                  }`
                },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: base64Image
                  }
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 1024
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Gemini API error:", errorData);
        toast.error("Failed to analyze image: " + (errorData.error?.message || "Unknown error"));
        throw new Error("API request failed");
      }

      const data = await response.json();
      
      // Extract the result from Gemini's response
      // Gemini returns a text response that we need to parse as JSON
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      try {
        // Extract the JSON portion from the text
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No JSON found in response');
        }
        
        // Parse the JSON response
        const parsedResponse = JSON.parse(jsonMatch[0]);
        console.log("Parsed food analysis response:", parsedResponse);
        
        // Ensure the response has the expected structure
        return {
          suitable: !!parsedResponse.suitable,
          explanation: parsedResponse.explanation || "No explanation provided",
          nutrients: parsedResponse.nutrients || this.generateDefaultNutrients(currentWeek),
          detectedItems: parsedResponse.detectedItems || []
        };
      } catch (jsonError) {
        console.error("Error parsing Gemini response:", jsonError, responseText);
        // Fallback to analyzing based on the text response
        return this.analyzeFoodFromText(responseText, currentWeek);
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast.error("Failed to analyze image. Please try again.");
      throw error;
    }
  }

  private analyzeFoodFromText(responseText: string, currentWeek: number): FoodAnalysisResult {
    // Extract food items from the text
    const foodItemsMatch = responseText.match(/detected.*?items.*?:.*?\[(.*?)\]/is);
    const foodItems = foodItemsMatch ? 
      foodItemsMatch[1].split(',').map(item => item.trim().replace(/"/g, '')) : 
      [];
    
    // Determine if the food is suitable
    const suitableMatch = responseText.match(/suitable.*?:\s*(true|false)/i);
    const suitable = suitableMatch ? suitableMatch[1].toLowerCase() === 'true' : false;
    
    // Extract explanation
    const explanationMatch = responseText.match(/explanation.*?:\s*"(.*?)"/is);
    const explanation = explanationMatch ? 
      explanationMatch[1] : 
      `We've analyzed this food for Week ${currentWeek} of your program.`;
    
    // Generate default nutrients
    const nutrients = this.generateDefaultNutrients(currentWeek);
    
    return {
      suitable,
      explanation,
      nutrients,
      detectedItems: foodItems
    };
  }

  private generateDefaultNutrients(currentWeek: number): { label: string; value: string }[] {
    // Mock nutrient data
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
      nutrients.push({ label: "Added Sugar", value: `${Math.floor(Math.random() * 10 + 5)}g` });
    }
    
    return nutrients;
  }

  // This method is kept for backward compatibility
  private analyzeFoodForProgram(foodItems: string[], currentWeek: number): FoodAnalysisResult {
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
    
    // Mock nutrient data
    const nutrients = this.generateDefaultNutrients(currentWeek);
    
    return {
      suitable,
      explanation,
      nutrients,
      detectedItems: foodItems
    };
  }
}

export const googleVisionService = new GoogleVisionService();
