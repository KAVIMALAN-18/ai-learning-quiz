# AI Learning Platform - Enterprise EdTech Solution

## Overview
The AI Learning Platform is a sophisticated educational application designed to provide personalized learning experiences through Generative AI. By leveraging the Google Gemini API, the platform dynamically generates tailored roadmaps and adaptive assessments, allowing users to master technical topics with curated, milestone-based guidance.

## Key Features

### User Experience
- **Personalized Learning Paths**: Automated roadmap generation based on user goals and technical proficiency.
- **Adaptive Assessments**: Interactive quizzes with real-time feedback and performance analytics.
- **AI Tutoring Interface**: Integrated conversational AI for concept clarification and guidance.
- **Performance Visualization**: Comprehensive dashboard for tracking learning progress and mastery metrics.

### Technical Implementation
- **Micro-service Architecture Logic**: Decoupled frontend and backend for independent scalability.
- **Secure Authentication**: Stateless JWT-based authentication with protected route boundaries.
- **Security Hardening**: Implementation of HTTP security headers (Helmet), CORS policies, and rate limiting.
- **Performance Optimization**: Gzip compression, memoized components, and optimized asset loading.

## Technology Stack

### Frontend
- **React**: Component-based UI library utilizing Hooks and Context API.
- **Tailwind CSS**: Professional design system and utility-based styling.
- **React Router**: Client-side routing with navigation guards.
- **Vite**: Modern build tool optimized for performance.

### Backend
- **Node.js & Express**: Scalable application server.
- **MongoDB & Mongoose**: NoSQL document storage with schema validation.
- **Google Gemini AI**: Large Language Model integration for dynamic content.
- **JWT**: Industry-standard token-based authentication.

## Project Structure

```text
├── server/               # Node.js backend
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Auth, Logging, Security
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API endpoints
│   └── utils/            # AI and helper utilities
├── src/                  # React frontend
│   ├── components/       # Reusable UI components
│   ├── context/          # Auth and global state
│   ├── pages/            # View components
│   └── services/         # API integration layer
└── vercel.json           # SPA routing configuration
```

## Installation and Setup

### Prerequisites
- Node.js (Long Term Support version)
- MongoDB Atlas account or local installation
- Google AI Studio API key

### Local Installation

1. **Clone Repository**
   ```bash
   git clone https://github.com/your-username/ai-learning-platform.git
   cd ai-learning-platform
   ```

2. **Frontend Configuration**
   ```bash
   npm install
   ```
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Backend Configuration**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGO_URI=[your_mongodb_uri]
   JWT_SECRET=[your_jwt_secret]
   GEMINI_API_KEY=[your_gemini_api_key]
   FRONTEND_URL=http://localhost:5173
   ```

4. **Execution**
   ```bash
   # From the server directory
   npm start
   
   # From the root directory (in a new terminal)
   npm run dev
   ```

## Deployment
This application is configured for deployment on Vercel (Frontend) and Render/Railway (Backend). Ensure all production environment variables are configured in the respective hosting dashboards.

## Future Enhancements
- Integration of collaborative learning features and peer-to-peer discussions.
- Expansion of the AI tutoring capabilities using RAG (Retrieval-Augmented Generation).
- Advanced analytics for predictive learning outcome modeling.

## License
Distributed under the MIT License.
