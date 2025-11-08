
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this example, we'll log an error. The app will still run,
  // but AI features will fail.
  console.error("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateDesignIdea = async (prompt: string): Promise<string> => {
  if (!API_KEY) {
    return Promise.resolve("AI features are disabled. API key is missing.");
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a short, creative, and visually descriptive design idea for a t-shirt based on the following prompt: "${prompt}". Describe the visual elements, not just the concept. For example, instead of "a cool cat", say "A cat wearing sunglasses and a leather jacket, riding a skateboard."`,
      config: {
        temperature: 0.8,
        maxOutputTokens: 100,
        // Fix: When using maxOutputTokens with the gemini-2.5-flash model, a thinkingBudget must be set to reserve tokens for the final output.
        thinkingConfig: { thinkingBudget: 25 },
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating design idea:", error);
    return "Sorry, I couldn't come up with an idea right now. Please try again.";
  }
};
