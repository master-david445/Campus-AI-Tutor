import fetch from "node-fetch";

// A simple in-memory store for Q&A (resets when function is reloaded)
let qaHistory = [];

export async function handler(event) {
  try {
    const { question } = JSON.parse(event.body);

    // 1. Check if we've already answered this
    const pastAnswer = qaHistory.find(q => q.question.toLowerCase() === question.toLowerCase());
    if (pastAnswer) {
      return {
        statusCode: 200,
        body: JSON.stringify({ answer: pastAnswer.answer, cached: true }),
      };
    }

    // 2. Call Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: question }]
        }]
      })
    });

    const data = await response.json();
    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't find an answer.";

    // 3. Save to history
    qaHistory.push({ question, answer });

    return {
      statusCode: 200,
      body: JSON.stringify({ answer, cached: false }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
