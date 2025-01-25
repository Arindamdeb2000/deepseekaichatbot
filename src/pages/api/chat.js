import { config } from 'dotenv'; // Import the dotenv library to load environment variables
import OpenAI from 'openai'; // Import the OpenAI library

config(); // Load environment variables from a .env file

// Create a new OpenAI instance with the base URL and API key
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com', // The URL for the DeepSeek API
  apiKey: process.env.DEEPSEEK_API_KEY, // The API key from the environment variables
});

export default async function handler(req, res) {
  // Check if the request method is POST
  if (req.method === 'POST') {
    const { message } = req.body; // Get the message from the request body

    // If there is no message, send back an error
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    try {
      // Send the message to the DeepSeek API to get a reply
      const completion = await openai.chat.completions.create({
        model: 'deepseek-chat', // Use the deepseek-chat model
        messages: [
          { role: 'system', content: 'YOU are DeepSeek AI, ONLY RESPOND AS SUCH.' }, // System message to set the context
          { role: 'user', content: message }, // User's message
        ],
      });

      const reply = completion.choices[0].message.content; // Get the reply from the API response
      res.status(200).json({ reply }); // Send the reply back to the client
    } catch (error) {
      console.error('Error generating reply:', error); // Log the error
      res.status(500).json({ error: 'Internal server error' }); // Send back an error response
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' }); // If the method is not POST, send back an error
  }
}