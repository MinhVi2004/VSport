import { useState } from "react";
const CHATBOT_URL = import.meta.env.n8n_chat_link;
const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { role: "user", text: message };
    setMessages(prev => [...prev, userMessage]);

    try {
      const res = await fetch(
        CHATBOT_URL,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: message
          })
        }
      );

      const data = await res.json();

      const botMessage = {
        role: "bot",
        text: data.reply || JSON.stringify(data)
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
    }

    setMessage("");
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white shadow-lg rounded-lg p-4">
      <div className="h-60 overflow-y-auto mb-2 border p-2 rounded">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 text-sm ${
              msg.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <span className="inline-block bg-gray-100 px-2 py-1 rounded">
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-2 py-1 text-sm"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;