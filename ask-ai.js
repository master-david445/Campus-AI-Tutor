import fetch from "node-fetch";

export async function handler(event) {
  try {
    const { question } = JSON.parse(event.body);

    // Replace YOUR_API_KEY with your OpenAI key in Netlify's environment settings
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: question }],
      }),
    });

    const json = await response.json();
    const answer = json.choices?.[0]?.message?.content || "No answer found";

    return {
      statusCode: 200,
      body: JSON.stringify({ answer }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
