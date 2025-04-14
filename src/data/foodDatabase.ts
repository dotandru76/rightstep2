/**
 * @file src/data/foodDatabase.ts
 * @description Defines a structured list of foods based on the RightStep/Leptin Way principles.
 * Note: This is a representative list and may need expansion. Phase restrictions are indicative.
 */

// Define categories for food items
export enum FoodCategory {
    LeanProtein = "Lean Protein",
    FattyProtein = "Fatty Protein", // e.g., Salmon, fattier cuts - often treated differently
    NonStarchyVegetable = "Non-Starchy Vegetable",
    StarchyVegetable = "Starchy Vegetable",
    Legume = "Legume", // Also Protein/Carb source
    Fruit = "Fruit",
    WholeGrain = "Whole Grain",
    RefinedGrain = "Refined Grain",
    HealthyFat = "Healthy Fat (Concentrated)", // Oils, Avocado, Tahini, Nut Butters
    NutsAndSeeds = "Nuts & Seeds", // Often limited/avoided separately
    Dairy = "Dairy", // May need sub-categories (low-fat/high-fat)
    ProcessedFood = "Processed Food",
    SugarAndSweetener = "Sugar & Sweetener",
    Beverage = "Beverage",
  }
  
  // Define potential program phases or tracks for restriction/allowance notes
  // These are examples; align them with your actual program logic/phases
  export type ProgramPhase =
    | 'all' // Generally allowed throughout (in moderation unless specified)
    | 'cleanse' // Refers to the stricter Leptin Cleanse phase (e.g., Weeks 3-5, potentially extending to 8)
    | 'track1' // Fast Track (Week 9+)
    | 'track2' // Cleansing Track (Week 9+)
    | 'track3' // Moderate Track (Week 9+)
    | 'maintenance'; // After the main program
  
  // Interface for a single food item
  export interface FoodItem {
    name: string;
    category: FoodCategory;
    notes?: string; // General notes, e.g., "skinless", "extra virgin", "in moderation"
    // Phases/Tracks where this food is generally ALLOWED or EMPHASIZED
    // If empty or undefined, assume generally allowed unless specifically discouraged.
    allowedPhases?: ProgramPhase[];
    // Phases/Tracks where this food is generally DISCOURAGED or LIMITED
    discouragedPhases?: ProgramPhase[];
  }
  
  // The Food Database Array
  export const leptinFoodDatabase: FoodItem[] = [
    // --- Proteins ---
    { name: "Chicken Breast", category: FoodCategory.LeanProtein, notes: "Skinless preferred" },
    { name: "Turkey Breast", category: FoodCategory.LeanProtein, notes: "Skinless preferred" },
    { name: "Cod", category: FoodCategory.LeanProtein },
    { name: "Tuna (canned in water/oil)", category: FoodCategory.LeanProtein }, // Oil contributes to fat limit
    { name: "Eggs", category: FoodCategory.LeanProtein },
    { name: "Tofu", category: FoodCategory.LeanProtein },
    { name: "Tempeh", category: FoodCategory.LeanProtein },
    { name: "Salmon", category: FoodCategory.FattyProtein, notes: "Fat generally not restricted like added fats" },
    { name: "Sardines", category: FoodCategory.FattyProtein, notes: "Fat generally not restricted like added fats" },
    { name: "Lean Beef", category: FoodCategory.FattyProtein, notes: "In moderation" },
    { name: "Lean Lamb", category: FoodCategory.FattyProtein, notes: "In moderation" },
  
    // --- Legumes ---
    { name: "Lentils", category: FoodCategory.Legume, allowedPhases: ['all'] }, // Generally good, emphasized Wk4+
    { name: "Chickpeas", category: FoodCategory.Legume, allowedPhases: ['all'] }, // Generally good, emphasized Wk4+
    { name: "Black Beans", category: FoodCategory.Legume, allowedPhases: ['all'] }, // Generally good, emphasized Wk4+
    { name: "Kidney Beans", category: FoodCategory.Legume, allowedPhases: ['all'] }, // Generally good, emphasized Wk4+
  
    // --- Non-Starchy Vegetables --- (Assume generally allowed unless noted)
    { name: "Spinach", category: FoodCategory.NonStarchyVegetable },
    { name: "Kale", category: FoodCategory.NonStarchyVegetable },
    { name: "Lettuce (various)", category: FoodCategory.NonStarchyVegetable },
    { name: "Broccoli", category: FoodCategory.NonStarchyVegetable },
    { name: "Cauliflower", category: FoodCategory.NonStarchyVegetable },
    { name: "Bell Peppers", category: FoodCategory.NonStarchyVegetable },
    { name: "Cucumber", category: FoodCategory.NonStarchyVegetable },
    { name: "Zucchini", category: FoodCategory.NonStarchyVegetable },
    { name: "Celery", category: FoodCategory.NonStarchyVegetable },
    { name: "Mushrooms", category: FoodCategory.NonStarchyVegetable },
    { name: "Onions", category: FoodCategory.NonStarchyVegetable },
    { name: "Garlic", category: FoodCategory.NonStarchyVegetable },
    { name: "Asparagus", category: FoodCategory.NonStarchyVegetable },
    { name: "Green Beans", category: FoodCategory.NonStarchyVegetable },
    { name: "Tomatoes", category: FoodCategory.NonStarchyVegetable },
    { name: "Carrots", category: FoodCategory.NonStarchyVegetable, notes: "Higher sugar, might be limited in some phases" },
  
    // --- Starchy Vegetables ---
    { name: "Sweet Potatoes / Yams", category: FoodCategory.StarchyVegetable, allowedPhases: ['track3', 'maintenance'], discouragedPhases: ['cleanse'], notes: "Allowed in moderation on Track 3 (Week 9+)" },
    { name: "Winter Squash (Butternut, Acorn)", category: FoodCategory.StarchyVegetable, allowedPhases: ['track3', 'maintenance'], discouragedPhases: ['cleanse'], notes: "Allowed in moderation on Track 3 (Week 9+)" },
    { name: "Potatoes", category: FoodCategory.StarchyVegetable, allowedPhases: ['track3', 'maintenance'], discouragedPhases: ['cleanse'], notes: "Avoid during Week 4 cleanse. Allowed in moderation on Track 3 (Week 9+)" },
    { name: "Beets", category: FoodCategory.StarchyVegetable, allowedPhases: ['track3', 'maintenance'], discouragedPhases: ['cleanse'], notes: "Avoid during Week 4 cleanse. Allowed in moderation on Track 3 (Week 9+)" },
    { name: "Corn", category: FoodCategory.StarchyVegetable, allowedPhases: ['track3', 'maintenance'], discouragedPhases: ['cleanse'], notes: "Often discouraged during cleanse. Allowed in moderation on Track 3 (Week 9+)" },
  
    // --- Fruits ---
    { name: "Berries (Strawberries, Blueberries, Raspberries)", category: FoodCategory.Fruit, notes: "Often preferred, potentially less limited during cleanse" },
    { name: "Apple", category: FoodCategory.Fruit, notes: "Limit during cleanse (e.g., 1 piece/day Wk4)" },
    { name: "Pear", category: FoodCategory.Fruit, notes: "Limit during cleanse" },
    { name: "Peach / Plum", category: FoodCategory.Fruit, notes: "Limit during cleanse" },
    { name: "Citrus Fruits (Orange, Grapefruit)", category: FoodCategory.Fruit, notes: "Limit during cleanse" },
    { name: "Banana", category: FoodCategory.Fruit, notes: "Higher sugar, use sparingly or as 'middle way' during cleanse" },
  
    // --- Healthy Fats (Concentrated) ---
    { name: "Avocado", category: FoodCategory.HealthyFat, notes: "Limit to daily total (~2 tbsp) from Week 5" },
    { name: "Olive Oil", category: FoodCategory.HealthyFat, notes: "Extra Virgin. Limit to daily total (~2 tbsp) from Week 5" },
    { name: "Tahini (Whole Sesame)", category: FoodCategory.HealthyFat, notes: "Highly recommended. Limit to daily total (~2 tbsp) from Week 5" },
    { name: "Nut Butters (Almond, Peanut)", category: FoodCategory.HealthyFat, notes: "Natural, no added sugar. Limit to daily total (~2 tbsp) from Week 5. Avoid during Wk 5 nut vacation." },
  
    // --- Nuts & Seeds ---
    { name: "Almonds", category: FoodCategory.NutsAndSeeds, discouragedPhases: ['cleanse'], notes: "Temporary vacation around Week 5. Use in moderation otherwise." },
    { name: "Walnuts", category: FoodCategory.NutsAndSeeds, discouragedPhases: ['cleanse'], notes: "Temporary vacation around Week 5. Use in moderation otherwise." },
    { name: "Chia Seeds", category: FoodCategory.NutsAndSeeds, discouragedPhases: ['cleanse'], notes: "Temporary vacation around Week 5. Use in moderation otherwise." },
    { name: "Flax Seeds", category: FoodCategory.NutsAndSeeds, discouragedPhases: ['cleanse'], notes: "Temporary vacation around Week 5. Use in moderation otherwise." },
    { name: "Pumpkin Seeds", category: FoodCategory.NutsAndSeeds, discouragedPhases: ['cleanse'], notes: "Temporary vacation around Week 5. Use in moderation otherwise." },
  
    // --- Whole Grains ---
    { name: "Quinoa", category: FoodCategory.WholeGrain, allowedPhases: ['track2', 'track3', 'maintenance'], discouragedPhases: ['cleanse'], notes: "Emphasized Wk4+. Allowed Wk 9+ Tracks 2 & 3." },
    { name: "Buckwheat", category: FoodCategory.WholeGrain, allowedPhases: ['track2', 'track3', 'maintenance'], discouragedPhases: ['cleanse'], notes: "Emphasized Wk4+. Allowed Wk 9+ Tracks 2 & 3." },
    { name: "Oats (Rolled, Steel-cut)", category: FoodCategory.WholeGrain, allowedPhases: ['track3', 'maintenance'], discouragedPhases: ['cleanse'], notes: "Allowed in moderation on Track 3 (Week 9+)." },
    { name: "Brown Rice", category: FoodCategory.WholeGrain, allowedPhases: ['track3', 'maintenance'], discouragedPhases: ['cleanse'], notes: "Allowed in moderation on Track 3 (Week 9+). Avoid during Wk 4 cleanse." },
    { name: "Whole Grain Bread (Program Oat Bread)", category: FoodCategory.WholeGrain, allowedPhases: ['all'], notes: "Specific program bread may be allowed early." },
    { name: "Whole Grain Bread (Sourdough, Spelt, Rye)", category: FoodCategory.WholeGrain, allowedPhases: ['track3', 'maintenance'], discouragedPhases: ['cleanse'], notes: "Allowed in moderation on Track 3 (Week 9+)." },
  
    // --- Refined Grains (Discouraged) ---
    { name: "White Bread", category: FoodCategory.RefinedGrain, discouragedPhases: ['all'] },
    { name: "White Pasta", category: FoodCategory.RefinedGrain, discouragedPhases: ['all'] },
    { name: "White Rice", category: FoodCategory.RefinedGrain, discouragedPhases: ['all'], notes: "Especially avoid during cleanse (Wk 4)." },
    { name: "Most Commercial Cereals", category: FoodCategory.RefinedGrain, discouragedPhases: ['all'], notes:"Often high in sugar/refined grains." },
    { name: "Crackers (White Flour)", category: FoodCategory.RefinedGrain, discouragedPhases: ['all'] },
    { name: "Pastries, Cakes, Cookies", category: FoodCategory.RefinedGrain, discouragedPhases: ['all'], notes:"Contain refined flour and sugar." },
  
    // --- Sugars & Sweeteners (Discouraged) ---
    { name: "Table Sugar / Sucrose", category: FoodCategory.SugarAndSweetener, discouragedPhases: ['all'] },
    { name: "High Fructose Corn Syrup", category: FoodCategory.SugarAndSweetener, discouragedPhases: ['all'] },
    { name: "Honey / Maple Syrup / Agave", category: FoodCategory.SugarAndSweetener, discouragedPhases: ['cleanse'], notes: "Use very sparingly outside cleanse, if at all." },
    { name: "Artificial Sweeteners", category: FoodCategory.SugarAndSweetener, discouragedPhases: ['cleanse'], notes: "Potentially discouraged due to hormonal effects." },
    { name: "Candy / Desserts / Ice Cream", category: FoodCategory.SugarAndSweetener, discouragedPhases: ['all'] },
  
    // --- Beverages ---
    { name: "Water", category: FoodCategory.Beverage, allowedPhases: ['all'] },
    { name: "Unsweetened Tea", category: FoodCategory.Beverage, allowedPhases: ['all'] },
    { name: "Unsweetened Coffee", category: FoodCategory.Beverage, notes: "Limit after 12/1 PM for sleep quality." },
    { name: "Soda / Sugary Drinks", category: FoodCategory.Beverage, discouragedPhases: ['all'] },
    { name: "Fruit Juice", category: FoodCategory.Beverage, discouragedPhases: ['all'], notes: "Lacks fiber, concentrates sugar." },
  
    // --- Processed Foods (Discouraged) ---
    { name: "Processed Snacks (Chips, etc.)", category: FoodCategory.ProcessedFood, discouragedPhases: ['all'] },
    { name: "Processed Meats (Sausages, Hot Dogs)", category: FoodCategory.ProcessedFood, discouragedPhases: ['all'] },
    { name: "Ready Meals / Fast Food", category: FoodCategory.ProcessedFood, discouragedPhases: ['all'] },
    { name: "Fried Foods", category: FoodCategory.ProcessedFood, discouragedPhases: ['all'] },
  
    // --- Dairy (Needs more specific guidance from program) ---
    // Example - program might specify low-fat vs full-fat etc.
    { name: "Cheese", category: FoodCategory.Dairy, notes: "Fat not limited like added fats, but consider overall caloric density." },
    { name: "Yogurt (Plain, Unsweetened)", category: FoodCategory.Dairy, notes: "Good protein source. Choose unsweetened." },
    { name: "Milk", category: FoodCategory.Dairy, notes: "Consider low-fat options if limiting overall fat." },
  
  ];
  