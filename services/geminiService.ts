
import { GoogleGenAI } from "@google/genai";

// As per guidelines, assume API_KEY is available in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSummary = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.3,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating summary with Gemini:", error);
        return `Une erreur est survenue lors de la communication avec l'API Gemini. Veuillez vérifier la console pour plus de détails.`;
    }
};
