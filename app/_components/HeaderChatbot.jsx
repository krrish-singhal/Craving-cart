// components/HeaderChatbot.jsx
"use client";

import { useState, useRef, useEffect } from "react";

export default function HeaderChatbot({ open, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!open) return null;

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: data.reply || "No response" },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Error: " + err.message },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="fixed top-0 right-0 h-screen w-[350px] bg-white dark:bg-gray-900 shadow-2xl z-[100] flex flex-col border-l border-gray-200 dark:border-gray-800 transition-transform duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <span className="font-bold text-lg text-green-600">Craving Detective</span>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-500 text-xl font-bold"
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm shadow ${
                msg.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-green-500 text-white"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-2 rounded-2xl bg-green-500 text-white text-sm shadow animate-pulse">
              ...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className="p-4 border-t flex gap-2 bg-white dark:bg-gray-900"
      >
        <input
          className="flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring focus:ring-green-400 dark:bg-gray-800 dark:text-white"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}
