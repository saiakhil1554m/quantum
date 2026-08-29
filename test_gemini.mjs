import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function test() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: 'Say Hello POWERGRID IT Helpdesk!',
    });
    console.log("SUCCESS Response:", response.text);
  } catch (err) {
    console.log("Error:", err.message);
  }
}

test();
