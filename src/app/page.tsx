import ChatBot from '../components/ChatBot';

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">DeepSeek AI Chatbot</h1>

      <ChatBot />
    </div>
  );
}