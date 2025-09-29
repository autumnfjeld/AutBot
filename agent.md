# Agent Instructions for AutBot Resume App

## Project Overview
AutBot is a Retrieval-Augmented Generation (RAG) application that serves as Autumn's interactive resume. Users can ask questions about Autumn's work experience, skills, and background, and receive AI-powered responses based on her resume data.

**Live Demo**: https://autbot.vercel.app/

## Tech Stack

### Frontend (React + Vite)
- **Framework**: React 19.1.0 with Vite 6.3.5
- **Styling**: Tailwind CSS 4.1.6
- **Build Tool**: Vite with React plugin
- **Linting**: ESLint with React hooks and refresh plugins
- **Structure**: Well-organized component-based architecture

### Backend (Python + FastAPI)
- **Framework**: FastAPI 0.110.0 with Uvicorn
- **RAG Engine**: LlamaIndex for document processing and retrieval
- **LLM**: OpenAI integration for response generation
- **Testing**: Pytest for backend testing
- **Deployment**: Heroku with Procfile

## Architecture

### Frontend Structure
```
client/src/
├── components/          # React components (Header, QueryForm, ResponseDisplay, Footer, SamplePrompts)
├── hooks/              # Custom React hooks (useQuery)
├── assets/             # Static assets (RobotIcon, images)
├── App.jsx             # Main application component
├── config.js           # API configuration
└── main.jsx            # Application entry point
```

### Backend Structure
```
server-python/
├── main.py             # FastAPI application entry point
├── agent.py            # RAG agent implementation
├── llm_engine.py       # LLM integration and query processing
├── routes.py           # API route definitions
├── models.py           # Data models
├── config.py           # Configuration management
├── data/               # Resume and document data
├── tests/              # Test files
└── scripts/            # Utility scripts
```

## Key Features

### User Interface
- **Interactive Chat**: Clean, modern interface with input field and response display
- **Sample Prompts**: Four curated example questions to help users get started
- **Robot Branding**: Custom robot icon (🤖) for thematic consistency
- **Responsive Design**: Mobile-friendly layout with Tailwind CSS
- **Loading States**: Proper loading indicators and disabled states

### RAG Capabilities
- **Document Processing**: LlamaIndex-powered document ingestion and indexing
- **Semantic Search**: Intelligent retrieval of relevant information
- **Context-Aware Responses**: AI-generated responses based on resume data
- **Error Handling**: Robust error handling and user feedback

## Development Guidelines

### Code Style
- **React**: Functional components with hooks, ES6+ features, use 
- **Typescript**: All props and  components must be properly typed with with latest typescript convention
- **Python**: PEP 8 compliance, type hints where appropriate
- **Indentation**: 2 spaces for JavaScript/JSX, 4 spaces for Python
- **Naming**: Descriptive variable and function names

### Component Architecture
- **Single Responsibility**: Each component has one clear purpose
- **Composition over Inheritance**: Components composed together
- **Props Down, Events Up**: Data flows down via props, events bubble up
- **Custom Hooks**: Business logic separated into reusable hooks

### File Organization
- **Components**: Organized in `/components` with index exports
- **Hooks**: Custom hooks in `/hooks` directory
- **Assets**: Icons and images in `/assets`
- **Configuration**: Environment-based config management

## API Endpoints

### Query Endpoint
- **POST** `/api/query`
- **Purpose**: Submit questions about Autumn's background
- **Request**: `{"query": "string"}`
- **Response**: `{"response": "string"}`

### Health Check
- **GET** `/api/test`
- **Purpose**: Verify server status

### Important
- Follow code convention rules in .cursor/rules/react-typescript.mdc

## Testing

### Frontend Testing
- **Manual Testing**: Component functionality and user interactions
- **API Integration**: Verify query submission and response handling
- **Styling**: Cross-browser compatibility and responsive design

### Backend Testing
- **Unit Tests**: Pytest for individual functions and components
- **API Tests**: Endpoint testing with curl commands
- **Integration Tests**: Full query-to-response workflow

## Deployment

### Frontend (Vercel)
- **Auto-deployment**: GitHub push triggers Vercel deployment
- **Domain**: https://autbot.vercel.app/
- **Build**: Vite production build

### Backend (Heroku)
- **App**: autbot-backend
- **Deployment**: Git subtree push to Heroku
- **Logging**: Heroku logs with AUTBOT filtering
- **Health Check**: https://autbot-backend-f8bf47922e24.herokuapp.com/api/test

## Security & Configuration

### Environment Variables
- **Frontend**: API_BASE_URL for backend connection
- **Backend**: OPENAI_API_KEY, database connections
- **Never commit**: API keys or sensitive configuration

### Error Handling
- **User Feedback**: Clear error messages for failed requests
- **Graceful Degradation**: App continues to function with partial failures
- **Logging**: Comprehensive logging for debugging

## Documentation

### Project Documentation
- **README.md**: Setup and deployment instructions
- **CHANGELOG.md**: Version history and feature updates
- **VERSIONING.md**: Version management strategy
- **Component README**: Detailed component documentation

### Code Documentation
- **Inline Comments**: Complex logic explanations
- **Component Props**: JSDoc-style prop documentation
- **API Documentation**: FastAPI auto-generated docs

## Communication Style
- **Clear and Concise**: Direct, actionable guidance
- **Examples**: Provide code examples when helpful
- **Reasoning**: Explain the "why" behind suggestions
- **Proactive**: Suggest improvements and best practices
- **Context-Aware**: Consider the current codebase state

## Recent Updates (v0.3.0)
- **Major Refactoring**: Restructured React app with proper component organization
- **Sample Prompts**: Added interactive example questions with robot branding
- **Custom Hooks**: Implemented useQuery hook for API state management
- **Improved UX**: Better loading states and error handling
- **Code Quality**: Enhanced maintainability and testability 
