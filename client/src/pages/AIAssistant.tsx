import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, Bot, User, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type Message = {
  id: string;
  role: 'user' | 'ai';
  content: string;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'ai',
    content: "Hello Sarah. I'm your DermaVerse AI assistant. I've reviewed your latest skin analysis and environmental data. How can I help you today?"
  }
];

const SUGGESTED_PROMPTS = [
  "Is this fungal acne?",
  "What SPF should I use today?",
  "How to treat redness?",
  "Review my current routine"
];

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    const newUserMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      const newAiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'ai', 
        content: "Based on your recent scans and today's high UV index (7.2), I recommend using a broad-spectrum SPF 50. Your skin barrier shows signs of mild compromise, so opt for a mineral sunscreen with zinc oxide to minimize irritation."
      };
      setMessages(prev => [...prev, newAiMsg]);
    }, 2000);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">DermaVerse Intelligence</h2>
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="hidden sm:flex">
          <Sparkles className="w-4 h-4 mr-2 text-orange-500" /> New Chat
        </Button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg) => (
          <motion.div 
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex gap-4 max-w-[85%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
              msg.role === 'user' ? "bg-slate-200" : "bg-slate-900"
            )}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-slate-600" /> : <Bot className="w-4 h-4 text-white" />}
            </div>
            <div className={cn(
              "p-4 rounded-2xl text-sm leading-relaxed",
              msg.role === 'user' 
                ? "bg-slate-900 text-white rounded-tr-sm" 
                : "bg-slate-100 text-slate-800 rounded-tl-sm"
            )}>
              {msg.content}
            </div>
          </motion.div>
        ))}
        
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 max-w-[85%]"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shrink-0 mt-1">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-100 rounded-tl-sm flex items-center gap-1.5">
              <motion.div className="w-2 h-2 rounded-full bg-slate-400" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
              <motion.div className="w-2 h-2 rounded-full bg-slate-400" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
              <motion.div className="w-2 h-2 rounded-full bg-slate-400" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        {/* Suggested Prompts */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {SUGGESTED_PROMPTS.map((prompt, i) => (
            <button 
              key={i}
              onClick={() => handleSend(prompt)}
              className="whitespace-nowrap px-4 py-2 rounded-full border border-slate-200 bg-slate-50 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
        
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          className="flex items-center gap-2 relative"
        >
          <Button type="button" variant="ghost" size="icon" className="absolute left-1 text-slate-400 hover:text-slate-600">
            <ImageIcon className="w-5 h-5" />
          </Button>
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your skin, routines, or environmental factors..." 
            className="pl-12 pr-12 rounded-full bg-slate-50 border-slate-200 focus-visible:ring-slate-300 h-14"
          />
          <Button 
            type="submit" 
            size="icon" 
            className="absolute right-1 rounded-full w-12 h-12 bg-slate-900 hover:bg-slate-800 text-white"
            disabled={!input.trim() || isTyping}
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
