# ContentMaster AI - Automated Journalism Platform

Transform your content creation with AI-powered journalism automation. Find trending news, rewrite with professional journalist styles, and optimize for maximum revenue.

## Features

### 🔍 Real-Time News Discovery
- Search trending news with viral potential scoring
- Revenue intelligence analysis
- Estimated reach calculations
- Keyword-based discovery

### ✍️ Professional Journalist Styles
- Create custom writing personas
- Tech Blogger, Formal Reporter, Casual Influencer, and more
- Tone adjustment options
- Style-specific rewriting with AI

### 💰 Revenue Optimization
- SEO optimization tools
- Content performance analytics
- Monetization strategies
- A/B testing variations

### 🤖 AI Copilot Assistant
- Interactive chat interface
- Function calling with 6 specialized agents
- Context-aware recommendations
- Keyboard shortcuts (⌘K to open)

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Backend**: Next.js API Routes, Supabase
- **AI**: Groq (Llama 3.3 70B), Vercel AI SDK v5
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- Groq API key

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables (already configured via Vercel integrations):
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `GROQ_API_KEY`

4. Run database migrations:
   - Execute scripts in order:
     - `scripts/001_create_tables.sql`
     - `scripts/002_create_advanced_copilot_tables.sql`
     - `scripts/003_journalist_styles_system.sql`

5. Start development server:
   \`\`\`bash
   npm run dev
   \`\`\`

6. Open [http://localhost:3000](http://localhost:3000)

## Database Schema

### Core Tables
- `user_profiles` - User information and credits
- `conversations` - Chat conversations
- `messages` - Chat messages

### Copilot Tables
- `copilot_sessions` - AI interaction sessions
- `copilot_interactions` - Individual queries and responses
- `copilot_actions` - Executed actions with feedback

### Journalism Tables
- `journalist_styles` - Custom writing personas
- `news_articles` - Discovered news articles
- `article_rewrites` - Rewritten versions with styles

## API Routes

### News & Articles
- `POST /api/news/search` - Search for trending news
- `GET /api/articles` - List user articles
- `POST /api/articles/rewrite` - Rewrite article with style

### Journalist Styles
- `GET /api/styles` - List user styles
- `POST /api/styles` - Create new style

### Copilot
- `POST /api/copilot/advanced-chat` - Chat with AI agents
- `GET /api/copilot/conversations` - List conversations
- `POST /api/copilot/conversations` - Create conversation

## Usage

### Finding Trending News

1. Go to Dashboard → News Search
2. Enter keywords and niche
3. View results with viral/revenue scores
4. Top recommendations highlighted automatically

### Creating Journalist Styles

1. Go to Dashboard → Writing Styles
2. Click "Create New Style"
3. Define name, description, tone, and example
4. Set as default (optional)
5. Save and use in rewrites

### Rewriting Articles

1. Select an article from search results
2. Choose journalist style
3. Set target audience and tone adjustment
4. Click "Rewrite Article"
5. Copy optimized content

### Using AI Copilot

1. Go to Copilot page or press ⌘K anywhere
2. Start conversation or use quick actions
3. AI uses specialized tools automatically:
   - **NewsHunter** - Find viral news
   - **StyleExpert** - Rewrite content
   - **RevenueIntelligence** - Analyze monetization
   - **SEOMaster** - Optimize for search
   - **ContentLab** - A/B testing
   - **StrategyArchitect** - Content planning

## Keyboard Shortcuts

- `⌘K` or `Ctrl+K` - Open Copilot
- `Escape` - Close Copilot
- `Enter` - Send message
- `Shift+Enter` - New line

## Contributing

This is a v0.dev generated project. Feel free to customize and extend!

## License

MIT
