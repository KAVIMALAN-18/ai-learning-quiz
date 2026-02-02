import { useState, useEffect, useRef } from "react";
import dashboardService from "../../services/dashboard.service";
import { Send, Bot, User, Sparkles, AlertCircle, Zap, Terminal, Hash, Command, PlusCircle } from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { Card, CardHeader, CardContent } from "../ui/Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { SectionHeader, BodyText, MetaText, Label } from "../ui/Typography";

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

  const SUGGESTIONS = [
    "Explain the fundamental architecture",
    "Compare with similar concepts",
    "Show me a practical code example",
    "Identify common anti-patterns",
  ];

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
          timestamp: m.createdAt || new Date().toISOString(),
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

  const sendQuestion = async (overrideContent = null) => {
    setError(null);
    const content = (overrideContent || question).trim();
    if (!user && !authLoading) {
      setError("Authorization required.");
      return;
    }
    if (!selectedTopic) {
      setError("Select a research topic.");
      return;
    }
    if (!content) return;

    const userMessage = {
      role: "user",
      content: content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await dashboardService.askChat(selectedTopic, userMessage.content);
      const aiText = res?.answer || res?.aiMessage?.message || "";
      const aiMessage = { role: "ai", content: safeText(aiText), timestamp: new Date().toISOString() };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setError("AI Synthesis failed. Check connectivity.");
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Analysis suspended due to system error.", isError: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const canSend = !loading && (question.trim().length > 0 || Boolean(selectedTopic));

  return (
    <Card variant="premium" className="animate-fade-in border-none bg-white shadow-2xl flex flex-col h-full min-h-[600px] overflow-hidden rounded-[3rem]">
      {/* 1. INTERFACE HEADER */}
      <div className="p-10 border-b border-neutral-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-8 shrink-0">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 bg-neutral-900 rounded-3xl flex items-center justify-center text-white shadow-premium relative z-10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-transparent" />
              <Bot size={32} className="relative z-10" />
            </div>
            <div className="absolute -inset-2 bg-primary-500/10 rounded-3xl animate-pulse -z-0" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-neutral-900 tracking-tight leading-none mb-2">Technical Mentor</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Neural Sync Active</span>
            </div>
          </div>
        </div>

        <div className="flex bg-neutral-50 p-2 rounded-2xl gap-2 border border-neutral-100 max-w-full overflow-x-auto no-scrollbar">
          {topics.map((topic, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedTopic(topic)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${selectedTopic === topic
                ? "bg-white text-primary-600 shadow-soft border-white scale-105"
                : "text-neutral-400 border-transparent hover:text-neutral-600"
                }`}
            >
              {safeText(topic)}
            </button>
          ))}
        </div>
      </div>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden relative">
        {/* 2. CONVERSATION CANVAS */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto p-10 space-y-12 bg-neutral-50/20 no-scrollbar"
        >
          {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-center p-12 max-w-md mx-auto animate-fade-in">
              <div className="w-24 h-24 bg-white border border-neutral-100 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-premium relative group">
                <Terminal size={40} className="text-primary-600 group-hover:scale-110 transition-transform" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white border-4 border-white">
                  <PlusCircle size={16} />
                </div>
              </div>
              <h4 className="text-2xl font-black text-neutral-900 mb-3 tracking-tighter">Initiate Research Cycle</h4>
              <p className="text-neutral-400 font-medium leading-relaxed mb-10">
                The AI Tutor is ready to deconstruct complex patterns for <span className="text-primary-600 font-black tracking-tight">{safeText(selectedTopic)}</span>.
              </p>

              <div className="grid grid-cols-1 gap-3 w-full">
                {SUGGESTIONS.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendQuestion(s)}
                    className="p-4 bg-white border border-neutral-100 rounded-2xl text-xs font-black text-neutral-500 uppercase tracking-widest hover:border-primary-100 hover:text-primary-600 hover:shadow-soft transition-all text-left flex items-center gap-4"
                  >
                    <div className="w-6 h-6 rounded bg-neutral-50 flex items-center justify-center text-[10px]">{idx + 1}</div>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-6 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"} animate-slide-up group`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-soft border-2 transition-all ${msg.role === "user" ? "bg-neutral-900 border-neutral-800 text-white" : "bg-white border-neutral-100 text-primary-600"
                }`}>
                {msg.role === "user" ? <User size={20} /> : <Sparkles size={20} />}
              </div>
              <div className="flex flex-col gap-2 max-w-[85%] sm:max-w-[75%]">
                <div
                  className={`px-8 py-6 rounded-[2.5rem] text-base leading-relaxed font-medium transition-all ${msg.role === "user"
                    ? "bg-primary-600 text-white shadow-premium rounded-tr-none"
                    : "bg-white text-neutral-800 border-2 border-white shadow-soft rounded-tl-none"
                    }`}
                >
                  {safeText(msg.content)}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest text-neutral-400 ${msg.role === "user" ? 'text-right' : 'text-left'}`}>
                  {msg.role === "ai" ? 'Synthesized' : 'Transmitted'} • {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-6 animate-pulse">
              <div className="w-12 h-12 rounded-2xl bg-white border-2 border-neutral-100 flex items-center justify-center text-primary-600">
                <Bot size={20} className="animate-bounce" />
              </div>
              <div className="bg-white/50 backdrop-blur-md border-2 border-white px-8 py-6 rounded-[2.5rem] rounded-tl-none flex items-center gap-4 shadow-soft">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2.5 h-2.5 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2.5 h-2.5 bg-primary-500 rounded-full animate-bounce"></span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600">Synthesizing Logic...</span>
              </div>
            </div>
          )}
        </div>

        {/* 3. COMMAND BAR */}
        <div className="p-10 pt-4 bg-white border-t border-neutral-100 shrink-0">
          {messages.length > 0 && !loading && (
            <div className="flex gap-3 mb-6 overflow-x-auto no-scrollbar pb-2">
              {SUGGESTIONS.slice(0, 2).map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => sendQuestion(s)}
                  className="px-5 py-2.5 bg-neutral-50 border border-neutral-100 rounded-full text-[9px] font-black text-neutral-400 uppercase tracking-widest hover:border-primary-200 hover:text-primary-600 hover:bg-white transition-all whitespace-nowrap"
                >
                  <Hash size={10} className="inline mr-1" /> {s}
                </button>
              ))}
            </div>
          )}

          <div className="relative flex items-center gap-4">
            <div className="relative flex-1 group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-600 transition-colors">
                <Command size={20} />
              </div>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendQuestion()}
                placeholder={selectedTopic ? `Inquire about cognitive patterns in ${safeText(selectedTopic)}...` : "Select topic..."}
                className="w-full bg-neutral-50 border-2 border-neutral-100 rounded-3xl pl-16 pr-14 py-6 text-base font-bold text-neutral-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all shadow-inner placeholder:text-neutral-300 placeholder:font-medium"
                disabled={loading || !selectedTopic || (!user && !authLoading)}
              />
            </div>

            <Button
              onClick={() => sendQuestion()}
              disabled={!canSend}
              variant="premium"
              className={`rounded-3xl h-16 px-10 font-black text-sm tracking-widest shadow-premium transition-all ${canSend ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}`}
            >
              TRANSMIT <Send size={18} className="ml-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopicChat;
