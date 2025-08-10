import fetch from "node-fetch";

let memory = {};

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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY in environment variables");
    }

    // Call Gemini API
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: question }]
            }
          ]
        })
      }
    );

    const data = await geminiRes.json();

    // Log entire response to see the structure
    console.log("Gemini API raw response:", JSON.stringify(data, null, 2));

    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't find an answer.";

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
