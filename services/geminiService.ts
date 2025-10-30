import { GoogleGenAI } from "@google/genai";

export const transcribeAudio = async (
  base64Audio: string,
  mimeType: string,
  apiKey: string
): Promise<string> => {
  // Check if the API key is provided
  if (!apiKey) {
    throw new Error("API Key is required.");
  }

  // Initialize the GenAI client with the provided key for each call
  const ai = new GoogleGenAI({ apiKey });

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
    // Provide a more user-friendly error message
    if (error instanceof Error && error.message.includes('API key not valid')) {
        throw new Error(`Неверный API ключ. Пожалуйста, проверьте его и попробуйте снова.`);
    }
    if (error instanceof Error) {
      throw new Error(`Ошибка Gemini API: ${error.message}`);
    }
    throw new Error("Произошла неизвестная ошибка во время транскрибации.");
  }
};
