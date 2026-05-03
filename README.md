# 🚀 BrandMind — Autonomous AI Social Media Creative Agent

> Developed as a **capstone project** during the **HEC ASPIRE Generative AI Training Program (Cohort 3)**

---

## 🌐 Live Demo

👉 **Access the deployed application here:**
🔗 https://brand-mind-agent--SaadUmar3.replit.app

> ⚠️ Note: The app may take a few seconds to load initially due to cold start (Replit free deployment).

---

## 🧠 Overview

**BrandMind** is an AI-powered multi-agent system that automates the creation of **on-brand social media content**.

It analyzes a company’s website to understand brand identity, converts a simple user intent into structured content strategy, generates multiple post variations (captions + visuals), and improves them through an automated self-review loop.

The system follows a **human-in-the-loop approach**, allowing users to review, edit, and finalize content efficiently.

---

## 🎓 Program Context

This project was developed as part of the **HEC ASPIRE Generative AI Training Program (Cohort 3)** — a national-level initiative focused on practical learning in **Artificial Intelligence and Generative AI systems**.

### 🏛️ Program Details

* **Program Name:** HEC ASPIRE Generative AI Training Program

* **Cohort:** 3

* **Start Date:** March 29, 2026

* **Organized by:** ASPIRE Pakistan

* **In collaboration with:** Higher Education Commission (HEC)

* **Supporting partners:** Pak Angels, iCodeGuru

### 🎯 Capstone Requirement

Participants are required to:

* Build a **real-world AI application**
* Apply concepts like LLMs, APIs, and system design
* Work in teams (industry-style collaboration)
* Present in a **final hackathon/demo**

> 📌 **BrandMind** is our team’s final submission demonstrating a **multi-agent AI system for automated content creation**.

---

## 🎯 Problem Statement

Creating consistent and engaging social media content is:

* Time-consuming
* Repetitive
* Hard to scale
* Dependent on brand understanding

---

## 💡 Solution

**BrandMind** automates the workflow using AI agents:

1. 🔍 Brand Analysis
2. 🧭 Content Planning
3. ✍️ Creative Generation
4. 🔁 Self-Review Loop (3 rounds)
5. 👤 Human-in-the-loop Editing

---

## ⚙️ Key Features

* 🧠 Multi-agent AI architecture
* 🌐 Website-based brand understanding
* ✍️ LinkedIn & Instagram content generation
* 🎨 AI-generated visuals (DALL·E 3)
* 🔁 Automated self-review:

  * Brand consistency
  * Message clarity
  * Platform optimization
* ✏️ Editable post variations
* ✅ Best variation recommendation

---

## 🏗️ System Architecture

```bash id="arch-final"
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

| Agent              | Role                       |
| ------------------ | -------------------------- |
| Brand Analyzer     | Extract brand identity     |
| Content Planner    | Structure content strategy |
| Creative Generator | Generate captions & images |
| Self Reviewer      | Improve & score content    |

---

## 🧪 Workflow

**Input:**

* Website URL
* Brand Name
* Content Intent

**Output:**

* Multiple post variations
* AI-generated images
* Reviewed & optimized captions
* Recommended best post

---

## 🛠️ Tech Stack

**Frontend:** React (Vite), Tailwind CSS
**Backend:** FastAPI (Python)
**AI:** OpenAI GPT-4o, DALL·E 3
**Tools:** BeautifulSoup, Axios, httpx

---

## 📁 Project Structure

```bash id="structure-final"
brandmind/
├── frontend/
├── backend/
├── .env.example
└── README.md
```

---

## ⚡ Setup Instructions

### Backend

```bash id="backend-final"
cd backend
pip install -r requirements.txt
cp ../.env.example .env
```

Add:

```bash id="env-final"
OPENAI_API_KEY=your_key_here
```

Run:

```bash id="run-final"
uvicorn main:app --reload --port 8000
```

---

### Frontend

```bash id="frontend-final"
cd frontend
npm install
npm run dev
```

---

## 🔌 API Endpoints

* `POST /api/generate` → Run full pipeline
* `POST /api/edit` → Edit caption
* `GET /api/health` → Health check

---

## 📊 Impact

* ⏱️ Hours → Seconds (content creation time)
* 🎯 Strong brand consistency
* 🤖 Automated marketing workflow
* 📈 Improved content quality

---

## 👥 Team

### 🧠 Team Lead & AI Architect

* **Saad Umar**

### 🎨 Frontend & UI/UX

* **Fatima Naveed**

### ⚙️ Backend & API Integration

* **Arshia Sajid Ali**

### 🔍 QA, Testing & Documentation

* **Ghulam Mustafa**

---

## 🧠 Key Learnings

* Multi-agent AI system design
* Full-stack AI integration
* Prompt engineering & evaluation
* Real-world deployment using Replit

---

## 🚀 Future Improvements

* Social media auto-posting
* Analytics dashboard
* Multi-language support
* Persistent brand memory

---

## ⭐ Final Note

> BrandMind is not just a generator —
> it is an AI system that **understands, creates, critiques, and improves content autonomously**.

---
