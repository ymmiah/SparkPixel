
import { GoogleGenAI } from "@google/genai";

const getApiKey = (): string | undefined => {
  return process.env.API_KEY || process.env.GEMINI_API_KEY;
};

let genAIClient: GoogleGenAI | null = null;

const getGenAIClient = (): GoogleGenAI | null => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({ apiKey });
  }
  return genAIClient;
};

// Fallback ideas generator when API key is not configured
const generateFallbackIdea = (prompt: string): string => {
  const cleanPrompt = prompt.trim().toLowerCase();
  const variations = [
    `A vibrant minimalist emblem featuring "${prompt}" with bold geometric accent lines and modern retro colors.`,
    `A hand-drawn vintage illustration of "${prompt}" enclosed in an ornate circular badge with distressed typography.`,
    `A cyberpunk neon aesthetic depicting "${prompt}" with luminous cyan and magenta glow effects on a sleek background.`,
    `An artistic watercolor splash artwork centered around "${prompt}" with soft pastel gradients and subtle ink splatter highlights.`,
    `A playful pop-art graphic featuring "${prompt}" with bold halftone dots and high-contrast comic book styling.`
  ];
  const index = Math.abs(cleanPrompt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % variations.length;
  return variations[index];
};

export const generateDesignIdea = async (prompt: string): Promise<string> => {
  const trimmed = prompt.trim();
  if (!trimmed) {
    return "Please enter a theme or keywords to generate creative design ideas.";
  }

  const ai = getGenAIClient();
  if (!ai) {
    // Provide a rich creative concept fallback
    return generateFallbackIdea(trimmed);
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a concise, highly creative, and visually descriptive design idea for custom merchandise based on the prompt: "${trimmed}". Describe specific visual elements, layout, colors, and art style in 2-3 engaging sentences.`,
      config: {
        temperature: 0.8,
        maxOutputTokens: 200,
        thinkingConfig: { thinkingBudget: 25 },
      }
    });

    if (response.text && response.text.trim().length > 0) {
      return response.text.trim();
    }
    return generateFallbackIdea(trimmed);
  } catch (error) {
    console.warn("Gemini API call encountered an issue, using creative fallback:", error);
    return generateFallbackIdea(trimmed);
  }
};

