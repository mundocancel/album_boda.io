import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AIAnalysis } from "../types";

// Helper to convert blob/file to base64 with mime type
export const fileToGenerativePart = async (file: File): Promise<{ data: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Extract MIME type from data URL (e.g., "data:image/png;base64,...")
      const mimeType = base64String.match(/data:([^;]*);/)?.[1] || file.type || 'image/jpeg';
      const base64Data = base64String.split(',')[1];
      resolve({ data: base64Data, mimeType });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const urlToBase64 = async (url: string): Promise<{ data: string; mimeType: string }> => {
    const response = await fetch(url, { mode: 'cors' });
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            // Extract MIME type dynamically
            const mimeType = base64String.match(/data:([^;]*);/)?.[1] || blob.type || 'image/jpeg';
            const base64Data = base64String.split(',')[1];
            resolve({ data: base64Data, mimeType });
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

export const analyzeImageWithGemini = async (imageData: { data: string; mimeType: string }): Promise<AIAnalysis> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "A short, artistic title" },
        description: { type: Type.STRING, description: "Contextual description answering Who, What, When, Where" },
        tags: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "Keywords for search (e.g., 'beach', 'family')"
        },
        location: { type: Type.STRING, description: "Estimated setting or environment" },
        mood: { type: Type.STRING, description: "The emotional atmosphere" },
        category: {
          type: Type.STRING,
          enum: ["Events", "People", "Places", "Nature", "Uncategorized"],
          description: "The best fitting album category for this photo"
        }
      },
      required: ["title", "description", "tags", "mood", "category"],
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: imageData.mimeType,
              data: imageData.data
            }
          },
          {
            text: "Analyze this image for a smart photo album. Classify it into one of the categories. Provide a description that specifically answers: Who is in it? What is happening? Where is it? When (time of day/season)?"
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.4, 
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIAnalysis;
    }
    
    throw new Error("No response text generated");

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};