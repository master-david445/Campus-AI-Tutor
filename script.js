document.getElementById("askBtn").addEventListener("click", askQuestion);

async function askQuestion() {
  const question = document.getElementById("question").value.trim();
  const answerBox = document.getElementById("answer");
  
  if (!question) {
    answerBox.innerHTML = "Please type a question.";
    return;
  }

  answerBox.innerHTML = "Thinking...";

  try {
    const res = await fetch("/.netlify/functions/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();

    if (data.error) {
      answerBox.innerHTML = "Error: " + data.error;
    } else {
      let sourceTag = "";
      if (data.source === "database") {
        sourceTag = " <span style='color: green;'>(From Database)</span>";
      } else if (data.source === "gemini") {
        sourceTag = " <span style='color: blue;'>(From Gemini)</span>";
      }

      answerBox.innerHTML = data.answer + sourceTag;
    }
  } catch (err) {
    console.error(err);
    answerBox.innerHTML = "Something went wrong.";
  }
}
