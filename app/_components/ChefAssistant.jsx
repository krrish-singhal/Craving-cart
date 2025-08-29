"use client";
import { useState } from "react";

export default function ChefAssistant() {
  const [userMessage, setUserMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChat = async () => {
    if (!userMessage.trim()) return;

    setLoading(true);
    setReply("");
    setError("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessage }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      setReply(data.reply || "No reply received.");
    } catch (err) {
      console.error("Chat error:", err);
      setError("❌ Error communicating with assistant.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 rounded-xl bg-white shadow-md space-y-4 max-w-lg">
      <h2 className="text-xl font-bold">🍳 Gemini Chef Assistant</h2>

      <input
        className="border p-2 w-full"
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        placeholder="What are you craving?"
      />

      <button
        className="bg-green-500 text-white px-4 py-2 rounded w-full"
        onClick={handleChat}
        disabled={loading}
      >
        {loading ? "Thinking..." : "Ask"}
      </button>

      {reply && (
        <div className="bg-gray-100 p-3 rounded-md text-sm whitespace-pre-wrap">
          🍽️ <strong>Chef:</strong> {reply}
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
