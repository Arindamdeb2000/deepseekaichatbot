'use client'; // This tells the code to run on the user's computer (client-side)
import { useState } from 'react'; // Importing a tool to manage state (data) in our component

const ChatBot = () => {
  // These are like boxes to store information
  const [messages, setMessages] = useState([]); // Box to store chat messages
  const [userMessage, setUserMessage] = useState(''); // Box to store the user's message
  const [loading, setLoading] = useState(false); // Box to store if we are waiting for a response

  // Function to send a message
  const sendMessage = async () => {
    // Add the user's message to the chat
    setMessages([...messages, { text: userMessage, sender: 'user' }]);
    setUserMessage(''); // Clear the input box
    setLoading(true); // Show that we are waiting for a response

    try {
      // Send the user's message to the server
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await response.json(); // Get the response from the server

      // Add the server's response to the chat
      setMessages(prevMessages => [
        ...prevMessages, 
        { text: response.ok ? data.reply : `Error: ${data.error}`, sender: 'bot' },
      ]);
    } catch {
      // If there's an error, show an error message
      setMessages(prevMessages => [
        ...prevMessages, 
        { text: 'Error communicating with the server.', sender: 'bot' },
      ]);
    } finally {
      setLoading(false); // We are no longer waiting for a response
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      {/* This is the chat area */}
      <div className="h-80 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-600">{msg.sender === 'user' ? 'You' : 'AI'}</span>
              <div className={`px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* This is the input area */}
      <div className="flex mt-4">
        <input
          type="text"
          className="flex-grow p-2 border rounded-l-lg"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          className="p-2 bg-blue-500 text-white rounded-r-lg"
          onClick={sendMessage}
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default ChatBot; // This makes the ChatBot component available to use in other parts of the app