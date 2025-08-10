import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const systemPrompt = `
You are Campus AI Tutor, an assistant that ONLY answers questions related to school,
courses, study topics, academic life, and campus activities.
If the question is unrelated, politely refuse and suggest an academic-related question.
`;

export async function handler(event) {
  try {
    const { question } = JSON.parse(event.body);

    // Step 1: Simple keyword filter
    const academicKeywords = ["exam", "lecture", "course", "school", "professor", "assignment", "study", "class", "campus", "subject"];
    const isAcademic = academicKeywords.some(kw => question.toLowerCase().includes(kw));
    if (!isAcademic) {
      return { statusCode: 200, body: JSON.stringify({ answer: "Sorry, I can only answer school-related questions." }) };
    }

    // Step 2: Check cache (Supabase)
    const { data: existing } = await supabase
      .from("questions")
      .select("answer")
      .eq("question", question)
      .single();

    if (existing) {
      return { statusCode: 200, body: JSON.stringify({ answer: existing.answer }) };
    }

    // Step 3: Call Gemini API
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: `${systemPrompt}\nUser question: ${question}` }] }
        ]
      })
    });

    const geminiData = await geminiRes.json();
    const answer = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't find an answer.";

    // Step 4: Save to Supabase
    await supabase.from("questions").insert([{ question, answer }]);

    return { statusCode: 200, body: JSON.stringify({ answer }) };

  } catch (err) {
    console.error("Error:", err);
    return { statusCode: 500, body: JSON.stringify({ answer: "Error processing your request." }) };
  }
}  }
};
