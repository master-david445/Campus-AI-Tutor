# 📚 Campus Q&A Library

A lightweight, modern web application that creates a collaborative knowledge base for students. Ask academic questions and build a searchable library of Q&A pairs using AI.

![Campus Q&A Library](https://img.shields.io/badge/Status-Active-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue) ![Tech](https://img.shields.io/badge/Tech-HTML%2BCSS%2BJS-orange)

---

## ✨ Features

- **🤖 AI-Powered Answers**: Get instant responses to course-related questions using Google Gemini AI
- **📖 Q&A Library**: Build a searchable knowledge base of all questions and answers
- **🔍 Smart Search**: Real-time search through your entire question history
- **🏷️ Auto-Categorization**: Questions automatically sorted into Math, Science, English, History, and Other
- **💾 Persistent Storage**: All Q&A pairs stored securely in Supabase database
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **⚡ Lightweight**: Fast loading with modern, clean interface
- **🎨 Unique Purple Theme**: Custom-designed color scheme for brand identity

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Backend** | Netlify Functions (Node.js) |
| **Database** | Supabase (PostgreSQL) |
| **AI Model** | Google Gemini 1.5 Flash |
| **Deployment** | Netlify |
| **Storage** | Supabase REST API |

---

## 📂 Project Structure

```
campus-q-and-a-library/
├── index.html              # Single-file application (HTML + CSS + JS)
├── netlify/
│   └── functions/
│       └── ask-ai.js       # Serverless function for AI + Database
├── package.json            # Dependencies
├── .env                    # Environment variables (local)
├── netlify.toml           # Netlify configuration (optional)
└── README.md              # This file
```

> **Note**: The new design consolidates all frontend code into a single `index.html` file for simplicity and faster loading.

---

## 🚀 Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/campus-q-and-a-library.git
cd campus-q-and-a-library
```

### 2️⃣ Install Dependencies
```bash
npm install @supabase/supabase-js
```

### 3️⃣ Environment Variables Setup

**For Local Development** - Create `.env` file:
```env
GEMINI_API_KEY=your_gemini_api_key_here
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

**For Netlify Deployment** - Set in Site Settings → Environment Variables:
- `GEMINI_API_KEY`
- `SUPABASE_URL` 
- `SUPABASE_KEY`

### 4️⃣ Database Setup

Create the questions table in Supabase SQL Editor:

```sql
create table questions (
  id uuid primary key default uuid_generate_v4(),
  question text not null,
  answer text not null,
  created_at timestamp default now()
);

-- Enable Row Level Security (optional but recommended)
alter table questions enable row level security;

-- Allow public read access
create policy "Allow public read" on questions
  for select using (true);

-- Allow public insert
create policy "Allow public insert" on questions
  for insert with check (true);
```

### 5️⃣ Update Configuration

In your `index.html`, update the Supabase configuration:

```javascript
// Replace these with your actual Supabase credentials
const SUPABASE_URL = "https://your-project.supabase.co";
const SUPABASE_ANON_KEY = "your-anon-key-here";
```

### 6️⃣ Deploy to Netlify

**Option A: Netlify CLI**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

**Option B: GitHub Integration**
1. Push your code to GitHub
2. Connect repository in Netlify dashboard
3. Set environment variables
4. Deploy automatically

---

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google AI Studio API key | ✅ Yes |
| `SUPABASE_URL` | Your Supabase project URL | ✅ Yes |
| `SUPABASE_KEY` | Your Supabase public anon key | ✅ Yes |

### Getting Your API Keys:

1. **Gemini API**: Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. **Supabase**: Go to Settings → API in your Supabase dashboard

---

## 🎯 How It Works

1. **Student asks a question** → Frontend validates it's school-related
2. **Question sent to Netlify function** → Processes with Gemini AI
3. **AI generates answer** → Response formatted and validated
4. **Saved to Supabase** → Question & answer stored in database
5. **Added to library** → Immediately available for search and browsing
6. **Knowledge grows** → Each question builds the collective knowledge base

---

## 🔍 Features in Detail

### AI Question Processing
- ✅ School-related content filtering
- ✅ Intelligent response generation
- ✅ Context-aware academic answers
- ✅ Error handling and fallbacks

### Library Management
- ✅ Real-time search functionality
- ✅ Category-based filtering
- ✅ Chronological organization
- ✅ Responsive grid layout

### User Experience
- ✅ Loading states and feedback
- ✅ Mobile-optimized interface
- ✅ Keyboard shortcuts (Ctrl+Enter)
- ✅ Auto-expanding text areas

---

## 📈 Roadmap

### Phase 1: Core Features ✅
- [x] Basic Q&A functionality
- [x] Supabase integration
- [x] Modern UI design
- [x] Search and filtering

### Phase 2: Enhanced Features 🚧
- [ ] User authentication system
- [ ] Question voting/rating
- [ ] Subject-specific libraries
- [ ] Export Q&A collections
- [ ] Advanced search filters

### Phase 3: Community Features 🔮
- [ ] Student profiles
- [ ] Q&A sharing between schools
- [ ] Instructor verification
- [ ] Study group integration
- [ ] Analytics dashboard

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🛟 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/YOUR_USERNAME/campus-q-and-a-library/issues) page
2. Create a new issue with detailed description
3. Include error messages and browser console logs

---

## 🏆 Acknowledgments

- Google Gemini AI for intelligent question answering
- Supabase for reliable database hosting
- Netlify for seamless deployment
- The open-source community for inspiration

---

**Made with 💜 by David Macaulay** 

*Building the future of collaborative learning, one question at a time.*
