import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User as UserIcon,
  RotateCcw,
  Minimize2,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMockResponse, getRoleInitialGreeting } from '../../api/chatbotApi';

/**
 * ChatbotWidget Component
 * Persistent floating assistant mounted at the App root.
 * Role-aware, desktop-first, in-memory conversation state.
 * Only rendered on authenticated dashboard routes (hidden on /login).
 */
export default function ChatbotWidget() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const currentRole = user?.role || 'ministry';

  // Hide widget completely on login page and when unauthenticated
  if (!isAuthenticated || !user || location.pathname === '/login') {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize or reset role-tailored greeting
  useEffect(() => {
    const greeting = getRoleInitialGreeting(currentRole);
    setMessages([
      {
        id: 'init-1',
        sender: 'bot',
        text: greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [currentRole]);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when chat panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const toggleChat = () => {
    if (!isOpen && hasUnread) {
      setHasUnread(false);
    }
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const replyText = await getMockResponse(text, currentRole);
      const botMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorMessage = {
        id: `err-${Date.now()}`,
        sender: 'bot',
        text: "I'm having trouble retrieving that information right now. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'bot',
        text: getRoleInitialGreeting(currentRole),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Quick suggestion chips based on active role
  const getSuggestionChips = () => {
    switch (currentRole) {
      case 'ministry':
        return ['High-risk works', 'Fund utilization', 'Predictive alerts'];
      case 'mp':
        return ['Constituency works', 'Annual entitlement', 'Delayed sanctions'];
      case 'district':
        return ['Verification queue', 'Photographic evidence', 'Escalations'];
      case 'auditor':
        return ['Audit queue', 'Vendor cross-reference', 'High anomaly cases'];
      case 'state':
        return ['District performance', 'State absorption', 'Risk breakdown'];
      default:
        return ['Flagged cases', 'Fund utilization', 'Vendor patterns'];
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center justify-end">
        <button
          type="button"
          onClick={toggleChat}
          aria-label={isOpen ? 'Close assistant' : 'Open MPLADS Assistant'}
          className="relative w-14 h-14 rounded-full bg-[#1D9BF0] text-white shadow-xl hover:bg-[#1A8CD8] active:scale-95 transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-sky-200"
        >
          {isOpen ? (
            <X className="w-6 h-6 transition-transform duration-150 rotate-0" />
          ) : (
            <MessageSquare className="w-6 h-6 transition-transform duration-150" />
          )}

          {/* Unread Attention Dot */}
          {!isOpen && hasUnread && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 border-2 border-white" />
            </span>
          )}
        </button>
      </div>

      {/* Floating Chat Panel */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-7rem)] bg-white rounded-3xl shadow-2xl border border-[#EFF3F4] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          {/* Header */}
          <div className="px-4 py-3.5 bg-[#0F1419] text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#1D9BF0] flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold tracking-tight">MPLADS Assistant</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" title="Online" />
                </div>
                <div className="text-[11px] text-slate-400 capitalize">
                  AI Companion • {currentRole} View
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                type="button"
                onClick={handleClearHistory}
                title="Reset conversation"
                className="p-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={toggleChat}
                title="Close chat"
                className="p-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F7F9F9]">
            {messages.map((m) => {
              const isUser = m.sender === 'user';

              return (
                <div
                  key={m.id}
                  className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-6 h-6 rounded-full bg-[#1D9BF0]/10 text-[#1D9BF0] flex items-center justify-center shrink-0 mb-1 border border-[#1D9BF0]/20">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-2xs ${
                      isUser
                        ? 'bg-[#1D9BF0] text-white rounded-br-xs'
                        : 'bg-white text-[#0F1419] border border-[#EFF3F4] rounded-bl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{m.text}</p>
                    <div
                      className={`text-[10px] mt-1 text-right ${
                        isUser ? 'text-sky-100' : 'text-slate-400'
                      }`}
                    >
                      {m.timestamp}
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 mb-1">
                      <UserIcon className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-end gap-2 justify-start">
                <div className="w-6 h-6 rounded-full bg-[#1D9BF0]/10 text-[#1D9BF0] flex items-center justify-center shrink-0 mb-1 border border-[#1D9BF0]/20">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white border border-[#EFF3F4] px-3.5 py-2.5 rounded-2xl rounded-bl-xs flex items-center gap-1.5 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1D9BF0] animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1D9BF0] animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1D9BF0] animate-bounce" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 pt-2 pb-1 bg-white border-t border-[#EFF3F4] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {getSuggestionChips().map((chip, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isTyping}
                onClick={() => handleSendMessage(chip)}
                className="text-[11px] font-medium text-slate-600 bg-[#F7F9F9] hover:bg-sky-50 hover:text-[#1D9BF0] border border-[#EFF3F4] px-2.5 py-1 rounded-full whitespace-nowrap transition-colors disabled:opacity-50"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-[#EFF3F4]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about works, funds, vendors..."
                disabled={isTyping}
                className="flex-1 bg-[#F7F9F9] border border-[#EFF3F4] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#0F1419] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] focus:bg-white transition-all disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                aria-label="Send message"
                className="w-10 h-10 rounded-xl bg-[#1D9BF0] text-white flex items-center justify-center hover:bg-[#1A8CD8] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
