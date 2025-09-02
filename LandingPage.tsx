import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Users, Zap, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export function LandingPage() {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const createChatRoom = async () => {
    setCreating(true);
    setError(null);

    try {
      const roomId = uuidv4();
      const roomName = `Chat Room ${new Date().toLocaleDateString()}`;
      
      const { error } = await supabase
        .from('chat_rooms')
        .insert({
          id: roomId,
          name: roomName,
          created_by: 'Anonymous'
        });

      if (error) throw error;

      // Navigate to the new room
      navigate(`/room/${roomId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create room');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">ZulipChat</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-slate-800 mb-6 leading-tight">
            Real-time collaboration
            <br />
            <span className="text-blue-600">made simple</span>
          </h2>
          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Create instant chat rooms and collaborate with your team in real-time. 
            Share a link and start chatting immediately.
          </p>

          {/* CTA Button */}
          <div className="mb-16">
            <button
              onClick={createChatRoom}
              disabled={creating}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {creating ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Room...</span>
                </div>
              ) : (
                'Create New Chat Room'
              )}
            </button>
            
            {error && (
              <p className="text-red-600 mt-4 bg-red-50 px-4 py-2 rounded-lg inline-block">
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Instant Setup</h3>
            <p className="text-slate-600 leading-relaxed">
              Create a chat room in seconds. No sign-up required, just click and start chatting with your team.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <Users className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Real-time Collaboration</h3>
            <p className="text-slate-600 leading-relaxed">
              See messages instantly as they're typed. Watch participants join and engage in real-time.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Secure & Private</h3>
            <p className="text-slate-600 leading-relaxed">
              Your conversations are secure with unique room links that only invited participants can access.
            </p>
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-slate-800 mb-8 text-center">How it works</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">1</div>
              <h4 className="font-semibold text-slate-800 mb-2">Create Room</h4>
              <p className="text-slate-600">Click the button above to generate a unique chat room</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">2</div>
              <h4 className="font-semibold text-slate-800 mb-2">Share Link</h4>
              <p className="text-slate-600">Copy and share the room link with your team members</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">3</div>
              <h4 className="font-semibold text-slate-800 mb-2">Start Chatting</h4>
              <p className="text-slate-600">Begin your real-time conversation immediately</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-slate-600">
            Built with React, Supabase, and inspired by Zulip's beautiful design
          </p>
        </div>
      </footer>
    </div>
  );
}