import { useState, useEffect } from 'react';
import { supabase, type ChatRoom } from '../lib/supabase';

export function useChatRoom(roomId: string) {
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRoom = async () => {
      try {
        const { data, error } = await supabase
          .from('chat_rooms')
          .select('*')
          .eq('id', roomId)
          .single();

        if (error) throw error;
        setRoom(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Room not found');
      } finally {
        setLoading(false);
      }
    };

    if (roomId) {
      loadRoom();
    }
  }, [roomId]);

  return { room, loading, error };
}