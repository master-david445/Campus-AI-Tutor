// netlify/functions/ask-ai.js
import fetch from "node-fetch";

let memory = {}; // in-memory storage for Q&A during function's warm life

export async function handler(event) {
  try {
    const { question } = JSON.parse(event.body);

    // Check memory first
    if (memory[question]) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          answer: memory[question],
          source: "memory"
        })
      };
    }

    // Call Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY in environment variables");
    }

    const geminiRes = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: question }
              ]
            }
          ]
        })
      }
    );

    const data = await geminiRes.json();

    // Extract the answer safely
    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't find an answer.";

    // Save in memory
    memory[question] = answer;

    return {
      statusCode: 200,
      body: JSON.stringify({
        answer,
        source: "gemini"
      })
    };

  } catch (error) {
    console.error("Error in ask-ai function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
