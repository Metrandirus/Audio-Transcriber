
import { GoogleGenAI } from "@google/genai";

// This is a placeholder for environments where the key is expected.
// In the target runtime, it's assumed to be present and valid.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY is not set. The application will not work without it.");
}

// Initialize with the API key. The exclamation mark asserts that API_KEY is non-null.
const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const transcribeAudio = async (base64Audio: string, mimeType: string): Promise<string> => {
  try {
    const audioPart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Audio,
      },
    };

    const textPart = {
      text: "Transcribe this audio file accurately. Provide only the transcribed text.",
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [audioPart, textPart] },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error during transcription:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred during transcription.");
  }
};
