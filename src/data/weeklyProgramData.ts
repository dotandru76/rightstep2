
export interface WeekData {
  week: number;
  title: string;
  description: string;
  tasks: string[];
  explanation: string;
}

// Weekly themes for quick reference
export const weeklyProgram: WeekData[] = [
  { 
    week: 1, 
    title: "Water and Drinking", 
    description: "Leptin flooding - 3-4 liters per day",
    tasks: [
      "Drink 8 glasses of water daily (2L minimum)",
      "Drink 2 glasses of water before each meal",
      "Track your water intake throughout the day",
      "Reduce sugary drinks and alcohol consumption"
    ],
    explanation: "Water is the foundation of the Leptin Method. Proper hydration helps regulate hunger hormones, flush toxins, and prepare your body for the journey ahead. Drinking water before meals helps reduce caloric intake by creating a feeling of fullness."
  },
  { 
    week: 2, 
    title: "Cleansing Vegetables", 
    description: "50% of the plate cleansing vegetables",
    tasks: [
      "Fill half your plate with cleansing vegetables at each meal",
      "Focus on leafy greens, broccoli, cauliflower, zucchini",
      "Prepare vegetables in advance for easy access",
      "Experiment with herbs and spices for flavor"
    ],
    explanation: "Cleansing vegetables provide essential nutrients while keeping caloric density low. They create physical volume in your stomach, triggering stretch receptors that signal fullness to your brain."
  },
  { 
    week: 3, 
    title: "Leptin Cleansing", 
    description: "Holiday from sugar, flour, and processed foods",
    tasks: [
      "Eliminate added sugars from your diet",
      "Avoid wheat flour and refined grains",
      "Read food labels to identify hidden sugars",
      "Replace processed foods with whole foods"
    ],
    explanation: "Sugar, flour, and processed foods disrupt the leptin signaling system. This cleansing week helps reset your hormone balance and break the dopamine cycle that drives cravings."
  },
  { 
    week: 4, 
    title: "Leptin Carbohydrates", 
    description: "Legumes, buckwheat, and quinoa",
    tasks: [
      "Introduce healthy complex carbohydrates",
      "Include legumes in at least one meal daily",
      "Replace refined grains with buckwheat and quinoa",
      "Balance carbs with protein and vegetables"
    ],
    explanation: "Not all carbohydrates are created equal. Leptin-friendly carbs are slow-digesting, high in fiber, and support stable blood sugar levels while providing sustained energy."
  },
  { 
    week: 5, 
    title: "Fat Limitation", 
    description: "Limiting to 2 tablespoons of concentrated fat per day",
    tasks: [
      "Limit concentrated fats to 2 tablespoons daily",
      "Choose healthy fats: olive oil, avocado, nuts",
      "Be mindful of hidden fats in processed foods",
      "Use measuring tools to control portions"
    ],
    explanation: "While healthy fats are essential, concentrated fats are calorie-dense. This step helps control caloric intake while ensuring you get sufficient essential fatty acids."
  },
  { 
    week: 6, 
    title: "Eating Habits", 
    description: "Frequency and form of eating",
    tasks: [
      "Eat in a calm, seated position without distractions",
      "Chew each bite thoroughly (at least 20 times)",
      "Put utensils down between bites",
      "Practice mindful eating at each meal"
    ],
    explanation: "How you eat is as important as what you eat. Mindful eating improves digestion, reduces overeating, and enhances satisfaction from meals."
  },
  { 
    week: 7, 
    title: "Frequency Reduction", 
    description: "2-3 meals a day without snacking",
    tasks: [
      "Consolidate eating into 2-3 structured meals",
      "Eliminate snacking between meals",
      "Create a consistent eating schedule",
      "Ensure meals are nutritionally complete"
    ],
    explanation: "Constant snacking keeps insulin levels elevated. Reducing meal frequency allows proper hormonal cycling and promotes fat utilization between meals."
  },
  { 
    week: 8, 
    title: "Renewed Motivation", 
    description: "Strengthening motivation and developing indifference to kryptonite food",
    tasks: [
      "Identify your personal 'kryptonite' foods",
      "Practice exposure without consumption",
      "Develop replacement strategies for cravings",
      "Reconnect with your core motivation"
    ],
    explanation: "This week focuses on the psychological aspects of the journey. Building resilience against trigger foods while reinforcing your motivation creates lasting change."
  },
  { 
    week: 9, 
    title: "Track Selection", 
    description: "Transition to one of the three tracks",
    tasks: [
      "Evaluate your progress and needs",
      "Choose your path: maintenance, continued loss, or healing",
      "Set specific goals for your selected track",
      "Adapt previous principles to your chosen track"
    ],
    explanation: "Based on your progress and personal situation, you'll select the track that best serves your needs: maintenance, continued weight loss, or healing specific health conditions."
  },
  { 
    week: 10, 
    title: "Leptin Deepening", 
    description: "Hormonal balance and energy elevation",
    tasks: [
      "Fine-tune your eating window (10-12 hours)",
      "Optimize protein intake for muscle preservation",
      "Address sleep quality and quantity",
      "Integrate gentle movement daily"
    ],
    explanation: "This week focuses on deeper hormonal optimization, enhancing metabolic flexibility, and ensuring sustainable energy levels throughout the day."
  },
  { 
    week: 11, 
    title: "Supporting Lifestyle", 
    description: "Breathing, power pose, and sleep habits",
    tasks: [
      "Practice 142 breathing before meals (1-4-2 ratio)",
      "Hold power poses for 2 minutes daily",
      "Establish a consistent sleep schedule",
      "Create a sleep-promoting environment"
    ],
    explanation: "Lifestyle factors directly impact hormonal function. Breathing techniques reduce stress, power poses affect cortisol/testosterone balance, and quality sleep is essential for leptin regulation."
  },
  { 
    week: 12, 
    title: "Path Precision", 
    description: "Caloric density and clear boundaries",
    tasks: [
      "Understand caloric density of different foods",
      "Establish clear personal boundaries with food",
      "Create strategies for social eating situations",
      "Practice assertive communication about your needs"
    ],
    explanation: "This week focuses on precision and boundaries. Understanding caloric density helps make informed choices, while clear boundaries protect your progress in various situations."
  },
  { 
    week: 13, 
    title: "Leptin for Life", 
    description: "Developing the Leptin identity and strategies for persistence",
    tasks: [
      "Identify as a person who follows the Leptin lifestyle",
      "Create strategies for challenging situations",
      "Develop a maintenance plan for long-term success",
      "Share your experience to solidify your identity"
    ],
    explanation: "The final week transitions from 'doing' the Leptin Method to 'being' a person who naturally lives this way. Identity-based habits are the key to lifelong maintenance."
  }
];
