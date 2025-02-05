import ChatBot from '../components/ChatBot';

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">ARI's AI Chatbot - Powered by DeepSeek</h1>

      <ChatBot />
    </div>
  );
}
