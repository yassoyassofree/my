import { useState, useEffect, useCallback } from 'react';
import { supabase, type Message, type RoomParticipant } from '../lib/supabase';

export function useChat(roomId: string, userName: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<RoomParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial messages
  const loadMessages = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    }
  }, [roomId]);

  // Load participants
  const loadParticipants = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('room_participants')
        .select('*')
        .eq('room_id', roomId)
        .order('joined_at', { ascending: true });

      if (error) throw error;
      setParticipants(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load participants');
    }
  }, [roomId]);

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          room_id: roomId,
          user_name: userName,
          content: content.trim()
        });

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    }
  }, [roomId, userName]);

  // Join room
  const joinRoom = useCallback(async () => {
    try {
      const { error } = await supabase
        .from('room_participants')
        .upsert({
          room_id: roomId,
          user_name: userName,
          last_seen: new Date().toISOString()
        }, {
          onConflict: 'room_id,user_name'
        });

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join room');
    }
  }, [roomId, userName]);

  // Update presence
  const updatePresence = useCallback(async () => {
    try {
      const { error } = await supabase
        .from('room_participants')
        .update({ last_seen: new Date().toISOString() })
        .eq('room_id', roomId)
        .eq('user_name', userName);

      if (error) throw error;
    } catch (err) {
      console.error('Failed to update presence:', err);
    }
  }, [roomId, userName]);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      await Promise.all([
        loadMessages(),
        loadParticipants(),
        joinRoom()
      ]);
      
      if (mounted) {
        setLoading(false);
      }
    };

    initialize();

    // Set up real-time subscriptions
    const messagesSubscription = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`
      }, (payload) => {
        if (mounted) {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      })
      .subscribe();

    const participantsSubscription = supabase
      .channel('participants')
      .on('postgres_changes', {
        event: '*',
        schema: 'public', 
        table: 'room_participants',
        filter: `room_id=eq.${roomId}`
      }, () => {
        if (mounted) {
          loadParticipants();
        }
      })
      .subscribe();

    // Update presence every 30 seconds
    const presenceInterval = setInterval(updatePresence, 30000);

    return () => {
      mounted = false;
      messagesSubscription.unsubscribe();
      participantsSubscription.unsubscribe();
      clearInterval(presenceInterval);
    };
  }, [roomId, userName, loadMessages, loadParticipants, joinRoom, updatePresence]);

  return {
    messages,
    participants,
    loading,
    error,
    sendMessage
  };
}