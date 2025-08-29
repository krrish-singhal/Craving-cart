// test-gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// ⛔ REPLACE with your actual AI Studio key
const API_KEY = "YOUR_GEMINI_API_KEY_HERE";

const genAI = new GoogleGenerativeAI(API_KEY);

async function testGemini() {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = "Say hello in French";

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("✅ Gemini Response:", text);
  } catch (error) {
    console.error("❌ Error talking to Gemini:", error.message);
  }
}

testGemini();
