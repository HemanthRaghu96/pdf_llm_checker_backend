# PDF Rule Checker

A full-stack web application that checks PDF documents against user-defined rules using AI-powered analysis.

## ✨ Features

- 📄 **Upload PDF documents** (2-10 pages)
- ⚡ **Define custom rules** to check against documents
- 🤖 **AI-powered analysis** using Google Gemini
- 📊 **Detailed results** with evidence, reasoning, and confidence scores
- 💾 **PostgreSQL database** for storing check history
- 🎨 **Modern UI** with Tailwind CSS and shadcn/ui components

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Axios** for API calls
- **Lucide React** for icons

### Backend
- **Express.js** with TypeScript
- **TypeORM** with PostgreSQL
- **Google Gemini AI** for rule analysis
- **Multer** for file uploads
- **pdf-parse** for PDF text extraction
- **CORS** for cross-origin requests

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Google Gemini API key (optional - mock service available)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd pdf-llm-checker