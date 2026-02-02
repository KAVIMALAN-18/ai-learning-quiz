import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User, Loader2, Sparkles, Trash2, Maximize2, Minimize2, Terminal, BookOpen, Lightbulb, ChevronRight, MessageSquare } from 'lucide-react';
import aiService from '../../services/ai.service';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export default function AITutorChat() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'ai',
            text: "Welcome back! I'm your AI technical mentor. I've analyzed your recent progress in the **Advanced React** module. \n\nHow can I accelerate your learning today? I can explain core concepts, debug code snippets, or generate targeted practice problems."
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const scrollRef = useRef(null);

    const suggestions = [
        { label: "Deep dive: Hooks", icon: <Terminal size={14} />, prompt: "Can you explain React Hooks in depth with advanced use cases?" },
        { label: "Practice problem", icon: <BookOpen size={14} />, prompt: "Generate a challenging practice problem for me." },
        { label: "Explain: Glassmorphism", icon: <Sparkles size={14} />, prompt: "What are the CSS principles behind premium glassmorphism?" }
    ];

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const handleSend = async (customPrompt) => {
        const textToSend = customPrompt || input;
        if (!textToSend.trim() || loading) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            text: textToSend
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await aiService.chat(textToSend);
            const aiMessage = {
                id: Date.now() + 1,
                type: 'ai',
                text: response.response
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage = {
                id: Date.now() + 1,
                type: 'ai',
                text: "I encountered a minor logic gap while connecting. Shall we try again?"
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const clearChat = () => {
        if (window.confirm("Archiving this session will clear history. Proceed?")) {
            setMessages([{
                id: Date.now(),
                type: 'ai',
                text: "Session cleared. I'm ready for a fresh technical audit. What's on your mind?"
            }]);
        }
    };

    return (
        <Card noPadding className={`flex flex-col transition-all duration-500 overflow-hidden bg-white/40 backdrop-blur-xl border-white/20 shadow-2xl relative ${isExpanded ? 'h-[800px]' : 'h-[600px]'}`}>
            {/* 1. PREMIUM HEADER */}
            <div className="p-6 border-b border-surface-200 bg-white/60 backdrop-blur-md flex items-center justify-between z-10">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-premium-gradient flex items-center justify-center text-white shadow-lg">
                            <Bot className="w-6 h-6" />
                        </div>
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-base font-black text-surface-900 tracking-tight uppercase leading-none mb-1">Technical Mentor</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest leading-none">Intelligence Online</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="p-2 rounded-xl text-surface-400 hover:text-primary-600">
                        {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={clearChat} className="p-2 rounded-xl text-surface-400 hover:text-red-500">
                        <Trash2 size={18} />
                    </Button>
                </div>
            </div>

            {/* 2. CHAT WORKSPACE */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth" ref={scrollRef}>
                <AnimatePresence initial={false}>
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex gap-4 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${message.type === 'ai'
                                ? 'bg-slate-900 text-white'
                                : 'bg-primary-50 text-primary-600'
                                }`}>
                                {message.type === 'ai' ? <Sparkles size={18} /> : <User size={18} />}
                            </div>
                            <div className={`flex flex-col max-w-[85%] ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`p-5 rounded-2xl text-sm leading-relaxed shadow-sm border ${message.type === 'ai'
                                    ? 'bg-white border-surface-200 text-surface-800'
                                    : 'bg-primary-600 border-primary-500 text-white shadow-primary-500/20'
                                    }`}>
                                    {message.type === 'ai' ? (
                                        <div className="prose prose-sm max-w-none">
                                            <ReactMarkdown
                                                components={{
                                                    code: ({ node, inline, className, children, ...props }) => (
                                                        <code className={`${inline ? 'bg-surface-100 px-1 rounded' : 'block bg-surface-900 text-white p-4 rounded-xl my-4 overflow-x-auto'} font-mono text-xs`} {...props}>{children}</code>
                                                    ),
                                                    p: ({ children }) => <p className="mb-0">{children}</p>
                                                }}
                                            >
                                                {message.text}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        <p className="font-medium">{message.text}</p>
                                    )}
                                </div>
                                <span className="text-[10px] font-black uppercase text-surface-400 tracking-widest mt-2 px-1">
                                    {message.type === 'ai' ? 'Audit complete' : 'Request delivered'}
                                </span>
                            </div>
                        </motion.div>
                    ))}

                    {loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-4"
                        >
                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center animate-pulse">
                                <Bot size={18} />
                            </div>
                            <div className="p-5 rounded-2xl bg-white border border-surface-200 shadow-sm flex items-center gap-3">
                                <div className="flex gap-1.5">
                                    {[0, 1, 2].map((i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                            className="w-2 h-2 bg-primary-600 rounded-full"
                                        />
                                    ))}
                                </div>
                                <span className="text-xs font-black uppercase tracking-widest text-primary-600">Thinking...</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 3. INTERACTIVE CONTEXT LAYER */}
            <div className="px-6 py-4 border-t border-surface-100 bg-white/40 flex gap-3 overflow-x-auto no-scrollbar">
                {suggestions.map((s, i) => (
                    <button
                        key={i}
                        onClick={() => handleSend(s.prompt)}
                        className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-surface-200 text-surface-600 text-xs font-bold hover:border-primary-600 hover:text-primary-600 hover:shadow-md transition-all whitespace-nowrap active:scale-95"
                    >
                        {s.icon} {s.label}
                    </button>
                ))}
            </div>

            {/* 4. INPUT INTERFACE */}
            <div className="p-6 bg-white border-t border-surface-200 relative z-20">
                <div className="flex gap-3">
                    <div className="flex-1 relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-600 transition-colors">
                            <MessageSquare size={18} />
                        </div>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Message mentor..."
                            disabled={loading}
                            className="w-full pl-12 pr-6 py-4 bg-surface-50 border border-surface-200 rounded-2xl focus:ring-4 focus:ring-primary-500/5 focus:border-primary-600 outline-none text-surface-900 placeholder-surface-400 font-medium transition-all"
                        />
                    </div>
                    <Button
                        variant="premium"
                        onClick={() => handleSend()}
                        disabled={!input.trim() || loading}
                        className="w-14 h-14 p-0 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg active:scale-95"
                    >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                    </Button>
                </div>
            </div>
        </Card>
    );
}
