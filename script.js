document.getElementById("askBtn").addEventListener("click", async () => {
  const question = document.getElementById("question").value;
  if (!question.trim()) {
    alert("Please enter a question");
    return;
  }

  document.getElementById("answer").innerHTML = "Thinking...";

  const res = await fetch("/.netlify/functions/ask-ai", {
    method: "POST",
    body: JSON.stringify({ question }),
  });

  const data = await res.json();
  document.getElementById("answer").innerHTML = 
    (data.cached ? "(From history) " : "") + data.answer;
});
