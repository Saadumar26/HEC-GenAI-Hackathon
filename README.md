# 🚀 BrandMind — Autonomous AI Social Media Creative Agent

> A multi-agent Generative AI system that automates brand-aware social media content creation using LLMs and image generation.

---

## 🌐 Live Demo

👉 **Deployed Application:**  
[https://brand-mind-agent.saadumar3.replit.app](https://brand-mind-agent--SaadUmar3.replit.app)

> ⚠️ Note: First load may take a few seconds due to cold start on Replit free deployment.

---

## 🎓 Hackathon & Program Context

This project was developed as part of the:

### 🧠 HEC ASPIRE Generative AI Training Program (Cohort 3)

A national-level initiative focused on practical AI development and real-world generative AI applications.

- 📅 Program Start: March 29, 2026  
- 🏛️ Organized by: Higher Education Commission (HEC), Pakistan  
- 🤝 Partners: ASPIRE Pakistan, Pak Angels, iCodeGuru  

### 🏆 Hackathon Requirement

Participants were required to build a real-world AI application demonstrating:

- LLM-based systems  
- Multi-agent architectures  
- API integration  
- End-to-end deployment  

---

## 💡 Project Overview

**BrandMind** is an autonomous AI system that:

1. 🔍 Analyzes a brand from its website  
2. 🧭 Creates a structured content strategy from user intent  
3. ✍️ Generates multiple social media post variations  
4. 🎨 Produces AI-generated visuals (DALL·E 3)  
5. 🔁 Runs a 3-step self-review improvement loop  
6. 👤 Allows human editing and final selection  

---

## 🎯 Problem Statement

Marketing teams struggle with:

- Time-consuming content creation  
- Inconsistent brand voice  
- Lack of scalability  
- Manual editing and iteration  

---

## ⚙️ Solution

BrandMind automates the entire workflow using AI agents:

- Brand understanding  
- Content planning  
- Creative generation  
- Quality evaluation  
- Human-in-the-loop refinement  

---

## 🧠 System Architecture

```
Frontend (React + Tailwind)
        ↓
Backend (FastAPI)
        ↓
Multi-Agent AI Pipeline
        ↓
OpenAI APIs (GPT-4o + DALL·E 3)
```

---

## 🤖 AI Agent Pipeline

| Agent              | Responsibility                              |
|--------------------|---------------------------------------------|
| Brand Analyzer     | Extracts brand identity from website        |
| Content Planner    | Converts intent into structured strategy    |
| Creative Generator | Generates captions & visuals                |
| Self Reviewer      | Improves content using scoring loop         |

---

## 🧪 Workflow

### Input:
- Website URL  
- Brand Name  
- Content Intent  

### Output:
- Multiple caption variations  
- AI-generated images  
- Reviewed & scored posts  
- Recommended best variation  

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS

### Backend
- FastAPI (Python)

### AI & APIs
- OpenAI GPT-4o  
- OpenAI DALL·E 3  
- BeautifulSoup (web scraping)

---

## 📁 Project Structure

```
HEC-GenAI-Hackathon/
│
├── artifacts/                          # Main application builds (Replit generated)
│   │
│   ├── api-server/                     # Backend (FastAPI / API layer)
│   │   ├── .replit-artifact/
│   │   └── src/
│   │       ├── lib/                    # Core backend utilities
│   │       ├── middlewares/            # API middlewares (auth, cors, etc.)
│   │       └── routes/
│   │           └── brandmind/          # BrandMind API endpoints
│   │
│   ├── brandmind/                      # Frontend (React App)
│   │   ├── .replit-artifact/
│   │   ├── public/
│   │   └── src/
│   │       ├── components/             # UI components
│   │       │   └── ui/                 # Reusable UI elements
│   │       ├── hooks/                  # Custom React hooks
│   │       ├── lib/                    # Frontend utilities
│   │       └── pages/                  # App screens / routes
│   │
│   └── mockup-sandbox/                 # UI experimentation / prototyping
│       ├── .replit-artifact/
│       └── src/
│           ├── .generated/
│           ├── components/
│           │   └── ui/
│           ├── hooks/
│           └── lib/
│
├── attached_assets/                    # Uploaded assets / media / references
│
├── lib/                                # Shared system libraries (backend + integrations)
│   │
│   ├── api-client-react/               # Auto-generated API client for React
│   ├── api-spec/                       # API specification layer
│   ├── api-zod/                        # Zod validation schemas
│   │
│   ├── db/                             # Database schema & models
│   │   └── src/schema/
│   │
│   ├── integrations/                   # AI & external integrations
│   │   └── openai_ai_integrations/
│   │       └── src/
│   │           ├── client/
│   │           │   └── audio/
│   │           └── server/
│   │               ├── audio/
│   │               ├── batch/
│   │               └── image/
│   │
│   ├── integrations-openai-ai-react/
│   │   └── src/audio/
│   │
│   └── integrations-openai-ai-server/
│       └── src/
│           ├── audio/
│           ├── batch/
│           └── image/
│
└── scripts/                            # Automation / helper scripts
    └── src/
```

---

## 🔌 API Endpoints

| Method | Endpoint        | Description                         |
|--------|-----------------|-------------------------------------|
| POST   | `/api/generate` | Run the full AI content pipeline    |
| POST   | `/api/edit`     | Edit and improve existing captions  |
| GET    | `/api/health`   | Health check                        |

---

## ⚡ Key Features

- Multi-agent AI workflow  
- Website-based brand understanding  
- LinkedIn + Instagram post generation  
- AI-generated visuals (DALL·E 3)  
- Self-review scoring system  
- Human editing interface  
- Best variation recommendation  

---

## 👥 Team

| Role                          | Member          |
|-------------------------------|-----------------|
| Team Lead & AI System Design  | Muhammad Saad Umar       |
| Frontend Development          | Fatima Naveed   |
| Backend & API Integration     | Arshia Sajid Ali|
| Testing & Documentation       | Ghulam Mustafa  |

---

## 📊 Impact

- Reduces content creation time from **hours → minutes**  
- Improves brand consistency across platforms  
- Automates repetitive creative workflows  
- Enables scalable marketing content generation  

---

## 🚀 Future Enhancements

- Social media auto-posting  
- Analytics dashboard  
- Multi-language support  
- Brand memory system  
- Fine-tuned marketing models  

---

## 🧠 Key Learnings

- Multi-agent AI system design  
- Prompt engineering for structured outputs  
- Full-stack AI integration  
- Real-world deployment on Replit  

---

## ⭐ Final Note

BrandMind demonstrates how autonomous AI agents can combine reasoning, creativity, and evaluation to transform modern digital marketing workflows.
