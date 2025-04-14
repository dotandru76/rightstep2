// functions/src/index.ts - Removed unused v1 'functions' import

// Use v2 imports
import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
// Removed: import * as functions from "firebase-functions";

// Import v2 Parameter config
import { defineString } from 'firebase-functions/params';

// Import Google AI SDK
import {
    GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, Part, Content, GenerateContentRequest
} from "@google/generative-ai";

// Interfaces (remain the same)
interface AnalyzeImageData { imageData: string; currentWeek: number; }
export interface FoodAnalysisResult { suitable: boolean; explanation: string; nutrients: { label: string; value: string; }[]; detectedItems: string[]; }

// --- Define the API Key Parameter ---
// Reads from GEMINI_API_KEY environment variable (set via .env.project-id file during deploy)
const geminiApiKey = defineString("GEMINI_API_KEY");
// ------------------------------------

// --- HTTPS Callable Function Definition (v2 Style) ---
export const analyzeFoodImage = onCall(
  // Add options like region if needed: { region: 'us-central1' }
  async (request): Promise<FoodAnalysisResult> => {

    const data = request.data as AnalyzeImageData;
    const auth = request.auth;
    logger.info("Function invoked (v2). Input:", { week: data?.currentWeek, imageSize: data?.imageData?.length, auth: auth ? `UID: ${auth.uid}`: 'Unauthenticated' });

    // --- Initialize Gemini Client *inside* the function ---
    // Access the API key parameter using .value()
    const API_KEY = geminiApiKey.value();
    let genAI: GoogleGenerativeAI | null = null;
    let model: ReturnType<GoogleGenerativeAI['getGenerativeModel']> | null = null;

    // Check if key exists before initializing
    if (API_KEY) {
        try {
            genAI = new GoogleGenerativeAI(API_KEY);
            model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            logger.info("Gemini AI Client Initialized for this request.");
        } catch(initError) {
            logger.error("Failed to initialize GoogleGenerativeAI inside function:", initError);
            throw new HttpsError("internal", "AI Client Initialization Failed.");
        }
    } else {
         // This case should ideally not happen if deployment requires the env var,
         // but handle defensively. Check deployment logs if this error appears.
         logger.error("CRITICAL: Gemini API Key parameter was not resolved.");
         throw new HttpsError("internal", "AI Service Configuration Error.");
    }

    // Check if model was successfully initialized
    if (!model) {
        logger.error("Gemini model could not be initialized (Should not happen if API Key resolved).");
        throw new HttpsError("internal", "AI model is not configured correctly.");
    }
    // --- End Client Initialization ---

    // Validate input data
    if (!data?.imageData || typeof data.imageData !== "string") { throw new HttpsError("invalid-argument", "Image data missing/invalid."); }
    const currentWeek = (typeof data.currentWeek === 'number' && data.currentWeek >= 1 && data.currentWeek <= 12) ? data.currentWeek : 1;
    const base64Image = data.imageData.replace(/^data:image\/\w+;base64,/, "");

    // Construct Prompt & Image Part
    const textPrompt = `Analyze food items in image. Week ${currentWeek}/12 of healthy program emphasizing whole foods. Based ONLY on visual contents, list primary food items and state if meal seems suitable (true/false) for this stage, with brief explanation. Respond ONLY with valid JSON: {"detectedItems": ["list"], "suitable": boolean, "explanation": "brief reason"}`;
    const imagePart: Part = { inlineData: { data: base64Image, mimeType: "image/jpeg" } }; // Corrected mimeType
    const textPart: Part = { text: textPrompt };
    const safetySettings = [
         { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
         { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
         { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
         { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
     ];
    const generationConfig = { temperature: 0.3, maxOutputTokens: 512 };
    const contents: Content[] = [{ role: "user", parts: [textPart, imagePart] }]; // Corrected contents structure
    const requestPayload: GenerateContentRequest = { contents, safetySettings, generationConfig };

    logger.info("Sending request to Gemini...");
    try {
        // Call Gemini API
        const result = await model.generateContent(requestPayload);
        const response = result.response;
        if (!response?.candidates?.[0]?.content) { throw new HttpsError("internal", "AI response blocked/empty.");}
        const responseText = response.text();
        logger.info("Raw Gemini response text:", responseText);

        // Process Response
        let parsedResponse: Partial<FoodAnalysisResult> = {};
        try {
            const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
            const jsonString = jsonMatch ? jsonMatch[1].trim() : responseText.trim();
            if (!jsonString.startsWith('{') || !jsonString.endsWith('}')) throw new Error("Response not valid JSON.");
            parsedResponse = JSON.parse(jsonString);
            if (typeof parsedResponse.suitable !== 'boolean' || !Array.isArray(parsedResponse.detectedItems)) throw new Error("Parsed JSON missing fields.");
        } catch (parseError: unknown) {
            const message = parseError instanceof Error ? parseError.message : String(parseError);
            throw new HttpsError("internal", `Failed AI response format: ${message}`, { rawResponse: responseText });
        }

        // Return Success
        const finalResult: FoodAnalysisResult = {
            suitable: parsedResponse.suitable,
            explanation: parsedResponse.explanation || "AI analysis complete.",
            detectedItems: parsedResponse.detectedItems,
            nutrients: [],
        };
        logger.info("Returning successful analysis:", finalResult);
        return finalResult;

    } catch (error: unknown) {
        logger.error("Error calling Gemini or processing:", error);
        if (error instanceof HttpsError) throw error;
        const message = error instanceof Error ? error.message : String(error);
        throw new HttpsError("internal", `Unexpected analysis error: ${message}`);
    }
  }
);