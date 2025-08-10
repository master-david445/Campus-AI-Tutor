// script.js
document.getElementById('askBtn').addEventListener('click', async () => {
  const q = document.getElementById('question').value.trim();
  if (!q) return alert('Type a question');

  const answerDiv = document.getElementById('answer');
  answerDiv.textContent = 'Thinking…';

  const res = await fetch('/.netlify/functions/ask-ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: q })
  });

  const json = await res.json().catch(() => ({ error: 'Invalid JSON response' }));
  answerDiv.textContent = json.answer || json.error || 'No answer';
});
