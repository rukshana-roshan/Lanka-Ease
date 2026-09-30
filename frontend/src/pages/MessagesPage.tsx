import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MOCK_PROVIDERS } from '../services/api';
import { Send, Paperclip, CheckCheck } from 'lucide-react';

interface ChatMessage {
  id: number;
  senderId: number;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedProvider, setSelectedProvider] = useState(MOCK_PROVIDERS[3]); // Sunil Rathnayake
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, senderId: 2, text: 'Ayubowan Sunil, are you on your way to Colombo 03?', timestamp: '10:15 AM', isRead: true },
    { id: 2, senderId: 6, text: 'Ayubowan Kamal! Yes, I have left Kollupitiya and ETA is around 20 minutes.', timestamp: '10:18 AM', isRead: true },
    { id: 3, senderId: 2, text: 'Great! The parking space in front of the house is clear.', timestamp: '10:20 AM', isRead: true },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now(),
      senderId: user?.id || 2,
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    };

    setMessages([...messages, newMsg]);
    setInputText('');

    // Simulate auto provider reply
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: Date.now() + 1,
        senderId: selectedProvider.userId,
        text: "Thank you for the update! I will arrive shortly.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: true,
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
      {/* Conversations List (Sidebar on Desktop) */}
      <div className="w-full md:w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-slate-100">
          Messages & Chats
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {MOCK_PROVIDERS.map((pro) => (
            <button
              key={pro.id}
              onClick={() => setSelectedProvider(pro)}
              className={`w-full p-4 text-left flex items-center gap-3 transition-colors ${
                selectedProvider.id === pro.id ? 'bg-brand-50 dark:bg-brand-950/60' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="relative">
                <img src={pro.profileImage} alt={pro.fullName} className="w-10 h-10 rounded-full object-cover" />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{pro.businessName}</h4>
                  <span className="text-[10px] text-slate-400">10:20 AM</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{pro.fullName}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Active Conversation Pane */}
      <div className="hidden md:flex flex-1 flex-col bg-slate-50/50 dark:bg-slate-950/50">
        {/* Chat Header */}
        <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={selectedProvider.profileImage} alt={selectedProvider.fullName} className="w-10 h-10 rounded-full object-cover" />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{selectedProvider.businessName}</h3>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">✓ Online • Responsive</span>
            </div>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => {
            const isMe = msg.senderId === (user?.id || 2);
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs sm:max-w-md px-4 py-2.5 rounded-2xl text-xs space-y-1 ${
                    isMe
                      ? 'bg-brand-600 text-white rounded-br-none shadow'
                      : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p>{msg.text}</p>
                  <div className={`flex items-center justify-end gap-1 text-[9px] ${isMe ? 'text-brand-200' : 'text-slate-400'}`}>
                    <span>{msg.timestamp}</span>
                    {isMe && <CheckCheck className="w-3 h-3" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <button type="button" className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full">
            <Paperclip className="w-4 h-4" />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-sm rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none"
          />
          <button
            type="submit"
            className="p-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
