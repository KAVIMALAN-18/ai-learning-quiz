import { useState, useEffect, useRef } from "react";
import dashboardService from "../services/dashboard.service";
import { Send, Bot } from "lucide-react";
import { useAuth } from "../context/useAuth";

const TopicChat = ({ topics = [] }) => {
  const { user, loading: authLoading } = useAuth();
  const [selectedTopic, setSelectedTopic] = useState(
    Array.isArray(topics) && topics.length > 0 ? topics[0] : ""
  );
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  const safeText = (value) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "number" && isNaN(value)) return "";
    return String(value);
  };

  // Keep selectedTopic in sync when topics prop changes
  useEffect(() => {
    if (!Array.isArray(topics)) return;
    if (topics.length === 0) {
      setSelectedTopic("");
      setMessages([]);
      return;
    }
    // If current selectedTopic is missing or not in new list, pick first
    if (!selectedTopic || !topics.includes(selectedTopic)) {
      setSelectedTopic(topics[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topics]);

  // Load history when topic changes
  useEffect(() => {
    let cancelled = false;
    const loadHistory = async () => {
      setError(null);
      if (!selectedTopic) {
        setMessages([]);
        return;
      }

      try {
        const res = await dashboardService.getChatMessages(selectedTopic);
        if (cancelled) return;
        const serverMessages = res?.messages || [];
        const normalized = serverMessages.map((m) => ({
          role: m.role === "assistant" ? "ai" : "user",
          content: safeText(m.message),
        }));
        setMessages(normalized);
      } catch (err) {
        if (cancelled) return;
        setError("Failed to load conversation history.");
        setMessages([]);
      }
    };

    loadHistory();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTopic]);

  // Auto-scroll when messages change
  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, loading]);

  const sendQuestion = async () => {
    setError(null);
    if (!user && !authLoading) {
      setError("Please log in to use the AI Tutor.");
      return;
    }
    if (!selectedTopic) {
      setError("Please select a topic first.");
      return;
    }
    if (!question.trim()) return;

    const userMessage = {
      role: "user",
      content: question.trim(),
    };

    // Optimistically add user message
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await dashboardService.askChat(selectedTopic, userMessage.content);

      const aiText = res?.answer || res?.aiMessage?.message || "";
      const aiMessage = { role: "ai", content: safeText(aiText) };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("TopicChat send error:", err);
      setError(
        err?.response?.data?.message || "Error getting response from AI."
      );
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "⚠️ Error getting response from AI." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const canSend = !loading && question.trim().length > 0 && Boolean(selectedTopic);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Bot className="w-5 h-5 text-indigo-600" />
          AI Tutor
        </h3>
        <p className="text-sm text-gray-600">
          Ask doubts topic-wise and get clear AI explanations
        </p>
      </div>

      {/* Topic Selector */}
      {Array.isArray(topics) && topics.length > 0 ? (
        <div className="flex flex-wrap gap-2 mb-4">
          {topics.map((topic, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedTopic(topic)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                selectedTopic === topic
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              aria-pressed={selectedTopic === topic}
            >
              {safeText(topic)}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 mb-4">No topics available</p>
      )}

      {/* Chat Window */}
      <div
        ref={containerRef}
        className="h-64 overflow-y-auto border rounded-lg p-4 space-y-3 bg-gray-50"
        role="log"
        aria-live="polite"
      >
        {messages.length === 0 && !loading && (
          <p className="text-sm text-gray-500">
            {error ? (
              <span className="text-red-600">{error}</span>
            ) : (
              <>
                Ask a question about <strong>{safeText(selectedTopic || "a topic")}</strong> 👋
              </>
            )}
          </p>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] px-4 py-2 rounded-lg text-sm ${
                msg.role === "user" ? "bg-indigo-600 text-white" : "bg-white text-gray-900 border"
              }`}
            >
              {safeText(msg.content)}
            </div>
          </div>
        ))}

        {loading && (
          <p className="text-sm text-gray-500 animate-pulse">AI is typing…</p>
        )}
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={selectedTopic ? `Ask about ${safeText(selectedTopic)}` : "Select a topic to ask"}
          className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={loading || !selectedTopic || (!user && !authLoading)}
          aria-label="Type your question"
        />
        <button
          onClick={sendQuestion}
          disabled={!canSend}
          title={!canSend ? "Enter a question and select a topic" : "Send question"}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TopicChat;
