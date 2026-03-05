import { useState, useRef, useEffect } from "react";

const CHATBOT_URL = import.meta.env.VITE_N8N_CHAT_LINK;

const suggestions = [
  "Áo hiking dưới 500k",
  "Quần trekking",
  "Sản phẩm bán chạy",
  "Đồ outdoor cho leo núi"
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Xin chào 👋 Tôi có thể giúp bạn tìm sản phẩm phù hợp."
    }
  ]);
  const [typing, setTyping] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = async (text = message) => {
    console.log("link" + CHATBOT_URL)
    if (!text.trim()) return;

    const userMessage = { role: "user", text };
    setMessages(prev => [...prev, userMessage]);
    setTyping(true);
    setMessage("");

    try {
      const res = await fetch(CHATBOT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: text })
      });

      const data = await res.json();

      const botMessage = {
        role: "bot",
        text: data.reply || JSON.stringify(data)
      };

      setMessages(prev => [...prev, botMessage]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "bot", text: "Có lỗi khi kết nối chatbot." }
      ]);
    }

    setTyping(false);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 w-14 h-14 rounded-full bg-blue-500 text-white shadow-lg flex items-center justify-center z-[9999]"
      >
        <i className="fa-solid fa-comments"></i>
      </button>

      {/* Chat Window */}
      <div
        className={`fixed z-50 bottom-20 right-4 w-80 bg-white shadow-xl rounded-xl flex flex-col transition-all duration-300 z-[9999] ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-2 border-b font-semibold">
          <span className="flex items-center gap-2">
            <i className="fa-solid fa-robot text-blue-500"></i>
            AI Assistant
          </span>

          <button onClick={() => setIsOpen(false)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Messages */}
        <div className="h-64 overflow-y-auto p-3 space-y-2 text-sm">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-3 py-2 rounded-lg max-w-[70%] ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {typing && (
            <div className="text-gray-500 text-xs flex items-center gap-2">
              <i className="fa-solid fa-robot"></i>
              typing...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick suggestions */}
        <div className="px-2 pb-2 flex flex-wrap gap-2">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => sendMessage(s)}
              className="text-xs border rounded-full px-2 py-1 hover:bg-gray-100"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex border-t p-2 gap-2">
          <input
            className="flex-1 border rounded px-2 py-1 text-sm"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ví dụ: áo hiking dưới 500k"
          />

          <button
            onClick={() => sendMessage()}
            className="bg-blue-500 text-white px-3 rounded"
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </>
  );
};

export default Chatbot;