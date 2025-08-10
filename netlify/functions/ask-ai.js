const fetch = require("node-fetch");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

exports.handler = async function (event) {
  try {
    const { question } = JSON.parse(event.body || "{}");
    if (!question) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No question provided" }),
      };
    }

    // 1. Check Supabase for a similar question
    const { data: existing, error: dbError } = await supabase
      .from("questions")
      .select("*")
      .ilike("question", `%${question}%`)
      .limit(1);

    if (dbError) throw dbError;

    if (existing && existing.length > 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          answer: existing[0].answer,
          source: "database",
        }),
      };
    }

    // 2. Ask Gemini API (only for school/course topics)
    const prompt = `
    You are CampusTutorAI, an assistant that only answers questions related to school, academics, and course topics.
    If the question is unrelated to these, respond with: "I can only help with school-related questions."
    
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

    let answer =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't find an answer.";

    // 3. Save new Q&A to Supabase
    const { error: insertError } = await supabase
      .from("questions")
      .insert([{ question, answer }]);

    if (insertError) throw insertError;

    return {
      statusCode: 200,
      body: JSON.stringify({ answer, source: "gemini" }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
