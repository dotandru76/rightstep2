
import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon, Camera, UploadIcon, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useProgram } from "@/contexts/ProgramContext";
import { weeklyProgram } from "@/data/weeklyProgramData";
import { Label } from "@/components/ui/label";

const FoodVisualization = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<{
    suitable: boolean;
    explanation: string;
    nutrients: { label: string; value: string; }[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { maxAccessibleWeek } = useProgram();
  
  const currentWeekData = weeklyProgram.find(program => program.week === maxAccessibleWeek) || weeklyProgram[0];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImage(event.target.result as string);
        analyzeFoodImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const analyzeFoodImage = (imageData: string) => {
    setAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      // Mock data - in a real app, this would come from an AI food recognition service
      const mockAnalysisResults = getMockAnalysisResults(maxAccessibleWeek);
      setAnalysis(mockAnalysisResults);
      setAnalyzing(false);
      
      toast.success("Food analysis complete!", {
        description: mockAnalysisResults.suitable 
          ? "This food aligns well with your current program stage." 
          : "This food may not be ideal for your current program stage."
      });
    }, 2500);
  };
  
  const resetAnalysis = () => {
    setImage(null);
    setAnalysis(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Mock function to simulate different analysis results based on program week
  const getMockAnalysisResults = (week: number) => {
    // Different mock analyses based on program week
    const analyses = [
      {
        suitable: true,
        explanation: "This meal contains plenty of hydrating ingredients, which is perfect for Week 1's focus on water and drinking.",
        nutrients: [
          { label: "Calories", value: "320 kcal" },
          { label: "Protein", value: "15g" },
          { label: "Carbs", value: "40g" },
          { label: "Fat", value: "10g" },
          { label: "Water", value: "70%" }
        ]
      },
      {
        suitable: false,
        explanation: "This meal appears to lack the cleansing vegetables that should make up 50% of your plate in Week 2.",
        nutrients: [
          { label: "Calories", value: "550 kcal" },
          { label: "Protein", value: "22g" },
          { label: "Carbs", value: "65g" },
          { label: "Fat", value: "20g" },
          { label: "Fiber", value: "5g" }
        ]
      },
      {
        suitable: true,
        explanation: "This meal appears to be free from sugar, flour, and processed foods, which aligns with Week 3's cleansing focus.",
        nutrients: [
          { label: "Calories", value: "420 kcal" },
          { label: "Protein", value: "25g" },
          { label: "Carbs", value: "30g" },
          { label: "Fat", value: "18g" },
          { label: "Added Sugar", value: "0g" }
        ]
      }
    ];
    
    // Return a random analysis but weighted toward suitability based on week
    // In a real app, this would be real AI analysis
    const randomIndex = Math.floor(Math.random() * analyses.length);
    return analyses[randomIndex];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-purple-500" />
          Analyze Your Food
        </CardTitle>
        <CardDescription>Take a photo of your meal for personalized feedback</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {analyzing ? (
          <div className="bg-purple-50 rounded-lg p-4 space-y-4 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                <img src={image!} alt="Analyzing food" className="w-full h-full object-cover" />
              </div>
              <div className="animate-pulse text-center">
                <p className="text-lg font-medium">Analyzing your food...</p>
                <p className="text-sm text-gray-600">Identifying ingredients and nutritional content</p>
              </div>
            </div>
          </div>
        ) : image && analysis ? (
          <div className="space-y-4">
            <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
              <img src={image} alt="Food" className="w-full h-full object-cover" />
            </div>
            
            <div className={`bg-${analysis.suitable ? 'green' : 'amber'}-50 rounded-lg p-4`}>
              <div className="flex items-start gap-2">
                {analysis.suitable ? (
                  <CheckCircle className={`h-5 w-5 text-green-500 mt-0.5`} />
                ) : (
                  <AlertCircle className={`h-5 w-5 text-amber-500 mt-0.5`} />
                )}
                <div>
                  <h4 className="font-medium">{analysis.suitable ? 'Good Choice' : 'Could Be Better'}</h4>
                  <p className="text-sm text-gray-600">{analysis.explanation}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border p-4">
              <h4 className="font-medium mb-2">Nutritional Information</h4>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                {analysis.nutrients.map((nutrient, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-sm text-gray-600">{nutrient.label}:</span>
                    <span className="text-sm font-medium">{nutrient.value}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium mb-1">Current Program Focus: Week {maxAccessibleWeek}</h4>
              <p className="text-sm text-gray-600">{currentWeekData.title} - {currentWeekData.description}</p>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center space-y-4">
            <div className="flex flex-col items-center gap-2">
              <Camera className="h-8 w-8 text-gray-400" />
              <h3 className="font-medium">Capture or Upload Your Food</h3>
              <p className="text-sm text-gray-500">Get personalized feedback based on your program stage</p>
            </div>
            
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button 
                variant="outline" 
                onClick={handleCameraCapture}
                className="flex items-center gap-2"
              >
                <Camera className="h-4 w-4" />
                Take Photo
              </Button>
              <Button 
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2" 
              >
                <UploadIcon className="h-4 w-4" />
                Upload Image
              </Button>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                ref={fileInputRef}
                className="hidden"
                capture="environment"
              />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {(image && analysis) ? (
          <Button 
            variant="outline" 
            onClick={resetAnalysis} 
            className="w-full"
          >
            Analyze Another Food
          </Button>
        ) : (
          <p className="text-xs text-center text-gray-500 w-full">
            Get AI-powered feedback on your food choices based on your current program week ({maxAccessibleWeek}/13)
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default FoodVisualization;
