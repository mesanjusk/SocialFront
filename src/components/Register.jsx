// WhatsApp Multi-User Frontend (React) with QR scanning, session management, message sending
// Copy-paste directly for your 'client' folder

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Adjust for your backend URL

const WhatsAppClient = () => {
  const [sessionId, setSessionId] = useState('');
  const [qr, setQr] = useState('');
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [number, setNumber] = useState('');
  const [message, setMessage] = useState('');

  const startSession = async () => {
    if (!sessionId) return alert('Enter session ID');
    await axios.post('http://localhost:5000/api/whatsapp/start-session', { sessionId });
    socket.on(`qr-${sessionId}`, data => setQr(data));
    socket.on(`ready-${sessionId}`, () => {
      setReady(true);
      setAuthenticated(true);
      setQr('');
    });
    socket.on(`authenticated-${sessionId}`, () => setAuthenticated(true));
    socket.on(`auth_failure-${sessionId}`, () => alert('Authentication failed, retry'));
    socket.on(`disconnected-${sessionId}`, () => {
      setReady(false);
      setAuthenticated(false);
      setQr('');
      alert('Disconnected, please scan QR again');
    });
  };

  const sendMessage = async () => {
    if (!number || !message) return alert('Enter number and message');
    try {
      await axios.post('http://localhost:5000/api/whatsapp/send', {
        sessionId,
        number,
        message
      });
      alert('Message sent');
    } catch (error) {
      alert('Error sending message');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <h1 className="text-2xl mb-4">WhatsApp Multi-User Client</h1>
      <input
        type="text"
        placeholder="Session ID"
        value={sessionId}
        onChange={e => setSessionId(e.target.value)}
        className="p-2 rounded mb-2 text-black"
      />
      <button onClick={startSession} className="bg-green-500 px-4 py-2 rounded mb-4">Start Session</button>

      {qr && (
        <div className="mb-4">
          <img src={qr} alt="QR Code" className="w-64 h-64" />
          <p className="mt-2">Scan QR with WhatsApp</p>
        </div>
      )}

      {authenticated && (
        <div className="flex flex-col items-center">
          <input
            type="text"
            placeholder="Phone Number (e.g., 919876543210)"
            value={number}
            onChange={e => setNumber(e.target.value)}
            className="p-2 rounded mb-2 text-black"
          />
          <textarea
            placeholder="Type your message here..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="p-2 rounded mb-2 text-black w-64 h-24"
          />
          <button onClick={sendMessage} className="bg-blue-500 px-4 py-2 rounded">Send Message</button>
        </div>
      )}
    </div>
  );
};

export default WhatsAppClient;

/*
📌 What this frontend supports:
✅ Enter session ID to start WhatsApp session (multi-user SaaS)
✅ Displays live QR for scanning
✅ Shows session status (authenticated, ready)
✅ Send messages to phone numbers using session
✅ Uses socket.io for real-time QR and status updates
✅ Tailwind CSS ready (add to your project for styling)

To use:
- Add to your React project (create WhatsAppClient.jsx).
- Import and use in your App.js: <WhatsAppClient />
- Ensure backend CORS is set and running on port 5000.
- For production, adjust URLs and secure with JWT auth.

If you need JWT-protected routes, session persistence in UI, or admin dashboards with multi-user management next, let me know.
*/
