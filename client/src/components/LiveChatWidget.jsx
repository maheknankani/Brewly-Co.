import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { api } from '../utils/api';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';

export const LiveChatWidget = () => {
  const { isChatOpen, setIsChatOpen, role } = useStore();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const fetchChat = async () => {
    try {
      const res = await api.getChatMessages();
      if (res.success) {
        setMessages(res.messages);
      }
    } catch (err) {
      console.error('Error fetching chat messages:', err);
    }
  };

  useEffect(() => {
    if (isChatOpen) {
      fetchChat();
      const interval = setInterval(fetchChat, 3000);
      return () => clearInterval(interval);
    }
  }, [isChatOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const textToSend = inputText.trim();
    setInputText('');

    const senderRole = role === 'admin' ? 'bot' : 'user';

    try {
      const res = await api.sendChatMessage(senderRole, textToSend);
      if (res.success) {
        fetchChat();
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const quickTopics = [
    { label: '☕ AeroPress / V60 Grind', query: 'What grind size should I use for AeroPress and V60?' },
    { label: '🌟 Light vs Dark Roast', query: 'What is the difference between light and dark roast caffeine and flavor?' },
    { label: '📦 Storage & Degassing', query: 'How should I store coffee beans and what is degassing?' },
    { label: '🚚 Track Order', query: 'How do I track my order status?' }
  ];

  const handleQuickTopic = (query) => {
    setInputText(query);
  };

  if (!isChatOpen) {
    return (
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-espresso-900 hover:bg-forest-700 text-cream-100 p-3.5 sm:px-5 sm:py-3 rounded-full shadow-2xl border border-amberGold-500/50 flex items-center gap-3 transition-all duration-300 hover:scale-105 group cursor-pointer"
        title="Open Barista AI Live Chat"
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-forest-700 border border-amberGold-400 flex items-center justify-center text-sm shadow">
            ☕
          </div>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-espresso-900 animate-pulse"></span>
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-xs font-serif font-bold text-cream-100 flex items-center gap-1.5">
            <span>Barista AI Chat</span>
            <Sparkles size={12} className="text-amberGold-400" />
          </div>
          <div className="text-[10px] text-amberGold-400 font-mono">Ask about grinds & roasts</div>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-cream-100 rounded-3xl border border-cream-300 shadow-2xl overflow-hidden flex flex-col h-[520px] animate-fadeIn">
      
      {/* Chat Header */}
      <div className="bg-espresso-900 text-cream-100 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-forest-700 border border-amberGold-500/50 flex items-center justify-center font-bold">
            ☕
          </div>
          <div>
            <h3 className="font-serif font-bold text-base flex items-center gap-1.5">
              <span>Brewly Barista AI</span>
              <Sparkles size={14} className="text-amberGold-400" />
            </h3>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Online • Expert Coffee Advisor</span>
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsChatOpen(false)}
          className="p-1.5 text-cream-200 hover:text-white rounded-full hover:bg-espresso-800 transition-colors cursor-pointer"
          title="Close Barista Chat"
        >
          <X size={18} />
        </button>
      </div>

      {/* Quick Suggestion Pills */}
      <div className="p-2.5 bg-cream-200/80 border-b border-cream-300 flex items-center gap-1.5 overflow-x-auto text-[11px] whitespace-nowrap scrollbar-none">
        {quickTopics.map((topic, i) => (
          <button
            key={i}
            onClick={() => handleQuickTopic(topic.query)}
            className="px-2.5 py-1 rounded-full bg-cream-100 hover:bg-forest-700 hover:text-cream-100 text-espresso-900 border border-cream-300 transition-colors font-medium text-[10px] shrink-0 cursor-pointer shadow-2xs"
          >
            {topic.label}
          </button>
        ))}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-cream-50/50">
        {messages.map(msg => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                isUser ? 'bg-forest-700 text-cream-100' : 'bg-espresso-900 text-amberGold-400'
              }`}>
                {isUser ? <User size={14} /> : <Bot size={14} />}
              </div>

              <div className={`max-w-[78%] p-3 rounded-2xl text-xs space-y-1 ${
                isUser
                  ? 'bg-forest-700 text-cream-100 rounded-tr-none'
                  : 'bg-cream-200 text-espresso-900 border border-cream-300 rounded-tl-none'
              }`}>
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                <span className={`block text-[9px] font-mono text-right ${isUser ? 'text-cream-200/70' : 'text-espresso-900/50'}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-cream-300 bg-cream-100 flex gap-2">
        <input
          type="text"
          placeholder={role === 'admin' ? "Reply as Barista Admin..." : "Ask about coffee roasts, shipping, grind sizes..."}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-cream-50 border border-cream-300 rounded-xl px-3 py-2 text-xs text-espresso-900 focus:outline-none focus:border-forest-700"
        />
        <button
          type="submit"
          className="bg-forest-700 hover:bg-forest-800 text-cream-100 p-2.5 rounded-xl shadow transition-colors"
        >
          <Send size={16} />
        </button>
      </form>

    </div>
  );
};
