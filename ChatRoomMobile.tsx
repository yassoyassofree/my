import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageSquare, Users, Send, Copy, ArrowLeft, Menu, X, Check } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { useChatRoom } from '../hooks/useChatRoom';

export function ChatRoomMobile() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const { room, loading: roomLoading, error: roomError } = useChatRoom(roomId!);
  const { messages, participants, loading: chatLoading, error: chatError, sendMessage } = useChat(
    roomId!, 
    userName
  );

  const roomLink = `${window.location.origin}/room/${roomId}`;

  const copyRoomLink = async () => {
    try {
      await navigator.clipboard.writeText(roomLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      setHasJoined(true);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      sendMessage(messageInput);
      setMessageInput('');
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getOnlineParticipants = () => {
    const now = new Date();
    return participants.filter(p => {
      const lastSeen = new Date(p.last_seen);
      return now.getTime() - lastSeen.getTime() < 60000;
    });
  };

  if (roomLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading chat room...</p>
        </div>
      </div>
    );
  }

  if (roomError || !room) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-xl shadow-sm text-center max-w-sm w-full">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Room Not Found</h2>
          <p className="text-slate-600 mb-6">This chat room doesn't exist or has been deleted.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!hasJoined) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-xl shadow-sm max-w-sm w-full">
          <div className="text-center mb-6">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Join Chat Room</h2>
            <p className="text-slate-600">"{room.name}"</p>
          </div>

          <form onSubmit={handleJoinRoom} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
                Your name
              </label>
              <input
                type="text"
                id="username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name..."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Join Room
            </button>
          </form>

          <button
            onClick={() => navigate('/')}
            className="mt-4 text-slate-500 hover:text-slate-700 flex items-center justify-center space-x-2 w-full"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Mobile Header */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowSidebar(true)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h2 className="font-semibold text-slate-800">{room.name}</h2>
            <p className="text-xs text-slate-600">
              {getOnlineParticipants().length} online
            </p>
          </div>
        </div>
        <button
          onClick={copyRoomLink}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          {linkCopied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-slate-600" />}
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-slate-600">Loading messages...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.user_name === userName ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-3 rounded-2xl ${
                message.user_name === userName
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-800 border border-slate-200'
              }`}>
                {message.user_name !== userName && (
                  <div className="text-xs font-medium text-slate-600 mb-1">
                    {message.user_name}
                  </div>
                )}
                <p className="break-words">{message.content}</p>
                <div className={`text-xs mt-1 ${
                  message.user_name === userName ? 'text-blue-100' : 'text-slate-500'
                }`}>
                  {formatTime(message.created_at)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-slate-200 p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-3">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!messageInput.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white p-3 rounded-lg transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        
        {chatError && (
          <p className="text-red-600 text-sm mt-2 bg-red-50 px-3 py-2 rounded-lg">
            {chatError}
          </p>
        )}
      </div>

      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 flex">
          <div className="bg-white w-80 max-w-full shadow-xl">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-lg font-bold text-slate-800">ZulipChat</h1>
              </div>
              <button
                onClick={() => setShowSidebar(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Room Info */}
            <div className="p-6 border-b border-slate-200">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-semibold text-slate-800 mb-2">{room.name}</h3>
                <button
                  onClick={copyRoomLink}
                  className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{linkCopied ? 'Link Copied!' : 'Copy Room Link'}</span>
                </button>
              </div>
            </div>

            {/* Participants */}
            <div className="flex-1 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Users className="w-5 h-5 text-slate-600" />
                <h3 className="font-semibold text-slate-800">
                  Participants ({getOnlineParticipants().length} online)
                </h3>
              </div>
              
              <div className="space-y-2">
                {participants.map((participant) => {
                  const isOnline = getOnlineParticipants().some(p => p.id === participant.id);
                  return (
                    <div key={participant.id} className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-slate-300'}`}></div>
                      <span className={`text-sm ${isOnline ? 'text-slate-800' : 'text-slate-500'}`}>
                        {participant.user_name}
                        {participant.user_name === userName && ' (You)'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sidebar Footer */}
            <div className="p-6 border-t border-slate-200">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Leave Room</span>
              </button>
            </div>
          </div>
          
          {/* Overlay */}
          <div 
            className="flex-1 bg-black bg-opacity-50"
            onClick={() => setShowSidebar(false)}
          />
        </div>
      )}
    </div>
  );
}