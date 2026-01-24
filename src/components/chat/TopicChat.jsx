import { useState, useEffect, useRef } from "react";
import dashboardService from "../../services/dashboard.service";
import { Send, Bot, User, Sparkles, AlertCircle, Zap } from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { Card, CardHeader, CardContent } from "../ui/Card";
import Button from "../ui/Button";
import { SectionHeader, BodyText, MetaText } from "../ui/Typography";

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
    return String(value);
  };

  useEffect(() => {
    if (!Array.isArray(topics)) return;
    if (topics.length === 0) {
      setSelectedTopic("");
      setMessages([]);
      return;
    }
    if (!selectedTopic || !topics.includes(selectedTopic)) {
      setSelectedTopic(topics[0]);
    }
  }, [topics]);

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
  }, [selectedTopic]);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
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
    <Card className="animate-fade-in border-neutral-100 shadow-xl flex flex-col h-full min-h-[500px] overflow-hidden">
      <div className="p-6 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-600/30">
            <Bot size={24} />
          </div>
          <div>
            <SectionHeader className="mt-0 mb-0.5 text-lg font-black leading-none">Interactive AI Tutor</SectionHeader>
            <MetaText className="text-[10px] uppercase font-black tracking-widest text-neutral-400">Powered by Neural Insights</MetaText>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-success/10 text-success text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md border border-success/10">
          <Sparkles size={12} className="fill-success" /> Active Session
        </div>
      </div>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        {/* Topic Selector */}
        <div className="px-6 py-4 bg-white border-b border-neutral-100 flex gap-3 overflow-x-auto no-scrollbar shrink-0">
          {topics.map((topic, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedTopic(topic)}
              className={`whitespace-nowrap px-6 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${selectedTopic === topic
                ? "bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-600/20"
                : "text-neutral-500 border-neutral-200 hover:border-neutral-900 hover:text-neutral-900"
                }`}
            >
              {safeText(topic)}
            </button>
          ))}
        </div>

        {/* Chat window */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto p-8 space-y-8 bg-neutral-50/30"
        >
          {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-center p-12 max-w-sm mx-auto">
              <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Sparkles size={40} className="text-primary-300 fill-primary-300/30" />
              </div>
              <h4 className="text-lg font-black text-neutral-900 mb-2">Begin Conversation</h4>
              <BodyText className="text-sm text-neutral-500">
                Ask your AI Tutor anything about <span className="text-primary-600 font-black">{safeText(selectedTopic || "selected topics")}</span> to deepen your understanding.
              </BodyText>
              {error && (
                <div className="mt-6 flex items-center gap-2 text-error text-xs font-bold bg-error/5 px-4 py-2 rounded-md border border-error/10">
                  <AlertCircle size={14} /> {error}
                </div>
              )}
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"} animate-slide-up`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-sm border ${msg.role === "user" ? "bg-primary-600 border-primary-600 text-white" : "bg-white border-neutral-100 text-neutral-400"
                }`}>
                {msg.role === "user" ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div
                className={`max-w-[85%] sm:max-w-[70%] px-6 py-4 rounded-xl text-sm leading-relaxed ${msg.role === "user"
                  ? "bg-primary-600 text-white font-medium shadow-xl shadow-primary-600/10 rounded-tr-none"
                  : "bg-white text-neutral-800 border border-neutral-100 shadow-sm rounded-tl-none"
                  }`}
              >
                {safeText(msg.content)}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-4 text-neutral-400">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></span>
              </div>
              <MetaText className="uppercase font-black tracking-widest text-[10px] italic">AI is synthesizing knowledge…</MetaText>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-6 bg-white border-t border-neutral-100 shrink-0">
          <div className="relative flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendQuestion()}
                placeholder={selectedTopic ? `Inquire about ${safeText(selectedTopic)}...` : "Select a topic above"}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-md pl-6 pr-14 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all shadow-inner"
                disabled={loading || !selectedTopic || (!user && !authLoading)}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none text-[10px] font-black uppercase text-neutral-300 hidden sm:flex">
                <span>Enter to send</span>
              </div>
            </div>

            <Button
              onClick={sendQuestion}
              disabled={!canSend}
              className={`rounded-md h-14 w-14 p-0 shrink-0 shadow-xl transition-all ${canSend ? 'bg-primary-600 shadow-primary-600/30' : 'bg-neutral-200 shadow-none'}`}
            >
              <Send size={20} className={canSend ? "animate-pulse" : ""} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopicChat;
