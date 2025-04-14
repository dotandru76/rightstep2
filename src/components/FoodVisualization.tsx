// src/components/FoodVisualization.tsx

import React, { useState, useRef, useMemo, useContext } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // Adjust path
import { Button } from "@/components/ui/button"; // Adjust path
import { ImageIcon, Camera, UploadIcon, CheckCircle, AlertCircle, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ProgramContext } from "@/contexts/ProgramContext"; // Adjust path
import { weeklyProgram, TOTAL_PROGRAM_WEEKS } from "@/data/weeklyProgramData"; // Adjust path

// --- MODIFIED IMPORT ---
import { getGoogleVisionServiceInstance, FoodAnalysisResult } from "@/services/GoogleVisionService"; // Adjust path
// ----------------------
import { foodLogService } from "@/services/FoodLogService"; // Adjust path

// --- Capacitor Camera Import ---
// *** IMPORTANT: Install this -> npm install @capacitor/camera ***
import { Camera as CapacitorCamera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
// -----------------------------

interface FoodVisualizationProps { className?: string; }

const FoodVisualization: React.FC<FoodVisualizationProps> = ({ className }) => {
  const [image, setImage] = useState<string | null>(null); // base64 data URL
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<FoodAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentWeek } = useContext(ProgramContext);
  const displayWeek = currentWeek ?? 1;
  const currentWeekData = useMemo(() => weeklyProgram.find(p => p.week === displayWeek) || weeklyProgram[0], [displayWeek]);

  // Process image data (base64 string)
  const processImageResult = (imageDataUrl: string | undefined) => {
      if (imageDataUrl) {
        setImage(imageDataUrl);
        analyzeFoodImage(imageDataUrl);
      } else {
        toast.error("Could not get image data.");
      }
  };

  // Handle file input selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error("Please select an image file"); return; }
    const reader = new FileReader();
    reader.onload = (event) => processImageResult(event.target?.result as string | undefined);
    reader.readAsDataURL(file);
  };

  // Handle native camera capture
  const handleCameraCapture = async () => {
      try {
          const imageResult: Photo = await CapacitorCamera.getPhoto({
              quality: 90,
              allowEditing: false,
              resultType: CameraResultType.DataUrl,
              source: CameraSource.Camera
          });
          processImageResult(imageResult.dataUrl);
      } catch (error: any) {
          console.error("Capacitor Camera error:", error);
          if (error.message !== 'User cancelled photos app' && error.message !== 'cancelled') {
              toast.error(`Camera Error: ${error.message || "Could not access camera."}`);
          }
      }
  };

  // Trigger hidden file input for upload
  const handleUploadClick = () => fileInputRef.current?.click();

  // Reset component state
  const resetAnalysis = () => {
    setImage(null); setAnalysis(null); setAnalyzing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Call the backend via the refactored service
  const analyzeFoodImage = async (imageDataUrl: string) => {
    setAnalyzing(true);
    setAnalysis(null); // Clear previous results
    try {
      // --- USE GETTER FUNCTION ---
      const result = await getGoogleVisionServiceInstance().analyzeImage(imageDataUrl, displayWeek);
      // --------------------------
      setAnalysis(result);
      // toast.success("Analysis complete!"); // Optional success toast
    } catch (error: any) {
      console.error("Error analyzing image:", error);
      setAnalysis(null); // Clear analysis on error
      // Error toast is shown by the service
    } finally {
      setAnalyzing(false);
    }
  };

  // Save analysis result to local storage log
  const saveToFoodLog = () => {
    if (!analysis || !image) { toast.error("No result to save."); return; }
    // TODO: Implement image upload to Firebase Storage here if desired
    // const imageUrlForLog = await uploadImageToFirebaseStorage(image); // Example
    const imageUrlForLog = undefined; // Not saving image URL for now

    const calories = foodLogService.extractCalories(analysis.nutrients); // Nutrients array from backend is empty

    foodLogService.saveEntry({
      timestamp: Date.now(),
      foodItems: analysis.detectedItems || [],
      calories,
      imageUrl: imageUrlForLog,
      suitable: analysis.suitable
    });
    toast.success("Added to food log");
    resetAnalysis(); // Reset after saving
  };

  // --- Render Component ---
  return (
    <Card className={`shadow-md ${className}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-purple-500" />
            Analyze Your Food
          </CardTitle>
          {/* Settings/API Key Button REMOVED */}
        </div>
        <CardDescription>Take or upload a photo for AI feedback for Week {displayWeek}.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
         {/* Analyzing State */}
         {analyzing && image && ( <div className="rounded-lg p-4 space-y-4 text-center min-h-[300px] flex flex-col items-center justify-center bg-purple-50/50"><div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center animate-pulse"><img src={image} alt="Analyzing food" className="w-full h-full object-cover opacity-75" /></div><div className="text-center mt-4"><p className="text-lg font-semibold text-purple-700 flex items-center justify-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> Analyzing...</p><p className="text-sm text-gray-600 mt-1">Identifying food items...</p></div></div> )}
         {/* Result State */}
         {!analyzing && image && analysis && ( <div className="space-y-4"><div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden border"><img src={image} alt="Analyzed food" className="w-full h-full object-cover" /></div><div className={`border ${analysis.suitable ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'} rounded-lg p-4`}><div className="flex items-start gap-3">{analysis.suitable ? <CheckCircle className="h-6 w-6 text-green-600 mt-0 flex-shrink-0" /> : <AlertCircle className="h-6 w-6 text-yellow-600 mt-0 flex-shrink-0" />}<div className='flex-1'><h4 className={`font-semibold ${analysis.suitable ? 'text-green-800' : 'text-yellow-800'}`}>{analysis.suitable ? 'Looks Suitable' : 'Consider Alternatives'}</h4><p className="text-sm text-gray-700 mt-0.5">{analysis.explanation}</p></div></div></div>{analysis.detectedItems && analysis.detectedItems.length > 0 && ( <div className="bg-blue-50 border border-blue-200 rounded-lg p-4"><h4 className="font-medium mb-2 text-blue-800">Detected Items</h4><div className="flex flex-wrap gap-1.5">{analysis.detectedItems.map((item, index) => ( <span key={index} className="bg-blue-100 text-blue-900 text-xs font-medium px-2.5 py-1 rounded-full">{item}</span> ))}</div></div> )}<Button onClick={saveToFoodLog} className="w-full bg-purple-600 hover:bg-purple-700 text-white"><Save className="h-4 w-4 mr-2" /> Save to Today's Log</Button></div> )}
         {/* Initial State */}
         {!analyzing && !image && ( <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center space-y-4 min-h-[300px] flex flex-col justify-center"><div className="flex flex-col items-center gap-2"><Camera className="h-10 w-10 text-gray-400" /><h3 className="font-semibold text-lg">Analyze Your Meal</h3><p className="text-sm text-gray-500">Get AI feedback based on Week {displayWeek}</p></div><div className="flex flex-col gap-3 sm:flex-row sm:justify-center"><Button variant="default" onClick={handleCameraCapture} className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white"><Camera className="h-4 w-4" /> Take Photo</Button><Button variant="outline" onClick={handleUploadClick} className="flex items-center gap-2"><UploadIcon className="h-4 w-4" /> Upload Image</Button><input type="file" accept="image/*" onChange={handleFileSelect} ref={fileInputRef} className="hidden" /></div></div> )}
      </CardContent>
      <CardFooter>
        {image && !analyzing ? ( <Button variant="outline" onClick={resetAnalysis} className="w-full">Analyze Another Food</Button> )
         : !image && !analyzing ? ( <p className="text-xs text-center text-gray-500 w-full">AI analysis helps align choices with your program focus for Week {displayWeek} / {TOTAL_PROGRAM_WEEKS}.</p> )
         : null}
      </CardFooter>
      {/* API Key Dialog REMOVED */}
    </Card>
  );
};

export default FoodVisualization;