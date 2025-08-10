import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";

// Supabase setup
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function handler(event) {
  const { question } = JSON.parse(event.body);

  // Check DB first for similar question
  let { data: existing, error: searchError } = await supabase
    .from("questions")
    .select("*")
    .ilike("question", `%${question}%`)
    .limit(1);

  if (existing?.length > 0) {
    return {
      statusCode: 200,
      body: JSON.stringify({ answer: existing[0].answer, source: "database" }),
    };
  }

  // If not in DB, call Gemini API
  const prompt = `
  You are CampusTutorAI, an AI that only answers school-related or course-related questions.
  If the question is not related to academics, respond with: "I can only answer school or course-related questions."
  Question: ${question}
  `;

  const geminiRes = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
      process.env.GEMINI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  const geminiData = await geminiRes.json();
  console.log("Gemini response:", JSON.stringify(geminiData, null, 2));

  let answer = "Sorry, I couldn't find an answer.";
  if (geminiData?.candidates?.length > 0) {
    const parts = geminiData.candidates[0]?.content?.parts;
    if (parts?.length > 0 && parts[0].text) {
      answer = parts[0].text;
    }
  }

  // Save to DB
  await supabase.from("questions").insert([{ question, answer }]);

  return {
    statusCode: 200,
    body: JSON.stringify({ answer, source: "ai" }),
  };
}
