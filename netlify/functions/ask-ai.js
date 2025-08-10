const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const { question } = JSON.parse(event.body);

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: question }] }]
        })
      }
    );

    const data = await response.json();
    console.log("Gemini API raw response:", JSON.stringify(data, null, 2));

    let answer = "Sorry, I couldn't find an answer.";
    if (data.candidates && data.candidates.length > 0) {
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
};          ]
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
