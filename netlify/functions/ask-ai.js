import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function handler(event) {
  try {
    const { question } = JSON.parse(event.body);

    if (!question || question.trim().length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No question provided" }),
      };
    }

    // 1️⃣ Check Supabase for similar question (case-insensitive match)
    const { data: matches, error: matchError } = await supabase
      .from("questions")
      .select("*")
      .ilike("question", `%${question}%`)
      .order("created_at", { ascending: false })
      .limit(1);

    if (matchError) {
      console.error("Supabase match error:", matchError);
    }

    if (matches && matches.length > 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          answer: matches[0].answer,
          source: "database",
        }),
      };
    }

    // 2️⃣ Ask Gemini API but restrict to school/course-related knowledge
    const prompt = `
      You are a campus AI tutor. Only answer questions related to school, university, courses, 
      academic subjects, campus life, or study tips. If the question is unrelated, say 
      "I can only answer school-related questions."

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

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API error:", errText);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Gemini API call failed" }),
      };
    }

    const geminiData = await geminiRes.json();
    console.log("Gemini response:", JSON.stringify(geminiData, null, 2));

    let answer = "Sorry, I couldn't find an answer.";
    if (geminiData?.candidates?.length > 0) {
      const parts = geminiData.candidates[0]?.content?.parts;
      if (parts?.length > 0 && parts[0].text) {
        answer = parts[0].text;
      }
    }

    // 3️⃣ Store Q&A in Supabase
    const { error: insertError } = await supabase
      .from("questions")
      .insert([{ question, answer }]);

    if (insertError) {
      console.error("Supabase insert error:", insertError);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ answer, source: "gemini" }),
    };
  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" }),
    };
  }
}    {
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
