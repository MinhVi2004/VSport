import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  Send,
  X,
  Loader2
} from "lucide-react";

const CHATBOT_URL =
  "http://3.106.130.203:5678/webhook/5ba0bfaf-086a-491f-b31d-9c1a78c229ff";

const suggestions = [
  "Sản phẩm dưới 1 triệu",
  "Quần thể thao",
  "Giày chạy bộ",
  "Dụng cụ thể thao",
  "Bóng đá"
];

const Chatbot = () => {
  const sessionId =
    localStorage.getItem("chat-session") || crypto.randomUUID();

  localStorage.setItem("chat-session", sessionId);

  const [isOpen, setIsOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Xin chào! Tôi có thể giúp bạn tìm sản phẩm phù hợp.",
      products: []
    }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const normalizeProducts = (products = []) =>
    products.map((p) => ({
      _id: p._id || p.id,
      name: p.name,
      price: p.price,
      image: p.image,
      quantity: p.quantity ?? 0
    }));

  const sendMessage = async (text = message) => {
    if (!text.trim()) return;

    const userMessage = {
      role: "user",
      text,
      products: []
    };

    setMessages((prev) => [...prev, userMessage]);
    setTyping(true);
    setMessage("");

    try {
      const res = await fetch(CHATBOT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: text
        })
      });

      const data = await res.json();
      const payload = Array.isArray(data) ? data[0] : data;

      let botMessage = {
        role: "bot",
        text: "",
        products: []
      };

      if (payload.output) {
        botMessage.text = payload.output;
      } else if (payload.message) {
        botMessage.text = payload.message;
        botMessage.products = normalizeProducts(payload.products);
      } else {
        botMessage.text = "Không thể xử lý phản hồi từ chatbot.";
      }

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Có lỗi khi kết nối chatbot.",
          products: []
        }
      ]);
    }

    setTyping(false);
  };

  const renderProducts = (products) => {
    if (!products || !products.length) return null;

    return products.slice(0, 4).map((p) => (
      <a
        key={p._id}
        href={`/product/${p._id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex gap-3 bg-white border rounded-xl p-2 mb-2 hover:shadow-md transition"
      >
        <img
          src={p.image}
          alt={p.name}
          className="w-16 h-16 object-cover rounded-lg"
        />

        <div className="flex flex-col justify-between flex-1">
          <p className="text-sm font-medium line-clamp-2">
            {p.name}
          </p>

          <div className="flex justify-between items-center mt-1">
            <span className="text-red-500 font-semibold text-sm">
              {p.price.toLocaleString()} VNĐ
            </span>

            <span className="text-xs text-gray-400">
              còn {p.quantity}
            </span>
          </div>
        </div>
      </a>
    ));
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 w-14 h-14 rounded-full bg-blue-500 text-white shadow-lg flex items-center justify-center z-[9999]"
      >
        <MessageCircle size={26} />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-20 right-4 w-80 bg-white shadow-xl rounded-xl flex flex-col transition-all duration-300 z-[9999] ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-2 border-b font-semibold">
          <span>AI Assistant</span>
          <button onClick={() => setIsOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="h-72 overflow-y-auto p-3 space-y-3 text-sm">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`px-3 py-2 rounded-lg max-w-[85%] ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                {msg.text && <p className="mb-2">{msg.text}</p>}
                {msg.role === "bot" && renderProducts(msg.products)}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <Loader2 className="animate-spin" size={14} />
              Bot đang trả lời...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
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
            onKeyDown={(e) =>
              e.key === "Enter" && sendMessage()
            }
            placeholder="Ví dụ: áo hiking dưới 500k"
          />

          <button
            onClick={() => sendMessage()}
            className="bg-blue-500 text-white px-3 rounded flex items-center justify-center"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Chatbot;