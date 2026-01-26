import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api.client';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import Button from '../ui/Button';

const MentorChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            loadHistory();
        }
    }, [isOpen]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadHistory = async () => {
        try {
            const res = await api.get('/mentor/history');
            if (res.data.messages && res.data.messages.length > 0) {
                setMessages(res.data.messages);
            } else {
                setMessages([{ role: 'model', content: "Hi! I'm your AI Mentor. How can I help you learn today?" }]);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await api.post('/mentor/chat', { message: userMsg.content });
            setMessages(prev => [...prev, { role: 'model', content: res.data.reply }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'model', content: "I'm having trouble connecting right now." }]);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 z-50"
            >
                <Bot size={28} />
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col border border-slate-200 z-50 animate-fade-in-up">
            {/* Header */}
            <div className="p-4 bg-primary-600 text-white rounded-t-2xl flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Bot size={20} />
                    <span className="font-bold">AI Mentor</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="hover:bg-primary-500 p-1 rounded">
                    <X size={20} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div
                            className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                    ? 'bg-primary-600 text-white rounded-br-none'
                                    : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
                                }`}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white p-3 rounded-2xl border border-slate-200 text-slate-400 text-sm italic">
                            Thinking...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 border-t border-slate-200 flex gap-2 bg-white rounded-b-2xl">
                <input
                    className="flex-1 p-2 bg-slate-100 rounded-lg outline-none text-sm focus:ring-2 focus:ring-primary-100"
                    placeholder="Ask me anything..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <Button size="sm" type="submit" disabled={loading} className="px-3">
                    <Send size={18} />
                </Button>
            </form>
        </div>
    );
};

export default MentorChatWidget;
