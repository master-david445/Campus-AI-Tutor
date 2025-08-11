const questionInput = document.getElementById("question");
const askBtn = document.getElementById("askBtn");
const answerDiv = document.getElementById("answer");

// Replace with your actual Supabase URL
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

async function fetchPreviousQuestions() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/questions?select=*`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    const data = await res.json();
    const historyDiv = document.getElementById("history");
    historyDiv.innerHTML = "<h2>Previous Questions</h2>";

    if (data.length === 0) {
      historyDiv.innerHTML += "<p>No questions yet.</p>";
      return;
    }

    data.reverse().forEach((item) => {
      historyDiv.innerHTML += `
        <div class="qa">
          <p><strong>Q:</strong> ${item.question}</p>
          <p><strong>A:</strong> ${item.answer}</p>
        </div>
        <hr/>
      `;
    });
  } catch (error) {
    console.error("Error fetching previous questions:", error);
  }
}

askBtn.addEventListener("click", async () => {
  const question = questionInput.value.trim();
  if (!question) {
    alert("Please enter a question");
    return;
  }

  answerDiv.textContent = "Thinking...";

  try {
    const res = await fetch("/.netlify/functions/ask-ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();
    if (data.answer) {
      answerDiv.textContent = data.answer;
      questionInput.value = "";
      fetchPreviousQuestions(); // refresh history
    } else {
      answerDiv.textContent = "Sorry, I could not find an answer.";
    }
  } catch (error) {
    console.error("Error asking AI:", error);
    answerDiv.textContent = "Error asking AI.";
  }
});

// Load previous Q&A when page starts
document.addEventListener("DOMContentLoaded", fetchPreviousQuestions);
