import { GoogleGenAI } from "@google/genai";
import { DesignElement } from "../types";

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

export interface AICopyResult {
  taglines: string[];
  bio: string;
  bulletPoints: string[];
  callToAction: string;
}

export const generateAICopy = async (businessName: string, industry: string, targetAudience: string): Promise<AICopyResult> => {
  const ai = getGenAIClient();
  if (!ai) {
    // Intelligent contextual fallback
    return {
      taglines: [
        `Elevate Your Everyday with ${businessName}`,
        `Precision. Passion. Perfection.`,
        `The Future of ${industry || 'Excellence'}, Today.`,
        `Crafted for ${targetAudience || 'Visionaries'}.`
      ],
      bio: `${businessName} provides industry-leading ${industry || 'solutions'} designed specifically for ${targetAudience || 'modern clients'}. We blend craftsmanship with innovation.`,
      bulletPoints: [
        `✓ Premium Quality & Uncompromised Standards`,
        `✓ Personalized Solutions Tailored to Your Goals`,
        `✓ Dedicated Support & Seamless Experience`
      ],
      callToAction: `Book Your Free Consultation Today at www.${businessName.toLowerCase().replace(/\s+/g, '')}.com`
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert marketing copywriter for a print & merchandise design platform (like Vistaprint).
Create crisp marketing copy for business cards and marketing flyers for:
Business Name: "${businessName}"
Industry: "${industry}"
Target Audience: "${targetAudience}"

Format your response strictly as JSON with this schema:
{
  "taglines": ["tagline 1", "tagline 2", "tagline 3"],
  "bio": "A concise 2-sentence bio for a flyer or card back",
  "bulletPoints": ["bullet 1", "bullet 2", "bullet 3"],
  "callToAction": "A compelling 1-line call to action"
}`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 400,
        thinkingConfig: { thinkingBudget: 25 },
        responseMimeType: "application/json"
      }
    });

    if (response.text) {
      try {
        const parsed = JSON.parse(response.text);
        return {
          taglines: parsed.taglines || [`Empowering ${businessName}`],
          bio: parsed.bio || `${businessName} delivers quality.`,
          bulletPoints: parsed.bulletPoints || [`✓ Reliable`, `✓ Innovative`, `✓ Trusted`],
          callToAction: parsed.callToAction || `Visit us online today.`
        };
      } catch (e) {
        console.warn("JSON parse error from Gemini copywriter:", e);
      }
    }
  } catch (err) {
    console.warn("Gemini copywriter fallback triggered:", err);
  }

  return {
    taglines: [
      `Elevate Your World with ${businessName}`,
      `Uncompromising Quality & Innovation`,
      `Your Trusted Partner in ${industry || 'Excellence'}`
    ],
    bio: `${businessName} is dedicated to delivering premium ${industry || 'services'} with unmatched dedication.`,
    bulletPoints: [
      `✓ Industry Certified Excellence`,
      `✓ Custom Tailored Solutions`,
      `✓ Guaranteed Satisfaction`
    ],
    callToAction: `Get In Touch: (555) 019-2831`
  };
};

export const generateDesignIdea = async (prompt: string): Promise<string> => {
  const trimmed = prompt.trim();
  if (!trimmed) {
    return "Please enter a theme or keywords to generate creative design ideas.";
  }

  const ai = getGenAIClient();
  if (!ai) {
    const variations = [
      `A striking geometric emblem centered around "${trimmed}" with deep indigo and metallic gold accents, paired with modern bold sans-serif typography.`,
      `A clean minimalist badge layout featuring "${trimmed}" in an offset border frame with clean monospaced subheadings and high-contrast spacing.`,
      `A vibrant pop-art vector composition of "${trimmed}" with bold halftone gradients and dynamic diagonal action lines.`,
      `A vintage heritage crest featuring "${trimmed}" enclosed in an ornate circular wreath with elegant serif lettering and textured earth tones.`
    ];
    const index = Math.abs(trimmed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % variations.length;
    return variations[index];
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
  } catch (error) {
    console.warn("Gemini API call encountered an issue:", error);
  }

  return `A custom contemporary layout inspired by "${trimmed}" with balanced focal typography, vibrant accent lines, and high-impact print contrast.`;
};
