// src/services/GoogleVisionService.ts
console.log("--- GoogleVisionService.ts START (module load) ---"); // For debugging load order

import { toast } from "sonner";
import { getFunctions, httpsCallable, FunctionsError } from "firebase/functions";
// import { app } from '@/firebaseConfig'; // Import app if needed for getFunctions explicit pass

// Interfaces matching Cloud Function
interface AnalyzeImageData { imageData: string; currentWeek: number; }
export interface FoodAnalysisResult { suitable: boolean; explanation: string; nutrients: { label: string; value: string; }[]; detectedItems: string[]; }

class GoogleVisionService {
  private functions;
  private analyzeImageFunction;

  constructor() {
    console.log("--- GoogleVisionService.ts constructor START ---"); // For debugging load order
    try {
        console.log("--- GoogleVisionService.ts: Calling getFunctions() ---"); // For debugging load order
        this.functions = getFunctions(/* app */); // Pass app if needed
        console.log("--- GoogleVisionService.ts: getFunctions() Succeeded ---"); // For debugging load order

        this.analyzeImageFunction = httpsCallable<AnalyzeImageData, FoodAnalysisResult>(
            this.functions,
            'analyzeFoodImage' // Matches deployed function name
        );
        console.log("--- GoogleVisionService.ts: Callable reference created. ---"); // For debugging load order
    } catch (error) {
         console.error("--- GoogleVisionService.ts: ERROR in constructor initializing Functions! ---", error);
         throw new Error(`Firebase Functions could not be initialized: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Calls the backend Cloud Function
  async analyzeImage(imageData: string, currentWeek: number): Promise<FoodAnalysisResult> {
    console.log("--- GoogleVisionService.ts: analyzeImage method called ---"); // For debugging load order
    const base64Image = imageData.replace(/^data:image\/\w+;base64,/, "");
    const requestData: AnalyzeImageData = { imageData: base64Image, currentWeek: currentWeek };

    try {
      console.log("--- GoogleVisionService.ts: Calling backend function 'analyzeFoodImage' ---");
      const result = await this.analyzeImageFunction(requestData);
      console.log("--- GoogleVisionService.ts: Received response from backend:", result.data);

      const analysisResult = result.data as FoodAnalysisResult;
       if (typeof analysisResult?.suitable !== 'boolean' || !Array.isArray(analysisResult?.detectedItems) || !Array.isArray(analysisResult?.nutrients)) {
          console.error("Invalid response structure received from backend:", analysisResult);
          throw new Error("Received invalid analysis format from the server.");
       }
      return analysisResult;

    } catch (error: any) {
      console.error("--- GoogleVisionService.ts: Error calling backend function:", error);
      let errorMessage = "Failed to analyze image. Please try again.";
      if (error instanceof FunctionsError) { errorMessage = error.message || errorMessage; }
      else if (error instanceof Error) { errorMessage = error.message; }
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }
}

// --- Corrected EXPORT: Use a getter function for lazy initialization ---
console.log("--- GoogleVisionService.ts END (before instance getter export) ---"); // For debugging load order
let serviceInstance: GoogleVisionService | null = null;

// *** THIS FUNCTION MUST BE EXPORTED ***
export function getGoogleVisionServiceInstance(): GoogleVisionService {
  if (!serviceInstance) {
    console.log("--- GoogleVisionService.ts: Creating service instance NOW ---"); // For debugging load order
    // The constructor runs here, after Firebase init
    serviceInstance = new GoogleVisionService();
  }
  return serviceInstance;
}
// -----------------------------------------------------------------------