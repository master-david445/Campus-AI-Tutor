// netlify/functions/ask-ai.js
export async function handler(event) {
  try {
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: '',
      };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    const { question } = JSON.parse(event.body || "{}");
    
    if (!question || question.trim() === "") {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: "No question provided" }),
      };
    }

    // Validate question length
    if (question.length > 500) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: "Question too long (max 500 characters)" }),
      };
    }

    // 1️⃣ Environment variables from Netlify
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_KEY;

    if (!GEMINI_API_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: "Server configuration error" }),
      };
    }

    // 2️⃣ Ask Gemini (school-related filter with enhanced prompt)
    const aiPrompt = `
You are CampusTutor AI, an expert academic assistant specializing in helping students with their studies.

IMPORTANT GUIDELINES:
- Only answer questions related to school subjects, academic topics, homework help, study techniques, or educational content
- If the question is unrelated to education/academics, respond with: "I can only help with school or academic-related questions. Please ask about subjects like math, science, history, literature, or study techniques."
- Provide clear, detailed, and educational explanations
- Use examples when helpful
- Structure your answers with proper formatting when needed
- Keep responses informative but concise (aim for 2-4 paragraphs)

Student Question: ${question}

Please provide a helpful, educational response:`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: aiPrompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.status}`);
    }

    const aiData = await geminiResponse.json();
    const answer = aiData?.candidates?.[0]?.content?.parts?.[0]?.text || 
      "Sorry, I couldn't generate an answer at the moment. Please try again.";

    // 3️⃣ Auto-categorize the question
    function categorizeQuestion(questionText) {
      const q = questionText.toLowerCase();
      
      const categories = {
        math: ['math', 'equation', 'algebra', 'calculus', 'geometry', 'theorem', 'calculate', 'formula', 'solve', 'integral', 'derivative', 'quadratic', 'linear', 'trigonometry', 'statistics', 'probability'],
        science: ['science', 'physics', 'chemistry', 'biology', 'photosynthesis', 'cell', 'atom', 'molecule', 'reaction', 'evolution', 'DNA', 'ecosystem', 'gravity', 'energy', 'matter', 'organism'],
        english: ['english', 'literature', 'essay', 'shakespeare', 'writing', 'thesis', 'grammar', 'poem', 'novel', 'analysis', 'metaphor', 'symbolism', 'character', 'theme', 'rhetoric'],
        history: ['history', 'war', 'ancient', 'civilization', 'revolution', 'century', 'historical', 'empire', 'battle', 'timeline', 'democracy', 'politics', 'culture', 'society']
      };
      
      for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(keyword => q.includes(keyword))) {
          return category;
        }
      }
      
      return 'other';
    }

    const category = categorizeQuestion(question);

    // 4️⃣ Save to Supabase (REST API)
    const saveResponse = await fetch(`${SUPABASE_URL}/rest/v1/questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        question: question.trim(),
        answer: answer.trim(),
        category: category,
        created_at: new Date().toISOString(),
      }),
    });

    if (!saveResponse.ok) {
      console.error("Failed to save to Supabase:", saveResponse.status);
      // Continue anyway - we still have the answer
    }

    // 5️⃣ Send answer back to browser
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        answer,
        category,
        question: question.trim()
      }),
    };

  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: "I'm having trouble processing your question right now. Please try again in a moment." 
      }),
    };
  }
}
