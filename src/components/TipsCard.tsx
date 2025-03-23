
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LightbulbIcon, RefreshCw } from "lucide-react";

const TipsCard = () => {
  const tips = [
    "Every time you choose a Leptin meal, you strengthen your Leptin identity",
    "If you feel hungry, make sure you've eaten enough cleansing vegetables and protein in your last meal",
    "Most weight gain after an indulgence meal is from fluids, not fat",
    "Remember the difference between 'mouth hunger' (dopamine) and 'stomach hunger' (real need)",
    "142 breathing before a meal can significantly reduce hunger and cravings",
    "It's important to distinguish between a slip and failure - the true Leptin follower learns from every slip",
    "Maintain the Leptin shield even during challenging periods: water, vegetables, organized meals, eating window",
    "Drinking water before each meal reduces caloric intake by 30% on average",
    "Staying in a power pose (hands on hips) for 2 minutes lowers cortisol and raises testosterone",
    "Talking about your difficulties with others is one of the most powerful tools for dealing with breaking points",
    "Excessive variety in meals increases eating amount by 40% - choose 5-8 regular meals",
    "One of the keys to long-term success is filling the 4 stages of motivation: pain, pleasure, growth, and identity",
  ];

  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const getRandomTip = () => {
    const newIndex = Math.floor(Math.random() * tips.length);
    setCurrentTipIndex(newIndex);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LightbulbIcon className="h-5 w-5 text-yellow-500" />
          Leptin Tip
        </CardTitle>
        <CardDescription>Tips and recommendations for a successful Leptin lifestyle</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 rounded-lg p-4 min-h-[100px] flex items-center">
          <p className="text-center w-full">{tips[currentTipIndex]}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={getRandomTip} className="w-full flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          New Tip
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TipsCard;
