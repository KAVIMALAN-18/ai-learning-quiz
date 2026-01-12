import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/useAuth';
import { Send, Loader, Trash2 } from 'lucide-react';

const TopicChat = ({ topics = [] }) => {
  const { token, user } = useAuth();
  const [topic, setTopic] = useState(topics[0] || '');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (topics && topics.length && !topic) setTopic(topics[0]);
  }, [topics]);

  useEffect(() => {
    if (topic) loadMessages(topic);
  }, [topic]);

  useEffect(() => {
    // scroll to bottom when messages change
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const loadMessages = async (t) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`/api/chat/messages?topic=${encodeURIComponent(t)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data.messages || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const sendQuestion = async () => {
    if (!input.trim()) return;
    setError('');
    setTyping(true);
    try {
      // temporarily add user message for optimistic UX
      const userMsg = { role: 'user', message: input.trim(), createdAt: new Date().toISOString() };
      setMessages((m) => [...m, userMsg]);
      setInput('');

      const res = await axios.post('/api/chat/ask', { topic, question: userMsg.message }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const aiText = res.data.answer;
      const aiMsg = { role: 'assistant', message: aiText, createdAt: new Date().toISOString() };
      setMessages((m) => [...m.filter(x => x !== userMsg), userMsg, aiMsg]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get answer');
    } finally {
      setTyping(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendQuestion();
    }
  };

  const clearChat = async () => {
    if (!topic) return;
    try {
      await axios.delete(`/api/chat/clear?topic=${encodeURIComponent(topic)}`, { headers: { Authorization: `Bearer ${token}` } });
      setMessages([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to clear chat');
    }
  };

  return (
    <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold">AI Tutor</h3>
            <span className="text-sm text-gray-500">{topic ? topic : 'Select a topic'}</span>
            <span className="ml-2 px-2 py-1 bg-gray-100 text-xs rounded">{user?.currentLevel?.charAt(0).toUpperCase() + user?.currentLevel?.slice(1)}</span>
          </div>
          <p className="text-xs text-gray-400">AI-generated responses — use as a learning aid.</p>
        </div>

        <div className="flex items-center gap-2">
          <select value={topic} onChange={(e) => setTopic(e.target.value)} className="hidden">
            {topics.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <button onClick={clearChat} className="text-sm text-red-600 px-3 py-2 rounded hover:bg-red-50 flex items-center gap-2">
            <Trash2 className="w-4 h-4"/> Clear
          </button>
        </div>
      </div>

      <div className="flex gap-3 mb-4 overflow-x-auto">
        {topics.map((t) => (
          <button key={t} onClick={() => setTopic(t)} className={`px-3 py-2 rounded-full text-sm font-medium transition ${topic===t ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:scale-105'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="h-64 overflow-y-auto p-3 bg-gray-50 rounded-lg mb-3">
        {loading && <p className="text-gray-500">Loading messages...</p>}
        {messages.map((m, i) => (
          <div key={i} className={`mb-3 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-900 rounded-bl-none shadow-sm'}`}>
              {m.role === 'assistant' && <div className="text-xs text-gray-400 mb-1">AI Tutor</div>}
              <div className="whitespace-pre-wrap">{m.message}</div>
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300 rounded-full animate-pulse" />
            <div className="w-3 h-3 bg-gray-300 rounded-full animate-pulse delay-75" />
            <div className="w-3 h-3 bg-gray-300 rounded-full animate-pulse delay-150" />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="flex items-center gap-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={`Ask a question about ${topic || 'a topic'}`} 
          className="flex-1 px-4 py-2 border rounded-lg resize-none h-12 focus:outline-none"
        />
        <button onClick={sendQuestion} disabled={typing || !input.trim()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 flex items-center gap-2">
          {typing ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Send
        </button>
      </div>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
};

export default TopicChat;
