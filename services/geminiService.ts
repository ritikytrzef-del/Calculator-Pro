import { GoogleGenAI } from "@google/genai";

const AI_INSTRUCTION = `You are Calculator Pro, an advanced AI calculator.

Your tasks:
1. MATH: Solve mathematical expressions or word problems provided by the user.
2. CURRENCY: Convert currency between any two countries using REAL-TIME data.
   - You have access to Google Search. ALWAYS use it to find the *latest* exchange rate.
   - Smartly identify currency codes/symbols (INR, ₹, USD, $, EUR, €, GBP, £, etc.).
   - IMPORTANT: If user provides ONLY amount + currency (e.g., "10$", "500 Euro", "1000 INR") without a target currency:
     - AUTOMATICALLY convert it to major currencies: INR (if source isn't INR), USD, and EUR.
     - Example Input: "10$" -> Output: "≈ 830 INR | 9.20 EUR"
   - Show the result clearly and concisely.

Rules:
- Keep responses concise, suitable for a mobile calculator display.
- Do NOT use Markdown block formatting unless necessary for code.
- If user speaks Hindi, English or Hinglish, understand and reply accordingly.`;

export const solveWithGemini = async (input: string): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key missing");

    const ai = new GoogleGenAI({ apiKey });
    
    // Using flash model with Google Search enabled for real-time rates
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: input,
      config: {
        systemInstruction: AI_INSTRUCTION,
        tools: [{googleSearch: {}}], // Enable real-time search
        maxOutputTokens: 300, 
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    let text = response.text?.trim() || "AI Error";
    
    // Extract grounding chunks to display sources if available
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks && chunks.length > 0) {
      const urls = chunks
        .map(c => c.web?.uri)
        .filter(uri => uri)
        .slice(0, 1); // Just take the top source to keep display clean
      
      if (urls.length > 0) {
         // Append source in a compact format
         // text += ` (Source: ${new URL(urls[0]!).hostname})`;
         // Or just return text. For a calculator, clean text is better, 
         // but strict rules say we must list URLs.
         text += `\n[Source: ${urls[0]}]`;
      }
    }

    return text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Check Connection";
  }
};