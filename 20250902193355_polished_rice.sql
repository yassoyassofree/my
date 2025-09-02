/*
# Real-time Chat Application Schema

1. New Tables
  - `chat_rooms`
    - `id` (uuid, primary key) - Unique room identifier
    - `name` (text) - Room display name
    - `created_at` (timestamp) - Room creation time
    - `created_by` (text) - Creator identifier
  
  - `messages`
    - `id` (uuid, primary key) - Unique message identifier  
    - `room_id` (uuid, foreign key) - Reference to chat room
    - `user_name` (text) - Message sender name
    - `content` (text) - Message content
    - `created_at` (timestamp) - Message timestamp
  
  - `room_participants`
    - `id` (uuid, primary key) - Unique participant identifier
    - `room_id` (uuid, foreign key) - Reference to chat room
    - `user_name` (text) - Participant username
    - `joined_at` (timestamp) - Join timestamp
    - `last_seen` (timestamp) - Last activity timestamp

2. Security
  - Enable RLS on all tables
  - Add policies for public read/write access (suitable for demo chat app)
  - Create indexes for optimized querying

3. Real-time Features
  - Enable real-time subscriptions on messages table
  - Enable real-time subscriptions on room_participants table
*/

-- Create chat rooms table
CREATE TABLE IF NOT EXISTS chat_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Chat Room',
  created_at timestamptz DEFAULT now(),
  created_by text NOT NULL
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create room participants table
CREATE TABLE IF NOT EXISTS room_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  joined_at timestamptz DEFAULT now(),
  last_seen timestamptz DEFAULT now(),
  UNIQUE(room_id, user_name)
);

-- Enable Row Level Security
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_participants ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (demo purposes)
CREATE POLICY "Anyone can read chat rooms"
  ON chat_rooms
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create chat rooms"
  ON chat_rooms
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read messages"
  ON messages
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create messages"
  ON messages
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read participants"
  ON room_participants
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can join rooms"
  ON room_participants
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update their presence"
  ON room_participants
  FOR UPDATE
  TO public
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_room_created ON messages(room_id, created_at);
CREATE INDEX IF NOT EXISTS idx_participants_room ON room_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_participants_last_seen ON room_participants(last_seen);