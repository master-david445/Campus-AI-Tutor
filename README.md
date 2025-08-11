# Campus-AI-Tutor
 Campus AI Tutor

Campus AI Tutor is a lightweight web app that answers school- and course-related questions using Google Gemini AI.
It also stores and displays previously asked questions & answers using Supabase.


---

 Features

Ask AI: Get instant answers to course-related questions.

Question History: See what other students have asked.

Supabase Integration: All Q&A stored securely in a database.

Responsive Design: Works on desktop & mobile.

Netlify Deployment: Serverless functions for AI requests.



---

🛠️ Tech Stack

Frontend: HTML, CSS, JavaScript

Backend: Netlify Functions (Node.js)

Database: Supabase

AI Model: Google Gemini API



---

Project Structure

/
├── index.html        # Main HTML file
├── style.css         # Styles
├── script.js         # Frontend logic
├── netlify/
│   └── functions/
│       └── ask-ai.js # Handles AI + Supabase requests
└── README.md         # Project documentation


---

 Setup Instructions

1️⃣ Clone the repo

git clone https://github.com/YOUR_USERNAME/campus-ai-tutor.git
cd campus-ai-tutor

2️⃣ Install dependencies

npm install @supabase/supabase-js @google/generative-ai

3️⃣ Create .env file (for local dev)

GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key

> On Netlify, set these as Environment Variables in your Site Settings.




---

4️⃣ Create Supabase Table

Run this in Supabase SQL editor:

create table questions (
  id uuid primary key default uuid_generate_v4(),
  question text not null,
  answer text not null,
  created_at timestamp default now()
);


---

5️⃣ Deploy to Netlify

netlify init
netlify deploy --prod


---

Environment Variables

Name	Description

GEMINI_API_KEY	Your Google Gemini API key
SUPABASE_URL	Supabase project API URL
SUPABASE_KEY	Supabase public anon key



---

 Roadmap

[ ] Improve styling and UI

[ ] Add search for previous Q&A

[ ] Support multiple courses/departments

[ ] Authentication for students



---

License

MIT License © 2025 [Your Name]
