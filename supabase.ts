import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface ChatRoom {
  id: string;
  name: string;
  created_at: string;
  created_by: string;
}

export interface Message {
  id: string;
  room_id: string;
  user_name: string;
  content: string;
  created_at: string;
}

export interface RoomParticipant {
  id: string;
  room_id: string;
  user_name: string;
  joined_at: string;
  last_seen: string;
}