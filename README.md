# ZulipChat - Real-time Chat Application

A beautiful real-time chat application inspired by Zulip's clean interface design. Create instant chat rooms, share links, and collaborate with your team in real-time.

## Features

- **Instant Room Creation**: Generate unique chat rooms with shareable links
- **Real-time Messaging**: Live updates using Supabase subscriptions
- **Zulip-inspired Design**: Clean, professional interface with sidebar navigation
- **Multi-device Support**: Responsive design for desktop and mobile
- **User Presence**: See who's online and active in real-time
- **Message History**: Persistent chat history and timestamps

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### 1. Clone and Install

```bash
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key from Settings > API
3. Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Database Setup

The application will automatically create the necessary database tables when you connect to Supabase. The schema includes:

- **chat_rooms**: Store room information and metadata
- **messages**: Store all chat messages with user attribution
- **room_participants**: Track users and their presence status

### 4. Run the Application

```bash
npm run dev
```

Visit `http://localhost:5173` to start using the application.

## Usage

1. **Create a Room**: Click "Create New Chat Room" on the landing page
2. **Share the Link**: Copy the generated room link and share it with others
3. **Join and Chat**: Enter your name and start chatting in real-time
4. **Collaborate**: See who's online and engage in live conversations

## Architecture

- **Frontend**: React with TypeScript and Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Real-time subscriptions)
- **Routing**: React Router for navigation
- **State Management**: React hooks and local state
- **Icons**: Lucide React for consistent iconography

## Security Features

- Row Level Security (RLS) enabled on all tables
- Public read/write policies for demo purposes
- UUID-based room identifiers for security
- Input validation and error handling

## Deployment

Build for production:

```bash
npm run build
```

Deploy the `dist` folder to any static hosting service (Vercel, Netlify, etc.).

## Contributing

This is a demonstration application. Feel free to extend it with additional features like:

- User authentication
- Message reactions
- File uploads
- Private rooms
- Message search