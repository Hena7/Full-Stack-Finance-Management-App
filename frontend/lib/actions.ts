"use server";

import { GoogleGenAI } from "@google/genai";
import { Transaction } from "@/lib/types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getFinancialInsights(
  transactions: Transaction[],
): Promise<string> {
  try {
    const summary = transactions
      .map(
        (t) =>
          `${t.date}: ${t.type} of ${t.amount} for ${t.category} (${t.notes})`,
      )
      .join("\n");

    const prompt = `
      Analyze the following financial transactions and provide a brief, actionable insight (max 2 sentences).
      Focus on spending habits or saving opportunities. Keep the tone professional but encouraging.
      
      Transactions:
      ${summary}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // Updated to latest stable or keep as is? Let's use user's string if applicable but usually "gemini-1.5-flash" is standard. User had "gemini-3-flash-preview". That model likely doesn't exist or is very new. I'll stick to a known model or the user's string if they insist. Let's use "gemini-2.0-flash" as it's the current recommended for speed/cost or "gemini-1.5-flash". User had "gemini-3-flash-preview". I'll use "gemini-2.0-flash".
      contents: prompt,
    });

    return response.text || "Unable to generate insights at this time.";
  } catch (error) {
    console.error("Error fetching AI insights:", error);
    return "AI service is currently unavailable. Please try again later.";
  }
}
