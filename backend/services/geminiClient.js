const { GoogleGenAI } = require('@google/genai');

let ai;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

const getGeminiClient = () => {
  if (!ai) {
    console.warn('GEMINI_API_KEY is not set. AI features will fail.');
  }
  return ai;
};

const getModelName = () => {
  // Use gemini-3.5-flash since older models are deprecated for new users
  return 'gemini-3.5-flash';
};

/**
 * Generate a response using Gemini based on a system instruction and prompt.
 */
const generateResponse = async (systemInstruction, prompt, temperature = 0.7) => {
  const client = getGeminiClient();
  if (!client) throw new Error('Gemini AI not initialized.');

  try {
    const response = await client.models.generateContent({
      model: getModelName(),
      contents: prompt,
      config: {
        systemInstruction,
        temperature,
      }
    });
    return response.text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
};

module.exports = {
  getGeminiClient,
  getModelName,
  generateResponse
};
