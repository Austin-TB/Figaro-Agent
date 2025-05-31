# Figaro Frontend

A modern, clean, and interactive chat interface for the Figaro AI Assistant.

## Features

- 🎨 Modern, minimal design with dark theme
- 💬 Real-time chat interface with typing indicators
- 📱 Responsive design that works on all devices
- 🔄 Auto-scroll to latest messages
- 🌐 Connection status indicator
- ✨ Smooth animations and transitions
- 📝 **Rich Markdown support** for enhanced message formatting
- 🎯 Example prompts for quick start

## Markdown Support

The chat interface now supports rich markdown formatting in assistant responses, including:

- **Headers** (H1-H6) with proper styling
- **Code blocks** with syntax highlighting support
- **Inline code** with distinctive styling
- **Bold** and *italic* text
- **Lists** (ordered and unordered)
- **Blockquotes** for emphasizing important information
- **Links** with hover effects
- **Tables** with proper borders and formatting
- **Horizontal rules** for content separation

### Supported Markdown Features

```markdown
# Headers from H1 to H6

**Bold text** and *italic text*

`inline code` and code blocks:

```python
def hello_world():
    print("Hello, World!")
```

> Blockquotes for important notes

- Bullet lists
- With multiple items

1. Numbered lists
2. Also supported

[Links](https://example.com) work too!

| Tables | Are | Supported |
|--------|-----|-----------|
| Row 1  | A   | B         |
| Row 2  | C   | D         |
```

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Markdown** for rich text rendering
- **Axios** for API communication

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Environment Variables

Create a `.env` file in the frontend directory with:

```
VITE_API_URL=http://localhost:8000
```

## Build for Production

```bash
npm run build
```

## API Integration

The frontend communicates with the FastAPI backend running on port 8000. Make sure the backend is running before starting the frontend.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License
