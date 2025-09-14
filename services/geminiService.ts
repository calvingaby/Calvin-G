
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Part } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this environment, we assume it's always present.
  console.warn("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const baseSystemInstruction = `You are an expert web developer specializing in Tailwind CSS. 
Your task is to generate a single, complete HTML file using Tailwind CSS.
The HTML must be fully self-contained. Load Tailwind CSS via the CDN script: <script src="https://cdn.tailwindcss.com"></script>.
Ensure the website is responsive and modern.
Use placeholder images from https://picsum.photos if no specific images are requested.
Use lorem ipsum for text placeholders if no specific content is provided.
DO NOT include any explanations, comments, or markdown formatting (like \`\`\`html).
ONLY output the raw HTML code for the webpage.`;


// Helper function to convert base64 to a Part object
function fileToGenerativePart(base64Data: string): Part {
  const match = base64Data.match(/^data:(.+);base64,(.+)$/);
  if (!match) {
    throw new Error('Invalid base64 string');
  }
  const mimeType = match[1];
  const data = match[2];
  return {
    inlineData: {
      mimeType,
      data,
    },
  };
}


export const generateWebsite = async (prompt: string, imageBase64: string | null): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const parts: Part[] = [{ text: prompt }];

    if (imageBase64) {
      parts.unshift(fileToGenerativePart(imageBase64));
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: { parts: parts },
      config: {
        systemInstruction: baseSystemInstruction
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating website:", error);
    throw new Error("Failed to generate website from Gemini API.");
  }
};


export const refineWebsite = async (prompt: string, currentHtml: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const fullPrompt = `Based on the following user request, please modify the provided HTML code.

User Request: "${prompt}"

Current HTML code:
${currentHtml}

Generate the complete, new HTML code with the requested changes applied.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: fullPrompt,
      config: {
        systemInstruction: baseSystemInstruction
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error refining website:", error);
    throw new Error("Failed to refine website with Gemini API.");
  }
};
