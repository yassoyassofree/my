import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { ChatRoom } from './components/ChatRoom';
import { ChatRoomMobile } from './components/ChatRoomMobile';

function App() {
  // Detect mobile devices
  const isMobile = window.innerWidth < 768;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/room/:roomId" 
          element={isMobile ? <ChatRoomMobile /> : <ChatRoom />} 
        />
      </Routes>
    </Router>
  );
}

export default App;