
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { Droplets, BookOpen, CalendarCheck, Star, LineChart, Info, MenuSquare } from "lucide-react";
import WeeklyProgress from "@/components/WeeklyProgress";
import WaterTracker from "@/components/WaterTracker";
import DailyHabits from "@/components/DailyHabits";
import TipsCard from "@/components/TipsCard";

const Index = () => {
  const navigate = useNavigate();
  const [currentWeek, setCurrentWeek] = useState(1);
  const [selectedTab, setSelectedTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">The Leptin Method</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/journal")}>
              Journal
            </Button>
            <Button variant="outline" onClick={() => navigate("/profile")}>
              My Profile
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
        <Tabs defaultValue="overview" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tracks">Tracks</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Welcome to the Leptin Method</CardTitle>
                <CardDescription>The journey to hormonal balance, health, and weight loss</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  The Leptin Method is a holistic program for hormonal balance and healthy nutrition based on understanding the connection 
                  between foods and the "blocking effect" - a condition where we lose our sense of fullness and get stuck in a cycle of 
                  constant hunger and cravings.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Droplets className="text-blue-500 h-5 w-5" />
                    <span>Leptin Flooding - Water and cleansing vegetables</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="text-blue-500 h-5 w-5" />
                    <span>Avoiding foods that trigger the blocking effect</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="text-blue-500 h-5 w-5" />
                    <span>Defined eating window</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="text-blue-500 h-5 w-5" />
                    <span>Developing a Leptin identity</span>
                  </div>
                </div>
                <p>
                  The program is based on 9 weeks of Leptin cleansing followed by a transition to one of three tracks to continue 
                  the change and maintain the results.
                </p>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button onClick={() => setSelectedTab("tracks")}>Explore the Tracks</Button>
                <Button variant="outline" onClick={() => navigate("/education")}>Full Educational Materials</Button>
              </CardFooter>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <WaterTracker />
              <DailyHabits />
            </div>
            
            <TipsCard />
          </TabsContent>
          
          <TabsContent value="tracks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>The Three Tracks</CardTitle>
                <CardDescription>After 9 weeks of Leptin cleansing, choose the track that suits you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border rounded-lg p-4 bg-blue-50">
                  <h3 className="text-lg font-bold text-blue-800 mb-2">The Fast Track</h3>
                  <p className="mb-4">The Fast Track includes:</p>
                  <ul className="list-disc ml-5 space-y-2">
                    <li>Water</li>
                    <li>Cleansing vegetables</li>
                    <li>Proteins</li>
                    <li>Legumes</li>
                  </ul>
                  <p className="mt-2 text-sm">* Allows for the fastest rate of weight loss</p>
                </div>
                
                <div className="border rounded-lg p-4 bg-green-50">
                  <h3 className="text-lg font-bold text-green-800 mb-2">The Cleansing Track</h3>
                  <p className="mb-4">The Cleansing Track includes:</p>
                  <ul className="list-disc ml-5 space-y-2">
                    <li>Water</li>
                    <li>Cleansing vegetables</li>
                    <li>Proteins</li>
                    <li>Legumes</li>
                    <li>Buckwheat and quinoa</li>
                  </ul>
                  <p className="mt-2 text-sm">* Balances between weight loss rate and nutritional variety</p>
                </div>
                
                <div className="border rounded-lg p-4 bg-purple-50">
                  <h3 className="text-lg font-bold text-purple-800 mb-2">The Moderate Track</h3>
                  <p className="mb-4">The Moderate Track includes:</p>
                  <ul className="list-disc ml-5 space-y-2">
                    <li>Water</li>
                    <li>Cleansing vegetables</li>
                    <li>Proteins</li>
                    <li>Legumes</li>
                    <li>Buckwheat and quinoa</li>
                    <li>Quarter plate of: rice, potatoes, sweet potatoes, beets, corn, whole wheat flour, oats</li>
                  </ul>
                  <p className="mt-2 text-sm">* Slower weight loss, but with more flexibility and variety</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => navigate("/path-selection")}>Choose Your Track</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="tools" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Coping Tools</CardTitle>
                <CardDescription>Practical techniques and tools for dealing with challenges along the way</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-bold mb-2">Dealing with Breaking Points</h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="bg-blue-100 text-blue-700 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-1">1</div>
                      <div>
                        <h4 className="font-medium">Mental Distraction</h4>
                        <p className="text-sm">Go for a walk, take a shower, engage in a hobby, anything that stops the mental and emotional pattern of eating</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-blue-100 text-blue-700 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-1">2</div>
                      <div>
                        <h4 className="font-medium">Human Connection</h4>
                        <p className="text-sm">Share your difficulty with others at that moment, not in retrospect. Right before "breaking", share a message in chat or group</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-blue-100 text-blue-700 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-1">3</div>
                      <div>
                        <h4 className="font-medium">The Middle Way</h4>
                        <p className="text-sm">Find a compromise that dopamine will agree to, such as a banana with a teaspoon of peanut butter instead of cookies</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-bold mb-2">The Leptin Shield</h3>
                  <p className="mb-3">Basic principles for protection during challenging periods:</p>
                  <ul className="list-disc ml-5 space-y-1">
                    <li>Water before each meal and throughout the day</li>
                    <li>Cleansing vegetables (at least 50% of the plate)</li>
                    <li>Organized meals (2-3 per day)</li>
                    <li>Defined eating window (8-12 hours)</li>
                  </ul>
                  <p className="mt-2 text-sm">* Even during challenging periods, the shield will help you not gain weight and maintain hormonal balance</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-bold mb-2">Techniques for Hormonal Balance</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium">142 Breathing</h4>
                      <p className="text-sm">1 second inhale, 4 seconds hold, 2 seconds exhale. 4-5 cycles before meals to reduce cortisol and cravings</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Power Pose</h4>
                      <p className="text-sm">2 minutes standing in a power pose (hands on hips) to increase testosterone and reduce cortisol</p>
                    </div>
                    <div>
                      <h4 className="font-medium">BLISS Model</h4>
                      <p className="text-sm">Small Bites, Long chewing, Idle hands, Sequential eating, Stay focused</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => navigate("/tools")}>All Tools and Techniques</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="progress" className="space-y-6">
            <WeeklyProgress currentWeek={currentWeek} setCurrentWeek={setCurrentWeek} />
            
            <Card>
              <CardHeader>
                <CardTitle>My Leptin Identity</CardTitle>
                <CardDescription>Developing a Leptin identity is the key to long-term success</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>The four stages of motivation for long-term success:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-3 bg-gray-50">
                      <h3 className="font-bold">Pain Motivation</h3>
                      <p className="text-sm">Recognizing the discomfort and difficulties we had before the process</p>
                    </div>
                    
                    <div className="border rounded-lg p-3 bg-gray-50">
                      <h3 className="font-bold">Pleasure Motivation</h3>
                      <p className="text-sm">A clear vision of the better life we are creating</p>
                    </div>
                    
                    <div className="border rounded-lg p-3 bg-gray-50">
                      <h3 className="font-bold">Growth Motivation</h3>
                      <p className="text-sm">Enjoying the process of learning and personal development</p>
                    </div>
                    
                    <div className="border rounded-lg p-3 bg-gray-50">
                      <h3 className="font-bold">Identity Motivation</h3>
                      <p className="text-sm">Integrating being Leptin as part of self-identity: "This is who I am"</p>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4" onClick={() => navigate("/identity")}>
                    Complete My Identity Worksheet
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
