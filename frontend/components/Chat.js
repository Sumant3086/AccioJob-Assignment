import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function Chat({ currentSession, onSessionUpdate }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !currentSession || loading) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/ai/generate', {
        prompt: message,
        sessionId: currentSession._id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Reload the session to get updated data
      const sessionResponse = await axios.get(`/api/sessions/${currentSession._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      onSessionUpdate(sessionResponse.data);
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to generate component. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentSession) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p className="text-lg mb-2">No session selected</p>
          <p className="text-sm">Create a new session to start generating components</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">{currentSession.name}</h3>
        <p className="text-sm text-gray-500">
          {currentSession.messages.length} messages
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentSession.messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p className="text-lg mb-2">👋 Start a conversation!</p>
            <p className="text-sm">
              Ask me to create a React component. For example:
              <br />
              "Create a blue button with rounded corners"
            </p>
          </div>
        ) : (
          currentSession.messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-blue-50 ml-4'
                  : 'bg-gray-50 mr-4'
              }`}
            >
              <div className="flex items-start space-x-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-500 text-white'
                }`}>
                  {msg.role === 'user' ? 'U' : 'AI'}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{msg.content}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="bg-gray-50 mr-4 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-gray-500 text-white flex items-center justify-center text-xs font-semibold">
                AI
              </div>
              <div className="flex items-center space-x-2">
                <div className="loading-spinner"></div>
                <span className="text-sm text-gray-600">Generating component...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={sendMessage} className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe the component you want to create..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}