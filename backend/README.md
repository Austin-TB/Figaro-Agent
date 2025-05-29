# Figaro AI Assistant

A modern, full-stack AI assistant application with a clean, interactive web interface. Figaro combines the power of LangGraph with multiple AI tools and services to provide comprehensive assistance across various domains.

## 🌟 Features

### AI Capabilities
- **Web Search** - Real-time web search using Tavily
- **Wikipedia Search** - Access to Wikipedia knowledge base
- **ArXiv Research** - Scientific paper search and analysis
- **YouTube Analysis** - Extract and analyze YouTube video content
- **Document Processing** - OCR, CSV/Excel analysis, and more
- **Code Execution** - Run and debug Python scripts
- **Mathematical Computations** - Advanced calculator functionality

### Frontend Features
- 🎨 Modern, minimal dark theme design
- 💬 Real-time chat interface with typing indicators
- 📱 Fully responsive design
- 🔄 Auto-scroll to latest messages
- 🌐 Connection status monitoring
- ✨ Smooth animations and transitions
- 📝 Markdown support for rich text responses
- 🎯 Quick-start example prompts

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **LangGraph** - AI agent orchestration
- **LangChain** - AI/ML integrations
- **Multiple AI Providers** - Google Gemini, Groq, and more

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **React Markdown** - Rich text rendering
- **Axios** - HTTP client

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

### 1. Backend Setup

1. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

2. **Configure environment variables:**
Create a `.env` file in the root directory:
```env
# Required API Keys
GOOGLE_API_KEY=your_google_api_key
GROQ_API_KEY=your_groq_api_key
TAVILY_API_KEY=your_tavily_api_key

# Optional: Backend configuration
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
```

3. **Start the FastAPI backend:**
```bash
python backend.py
```

The backend will be available at `http://localhost:8000`

### 2. Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install Node.js dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🔧 Configuration

### API Keys Required

- **Google Gemini API** - For main AI responses
- **Groq API** - Alternative AI provider
- **Tavily API** - For web search functionality

### Optional Configuration

- **BACKEND_HOST** - Backend server host (default: 0.0.0.0)
- **BACKEND_PORT** - Backend server port (default: 8000)
- **VITE_API_URL** - Frontend API endpoint (default: http://localhost:8000)

## 📁 Project Structure

```
figaro-agent/
├── my_agent.py              # Main AI agent implementation
├── backend.py               # FastAPI backend server
├── app.py                   # Original Gradio interface (legacy)
├── requirements.txt         # Python dependencies
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript definitions
│   │   └── ...
│   └── package.json
└── README.md
```

## 🎯 Usage Examples

### Research & Analysis
- "Explain this YouTube video: https://www.youtube.com/watch?v=..."
- "Search for recent papers on quantum computing"
- "What's the latest news about AI developments?"

### Code & Technical
- "Write a Python function to sort a list"
- "Debug this code snippet"
- "Explain how neural networks work"

### Data Analysis
- "Analyze this CSV file and find patterns"
- "Extract text from this image"
- "Calculate the derivative of x²+3x+2"

## 🐳 Docker Deployment (Optional)

Create a `Dockerfile` for easy deployment:

```dockerfile
# Backend
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["python", "backend.py"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- LangChain and LangGraph teams for the AI orchestration framework
- FastAPI for the excellent Python web framework
- React and Vite teams for the frontend tooling
- All the open-source contributors who made this possible
