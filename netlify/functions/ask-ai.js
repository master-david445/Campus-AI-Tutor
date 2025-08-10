// netlify/functions/ask-ai.js

export async function handler(event) {
  try {
    const { question } = JSON.parse(event.body || "{}");

    if (!question || question.trim() === "") {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No question provided" }),
      };
    }

    // 1️⃣ Environment variables from Netlify
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_KEY;

    if (!GEMINI_API_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing environment variables" }),
      };
    }

    // 2️⃣ Ask Gemini (school-related filter)
    const aiPrompt = `
    You are CampusTutor AI. Only answer questions related to school subjects, courses, academic topics, or study help.
    If the question is unrelated to school, respond with: "I can only help with school or course-related questions."
    Question: ${question}
    `;

    const geminiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: aiPrompt }] }],
        }),
      }
    );

    const aiData = await geminiResponse.json();
    const answer =
      aiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I could not find an answer.";

    // 3️⃣ Save to Supabase (REST API)
    await fetch(`${SUPABASE_URL}/rest/v1/questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        question,
        answer,
      }),
    });

    // 4️⃣ Send answer back to browser
    return {
      statusCode: 200,
      body: JSON.stringify({ answer }),
    };
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Something went wrong" }),
    };
  }
}
