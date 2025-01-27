import { config } from 'dotenv'; 
import OpenAI from 'openai'; 
import Cors from 'cors'; // Import CORS middleware

config();

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
});

// Initialize CORS middleware
const allowedOrigins = [
  'chrome-extension://ilnldeadibcliefkfmhcboanoaciaaon',  // Replace <YOUR_EXTENSION_ID> with the actual ID of your unpacked extension
  //'https://yourwebsite.com',  // Optionally allow other trusted websites (replace with actual URLs)
];

const cors = Cors({
  methods: ['GET', 'POST'],
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);  // Allow the request if it's from a trusted origin
    } else {
      callback(new Error('Not allowed by CORS'), false);  // Reject the request if it's not from a trusted origin
    }
  },
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  await runMiddleware(req, res, cors); // Apply CORS middleware

  if (req.method === 'POST') {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    try {
      const completion = await openai.chat.completions.create({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'YOU are DeepSeek AI, ONLY RESPOND AS SUCH.' },
          { role: 'user', content: message },
        ],
      });

      const reply = completion.choices[0].message.content;
      res.status(200).json({ reply });
    } catch (error) {
      console.error('Error generating reply:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
