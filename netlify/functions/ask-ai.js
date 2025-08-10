const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const { question } = JSON.parse(event.body);

    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: question }] }]
      })
    });

    const data = await response.json();
    console.log("Gemini API raw response:", JSON.stringify(data, null, 2));

    let answer = "Sorry, I couldn't find an answer.";
    if (data.candidates?.length > 0) {
      answer = data.candidates[0].content.parts[0].text;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ answer })
    };

  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ answer: "Server error." })
    };
  }
};
