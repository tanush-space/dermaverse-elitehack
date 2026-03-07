import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, Bot, User, Image as ImageIcon, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { chatAPI } from '@/lib/api';

type Message = {
  id: string;
  role: 'user' | 'ai';
  content: string;
  image?: string;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'ai',
    content: "Hello! I'm your DermaVerse AI assistant. I can help you with skincare questions, analyze images, and provide personalized recommendations based on your skin profile. How can I help you today?"
  }
];

const SUGGESTED_PROMPTS = [
  "What's my skin type?",
  "Recommend a morning routine",
  "How to treat acne?",
  "Best ingredients for aging?"
];

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleImageSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    setSelectedImage(file);
    setError(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim() && !selectedImage) return;
    
    const messageText = text.trim() || (selectedImage ? "Please analyze this image" : "");
    const userImagePreview = imagePreview;
    
    const newUserMsg: Message = { 
      id: Date.now().toString(), 
      role: 'user', 
      content: messageText,
      image: userImagePreview || undefined
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsTyping(true);
    setError(null);

    // Clear image after sending
    const imageToSend = selectedImage;
    clearImage();

    try {
      // Send message to API
      const response = await chatAPI.sendMessage(messageText, imageToSend || undefined);
      
      if (response.status === 'success') {
        const newAiMsg: Message = { 
          id: (Date.now() + 1).toString(), 
          role: 'ai', 
          content: response.response
        };
        setMessages(prev => [...prev, newAiMsg]);
      } else {
        throw new Error(response.message || 'Failed to get AI response');
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
      
      // Add error message to chat
      const errorMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'ai', 
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment."
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
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
              {msg.image && (
                <div className="mb-3">
                  <img 
                    src={msg.image} 
                    alt="Uploaded" 
                    className="max-w-full h-auto rounded-lg border border-slate-200 max-h-48 object-cover"
                  />
                </div>
              )}
              <div className="whitespace-pre-wrap">{msg.content}</div>
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
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
        
        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-4 relative inline-block">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="h-20 w-20 object-cover rounded-lg border border-slate-200"
            />
            <button
              onClick={clearImage}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        
        {/* Suggested Prompts */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {SUGGESTED_PROMPTS.map((prompt, i) => (
            <button 
              key={i}
              onClick={() => handleSend(prompt)}
              disabled={isTyping}
              className="whitespace-nowrap px-4 py-2 rounded-full border border-slate-200 bg-slate-50 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {prompt}
            </button>
          ))}
        </div>
        
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          className="flex items-center gap-2 relative"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && handleImageSelect(e.target.files[0])}
            className="hidden"
          />
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="absolute left-1 text-slate-400 hover:text-slate-600"
            onClick={() => fileInputRef.current?.click()}
            disabled={isTyping}
          >
            <ImageIcon className="w-5 h-5" />
          </Button>
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your skin, routines, or upload an image..." 
            className="pl-12 pr-12 rounded-full bg-slate-50 border-slate-200 focus-visible:ring-slate-300 h-14"
            disabled={isTyping}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="absolute right-1 rounded-full w-12 h-12 bg-slate-900 hover:bg-slate-800 text-white"
            disabled={(!input.trim() && !selectedImage) || isTyping}
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
