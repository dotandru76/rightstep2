
import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon, Camera, UploadIcon, CheckCircle, AlertCircle, Settings } from "lucide-react";
import { toast } from "sonner";
import { useProgram } from "@/contexts/ProgramContext";
import { weeklyProgram } from "@/data/weeklyProgramData";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { googleVisionService } from "@/services/GoogleVisionService";

const FoodVisualization = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<{
    suitable: boolean;
    explanation: string;
    nutrients: { label: string; value: string; }[];
    detectedItems?: string[];
  } | null>(null);
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [apiKey, setApiKey] = useState(googleVisionService.getApiKey() || "");
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
  
  const analyzeFoodImage = async (imageData: string) => {
    // Check if API key is set
    if (!googleVisionService.getApiKey()) {
      setApiKeyDialogOpen(true);
      return;
    }
    
    setAnalyzing(true);
    
    try {
      // Use the Google Vision service to analyze the image
      const result = await googleVisionService.analyzeImage(imageData, maxAccessibleWeek);
      setAnalysis(result);
      
      toast.success("Food analysis complete!", {
        description: result.suitable 
          ? "This food aligns well with your current program stage." 
          : "This food may not be ideal for your current program stage."
      });
    } catch (error) {
      console.error("Error analyzing image:", error);
      // Error is already handled in the service with a toast
    } finally {
      setAnalyzing(false);
    }
  };
  
  const resetAnalysis = () => {
    setImage(null);
    setAnalysis(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const saveApiKey = () => {
    if (apiKey.trim()) {
      googleVisionService.setApiKey(apiKey.trim());
      setApiKeyDialogOpen(false);
      toast.success("API Key saved");
      
      // If there's a pending image analysis, restart it
      if (image) {
        analyzeFoodImage(image);
      }
    } else {
      toast.error("Please enter a valid API key");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-purple-500" />
            Analyze Your Food
          </CardTitle>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setApiKeyDialogOpen(true)}
            title="Set Google Vision API Key"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
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
            
            {analysis.detectedItems && analysis.detectedItems.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Detected Items</h4>
                <div className="flex flex-wrap gap-1">
                  {analysis.detectedItems.map((item, index) => (
                    <span 
                      key={index} 
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
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

      {/* API Key Dialog */}
      <Dialog open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Google Vision API Key</DialogTitle>
            <DialogDescription>
              Enter your Google Vision API key to enable food analysis.
              You can get an API key from the Google Cloud Console.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                placeholder="Enter your Google Vision API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            <p className="text-xs text-gray-500">
              Your API key is stored locally on your device and is only used to make requests to the Google Vision API.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setApiKeyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveApiKey}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default FoodVisualization;
