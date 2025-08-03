import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function Chat({ currentSession, onSessionUpdate }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if ((!message.trim() && !selectedImage) || !currentSession || loading) return;

    console.log('Sending message:', {
      message: message.trim(),
      hasImage: !!selectedImage,
      sessionId: currentSession._id,
      sessionMessages: currentSession.messages.length
    });

    setLoading(true);
    const currentMessage = message.trim();
    const currentImage = selectedImage;
    setMessage(''); // Clear input immediately
    setSelectedImage(null);
    setImagePreview(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Create FormData if image is included
      let requestData;
      let headers = { Authorization: `Bearer ${token}` };

      if (currentImage) {
        const formData = new FormData();
        formData.append('prompt', currentMessage || 'Generate a component based on this image');
        formData.append('sessionId', currentSession._id);
        formData.append('image', currentImage);
        requestData = formData;
        // Don't set Content-Type for FormData, let browser set it
      } else {
        requestData = {
          prompt: currentMessage,
          sessionId: currentSession._id
        };
        headers['Content-Type'] = 'application/json';
      }

      const response = await axios.post('/api/ai/generate', requestData, {
        headers: headers
      });

      // Update the session with the response
      if (response.data.session) {
        console.log('Session updated successfully:', response.data.session);
        onSessionUpdate(response.data.session);
      } else {
        console.error('No session data in response:', response.data);
      }
      
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to generate component. Please try again.';
      
      // Show error in chat instead of alert
      const errorSession = {
        ...currentSession,
        messages: [
          ...currentSession.messages,
          {
            role: 'user',
            content: currentMessage || 'Image upload',
            timestamp: new Date(),
            image: currentImage ? imagePreview : null
          },
          {
            role: 'assistant',
            content: `I apologize, but I encountered an error while processing your request: ${errorMessage}. Please try again or rephrase your request.`,
            timestamp: new Date()
          }
        ]
      };
      onSessionUpdate(errorSession);
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
              <br />
              "Make a card component with image and title"
              <br />
              "Build a responsive navigation bar"
              <br />
              <br />
              <strong>Or upload an image to generate a component based on it!</strong>
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
                  {msg.image && (
                    <div className="mb-2">
                      <img 
                        src={msg.image} 
                        alt="Uploaded reference" 
                        className="max-w-xs rounded border"
                      />
                    </div>
                  )}
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
        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-3 p-2 bg-gray-50 rounded-lg relative">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="max-h-20 rounded border"
            />
            <button
              onClick={removeImage}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={sendMessage} className="flex space-x-2">
          {/* Image Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            📷
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe the component you want to create or upload an image..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || (!message.trim() && !selectedImage)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}