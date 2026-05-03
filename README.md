# 🚀 BrandMind — Autonomous AI Social Media Creative Agent

> Developed as a **capstone project** during the **HEC ASPIRE Generative AI Training Program (Cohort 3)**.

---

## 🧠 Overview

**BrandMind** is an AI-powered multi-agent system that automates the creation of **on-brand social media content**.

It analyzes a company’s website to understand brand identity, transforms a simple user intent into structured content strategy, generates multiple post variations (captions + visuals), and improves them using an automated self-review loop.

The system follows a **human-in-the-loop approach**, allowing users to review, edit, and finalize content efficiently.

---

## 🎓 Program Context

This project was developed as part of the **HEC ASPIRE Generative AI Training Program (Cohort 3)** — a national-level initiative focused on equipping students with practical skills in **Artificial Intelligence, Generative AI, and real-world system development**.

### 🏛️ Program Details

* **Program Name:** HEC ASPIRE Generative AI Training Program

* **Cohort:** 3

* **Start Date:** March 29, 2026

* **Organized by:** ASPIRE Pakistan

* **In collaboration with:** Higher Education Commission (HEC)

* **Supporting partners:** Pak Angels, iCodeGuru

### 🎯 Capstone Requirement

As part of the program’s final evaluation, participants are required to:

* Build a **real-world AI-powered application**
* Apply concepts learned during training (LLMs, APIs, system design)
* Work in teams to simulate real industry collaboration
* Present the solution in a **final hackathon/demo**

> 📌 **BrandMind** is developed as our team’s final hackathon submission, demonstrating the use of **multi-agent AI systems** for automated, brand-consistent content generation.

---

## 🎯 Problem Statement

Creating high-quality, consistent social media content is:

* Time-consuming
* Repetitive
* Dependent on brand understanding
* Difficult to scale

Teams often struggle with maintaining consistency across platforms while producing engaging content quickly.

---

## 💡 Solution

**BrandMind** automates the entire content creation pipeline using AI agents:

1. 🔍 **Brand Analysis** — Extracts tone, style, and identity from website
2. 🧭 **Content Planning** — Converts intent into structured strategy
3. ✍️ **Creative Generation** — Produces captions and visuals
4. 🔁 **Self-Review Loop** — Improves content in 3 evaluation rounds
5. 👤 **Human-in-the-loop** — Final selection and editing

---

## ⚙️ Key Features

* 🧠 Multi-agent AI architecture
* 🌐 Website-based brand understanding
* ✍️ LinkedIn & Instagram post generation
* 🎨 AI-generated images (DALL·E 3)
* 🔁 3-stage automated self-review:

  * Brand consistency
  * Message clarity
  * Platform optimization
* ✏️ Editable content variations
* ✅ Best-performing post recommendation

---

## 🏗️ System Architecture

```
Frontend (React + Tailwind)
        ↓
Backend (FastAPI)
        ↓
Multi-Agent Pipeline
        ↓
OpenAI APIs (GPT-4o + DALL·E 3)
```

---

## 🤖 AI Agent Pipeline

| Agent                  | Responsibility                            |
| ---------------------- | ----------------------------------------- |
| **Brand Analyzer**     | Extract brand identity from website       |
| **Content Planner**    | Convert user intent into structured brief |
| **Creative Generator** | Generate captions & visuals               |
| **Self Reviewer**      | Evaluate and improve content              |

---

## 🧪 Workflow

**Input:**

* Website URL
* Brand Name
* Content Intent

**Output:**

* Multiple post variations
* AI-generated visuals
* Reviewed & optimized captions
* Recommended best variation

---

## 🛠️ Tech Stack

### Frontend

* React.js (Vite)
* Tailwind CSS
* Axios

### Backend

* FastAPI (Python)

### AI & APIs

* OpenAI GPT-4o
* DALL·E 3

### Supporting Tools

* BeautifulSoup (Web Scraping)
* httpx / requests
* Pydantic

---

## 📁 Project Structure

```
brandmind/
├── frontend/        # React application
├── backend/         # FastAPI + AI agents
├── .env.example
└── README.md
```

---

## ⚡ Setup Instructions

### 🔹 Backend Setup

```bash
cd backend
pip install -r requirements.txt
cp ../.env.example .env
```

Add your API key:

```
OPENAI_API_KEY=your_key_here
```

Run:

```bash
uvicorn main:app --reload --port 8000
```

---

### 🔹 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔌 API Endpoints

* `POST /api/generate` → Run full AI pipeline
* `POST /api/edit` → Edit and re-optimize caption
* `GET /api/health` → Health check

---

## 📊 Impact

* ⏱️ Reduces content creation time from **hours to seconds**
* 🎯 Ensures strong brand consistency
* 🤖 Automates repetitive marketing workflows
* 📈 Improves content quality using AI feedback loops

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

* Designing multi-agent AI systems
* Integrating LLM APIs into full-stack applications
* Building human-in-the-loop AI workflows
* Deploying applications using Replit

---

## 🚀 Future Improvements

* Social media auto-posting integrations
* Analytics dashboard
* Multi-language support
* Persistent brand memory system

---

## ⭐ Final Note

> BrandMind is not just a content generator —
> it is an AI system that **understands, creates, critiques, and improves content autonomously**.

---
