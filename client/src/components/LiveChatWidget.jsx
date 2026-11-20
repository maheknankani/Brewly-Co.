import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { api } from '../utils/api';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';

export const LiveChatWidget = () => {
  const { isChatOpen, setIsChatOpen, role } = useStore();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [connectError, setConnectError] = useState(false);
  const messagesEndRef = useRef(null);

  // Welcome message shown locally (not saved to DB)
  const welcomeMsg = {
    id: 'welcome',
    sender: 'bot',
    text: "☕ Welcome to Brewly Barista AI! Ask me about grind sizes (AeroPress, V60, French Press), roast levels & caffeine, coffee storage & degassing, or tap a quick topic below!",
    time: 'Now'
  };

  const fetchChat = async () => {
    try {
      const res = await api.getChatMessages();
      if (res.success) {
        setConnectError(false);
        setMessages(res.messages || []);
      } else {
        setConnectError(true);
      }
    } catch (err) {
      console.error('Error fetching chat messages:', err);
      setConnectError(true);
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
        // Immediately show user message optimistically
        setMessages(prev => [...prev, res.message]);
        // Then fetch to get bot reply after delay
        setTimeout(fetchChat, 800);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setConnectError(true);
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

  const displayMessages = messages.length === 0 ? [welcomeMsg] : messages;

  // ── CLOSED STATE: floating button ──
  if (!isChatOpen) {
    return (
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-espresso-900 hover:bg-forest-700 text-cream-100 p-3 sm:px-5 sm:py-3 rounded-full shadow-2xl border border-amberGold-500/50 flex items-center gap-2 sm:gap-3 transition-all duration-300 hover:scale-105 group cursor-pointer"
        title="Open Barista AI Live Chat"
      >
        <div className="relative">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-forest-700 border border-amberGold-400 flex items-center justify-center text-sm shadow">
            ☕
          </div>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-espresso-900 animate-pulse"></span>
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-xs font-serif font-bold text-cream-100 flex items-center gap-1.5">
            <span>Barista AI Chat</span>
            <Sparkles size={12} className="text-amberGold-400" />
          </div>
          <div className="text-[10px] text-amberGold-400 font-mono">Ask about grinds &amp; roasts</div>
        </div>
      </button>
    );
  }

  // ── OPEN STATE: chat panel ──
  // On mobile: full-width bottom sheet. On sm+: fixed floating panel (w-96, bottom-6 right-6)
  return (
    <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 w-full sm:w-96 bg-cream-100 rounded-t-3xl sm:rounded-3xl border border-cream-300 shadow-2xl overflow-hidden flex flex-col h-[80vh] sm:h-[520px] animate-fadeIn">
      
      {/* Chat Header */}
      <div className="bg-espresso-900 text-cream-100 p-4 flex items-center justify-between shrink-0">
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
          <X size={20} />
        </button>
      </div>

      {/* Quick Suggestion Pills */}
      <div className="p-2.5 bg-cream-200/80 border-b border-cream-300 flex items-center gap-1.5 overflow-x-auto text-[11px] whitespace-nowrap scrollbar-none shrink-0">
        {quickTopics.map((topic, i) => (
          <button
            key={i}
            onClick={() => handleQuickTopic(topic.query)}
            className="px-2.5 py-1 rounded-full bg-cream-100 hover:bg-forest-700 hover:text-cream-100 text-espresso-900 border border-cream-300 transition-colors font-medium text-[10px] shrink-0 cursor-pointer shadow-sm"
          >
            {topic.label}
          </button>
        ))}
      </div>

      {/* Connection error banner */}
      {connectError && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2 text-[11px] text-red-700 font-medium shrink-0">
          ⚠️ Could not connect to Barista AI. Check that the backend server is running.
        </div>
      )}

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-cream-50/50">
        {displayMessages.map(msg => {
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
      <form onSubmit={handleSendMessage} className="p-3 border-t border-cream-300 bg-cream-100 flex gap-2 shrink-0">
        <input
          type="text"
          placeholder={role === 'admin' ? "Reply as Barista Admin..." : "Ask about coffee roasts, grind sizes..."}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-cream-50 border border-cream-300 rounded-xl px-3 py-2 text-xs text-espresso-900 focus:outline-none focus:border-forest-700 min-h-[40px]"
        />
        <button
          type="submit"
          className="bg-forest-700 hover:bg-forest-800 text-cream-100 p-2.5 rounded-xl shadow transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
        >
          <Send size={16} />
        </button>
      </form>

    </div>
  );
};
