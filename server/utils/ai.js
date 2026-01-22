const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = process.env.GEMINI_API_URL;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

/**
 * Robust helper to call Gemini Generative AI.
 * Prioritizes the official SDK, falls back to a custom REST URL if provided.
 */
async function callGemini(prompt) {
    if (!GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured in .env");
    }

    // 1. Try SDK (Recommended for Google AI Studio keys)
    try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        if (text) return text;
    } catch (err) {
        console.error("Gemini SDK error, attempting REST fallback:", err.message);
    }

    // 2. Fallback to custom REST URL if provided (OpenAI-compatible or custom proxy)
    if (GEMINI_API_URL) {
        try {
            const resp = await axios.post(
                GEMINI_API_URL,
                { prompt },
                {
                    headers: {
                        Authorization: `Bearer ${GEMINI_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                    timeout: 30000,
                }
            );

            const data = resp.data || {};
            if (typeof data === "string") return data;
            return data.text || data.outputText || data.output_text || JSON.stringify(data);
        } catch (err) {
            console.error("Gemini REST fallback error:", err.message);
        }
    }

    throw new Error("Failed to get response from Gemini API (SDK and REST failed)");
}

module.exports = { callGemini };
