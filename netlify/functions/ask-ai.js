// netlify/functions/ask-ai.js  (CommonJS)
exports.handler = async function(event) {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const body = JSON.parse(event.body || '{}');
    const question = (body.question || '').trim();
    if (!question) return { statusCode: 400, body: JSON.stringify({ error: 'Missing question' }) };

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // needs permissions to read/write
    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
    if (!SUPABASE_URL || !SUPABASE_KEY || !GOOGLE_API_KEY) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Missing required env vars' }) };
    }

    // --- 1) Try find an existing answer in Supabase (simple ilike substring match) ---
    const supabaseSelectUrl = `${SUPABASE_URL.replace(/\/$/,'')}/rest/v1/questions?select=question,answer&question=ilike.*${encodeURIComponent(question)}*&limit=1`;
    const supRes = await fetch(supabaseSelectUrl, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Accept': 'application/json'
      }
    });

    if (supRes.ok) {
      const rows = await supRes.json();
      if (Array.isArray(rows) && rows.length > 0) {
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answer: rows[0].answer, source: 'cache' })
        };
      }
    } else {
      console.warn('Supabase lookup failed:', await supRes.text());
      // continue to generate answer
    }

    // --- 2) Find an available model (ListModels) and pick one that supports generateContent ---
    let modelName = 'gemini-1.5-flash'; // fallback
    try {
      const listModelsUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${GOOGLE_API_KEY}`;
      const lm = await fetch(listModelsUrl);
      if (lm.ok) {
        const lmJson = await lm.json();
        if (Array.isArray(lmJson.models)) {
          const candidate = lmJson.models.find(m => Array.isArray(m.supportedMethods) && m.supportedMethods.includes('generateContent'));
          if (candidate && candidate.name) modelName = candidate.name;
        }
      } else {
        console.warn('ListModels failed:', await lm.text());
      }
    } catch (e) {
      console.warn('ListModels error (ignored):', e.message || e);
    }

    // --- 3) Call generateContent with a "safety" prompt that restricts to school/course content ---
    const genUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelName)}:generateContent?key=${GOOGLE_API_KEY}`;

    const systemPrompt = `
You are Campus AI Tutor. ONLY answer questions that are school or course related: lectures, course concepts, assignments, exams, study tips, syllabus, lab help and related academic topics. 
If the question is not about school/course content, reply exactly: "I can only answer school or course related questions."
Keep answers concise and helpful.
`;
    const promptText = `${systemPrompt}\nQuestion: ${question}\nAnswer:`;

    const genRes = await fetch(genUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: { text: promptText },
        maxOutputTokens: 512,
        temperature: 0.2
      })
    });

    if (!genRes.ok) {
      const txt = await genRes.text();
      console.error('generateContent error', txt);
      return { statusCode: 500, body: JSON.stringify({ error: 'Model error', details: txt }) };
    }

    const genJson = await genRes.json();

    // Extract text from response (robust to a few shapes)
    let answerText = '';
    if (genJson.candidates && genJson.candidates[0] && genJson.candidates[0].content && Array.isArray(genJson.candidates[0].content.parts)) {
      answerText = genJson.candidates[0].content.parts.map(p => p.text || '').join('');
    } else if (genJson.output && Array.isArray(genJson.output)) {
      answerText = genJson.output.map(o => {
        if (o.content && Array.isArray(o.content)) return o.content.map(c => c.text || '').join('');
        return '';
      }).join('\n');
    } else if (typeof genJson === 'string') {
      answerText = genJson;
    } else {
      answerText = JSON.stringify(genJson);
    }

    // --- 4) Store question+answer back to Supabase (best-effort) ---
    try {
      const insertUrl = `${SUPABASE_URL.replace(/\/$/,'')}/rest/v1/questions`;
      const insertRes = await fetch(insertUrl, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ question, answer: answerText })
      });
      if (!insertRes.ok) console.warn('Supabase insert failed:', await insertRes.text());
    } catch (e) {
      console.warn('Supabase insert error (ignored):', e.message || e);
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer: answerText, model: modelName, source: 'generated' })
    };

  } catch (err) {
    console.error('Unhandled error in ask-ai:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Unhandled server error', message: err.message }) };
  }
};
