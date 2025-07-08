
import { GoogleGenAI } from "https://esm.sh/@google/genai@^1.8.0";

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', ['POST']);
    return response.status(405).json({ error: 'Méthode non autorisée' });
  }

  if (!process.env.API_KEY) {
    console.error('La variable d\'environnement API_KEY n\'est pas configurée.');
    return response.status(500).json({ error: 'Erreur de configuration du serveur.' });
  }

  try {
    const { prompt } = request.body;

    if (!prompt || typeof prompt !== 'string') {
      return response.status(400).json({ error: 'Requête invalide: le "prompt" est manquant ou n\'est pas une chaîne de caractères.' });
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const geminiResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            temperature: 0.3,
        }
    });

    const text = geminiResponse.text;
    
    return response.status(200).json({ text });

  } catch (error) {
    console.error("Erreur lors de l'appel à l'API Gemini:", error);
    return response.status(500).json({ error: 'Erreur interne du serveur lors de la communication avec l\'API Gemini.' });
  }
}
