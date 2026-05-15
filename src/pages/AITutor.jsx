import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, Send, ArrowLeft, Sparkles, MessageSquare } from 'lucide-react';
import { aiSubjects, generateAIResponse } from '../data/aiTutorData';

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <div className="typing-dot w-2 h-2 bg-indigo-400 rounded-full" />
      <div className="typing-dot w-2 h-2 bg-indigo-400 rounded-full" />
      <div className="typing-dot w-2 h-2 bg-indigo-400 rounded-full" />
    </div>
  );
}

function ChatMessage({ message, isUser }) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`max-w-[85%] lg:max-w-[70%] ${isUser ? 'order-2' : 'order-1'}`}>
        {!isUser && (
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">AI Tutor</span>
          </div>
        )}
        <div className={`px-4 py-3 rounded-2xl ${
          isUser 
            ? 'bg-indigo-500 text-white rounded-br-md' 
            : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-gray-200 rounded-bl-md'
        }`}>
          {isUser ? (
            <p className="text-sm">{message.content}</p>
          ) : (
            <div className="chat-message text-sm prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>
        <p className={`text-xs text-gray-400 mt-1 ${isUser ? 'text-right' : ''}`}>
          {message.time}
        </p>
      </div>
    </div>
  );
}

export default function AITutor() {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSelectSubject = (subject) => {
    setSelectedSubject(subject);
    setMessages([{
      id: 1,
      content: `Hello! I'm your **${subject.name}** AI Tutor 🎓\n\nI can help you with topics like ${subject.description}.\n\nFeel free to ask me anything about ${subject.name}, or pick one of the suggested questions below!`,
      isUser: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
  };

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      content: text,
      isUser: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const response = generateAIResponse(selectedSubject.id, text);

    // Simulate streaming by adding the response
    setIsTyping(false);
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      content: response,
      isUser: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Subject Selection Screen
  if (!selectedSubject) {
    return (
      <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Bot className="w-7 h-7 text-indigo-500" />
            AI Tutor
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Choose a subject to start learning with your AI assistant</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {aiSubjects.map((subject, index) => (
            <button
              key={subject.id}
              onClick={() => handleSelectSubject(subject)}
              className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg transition-all duration-300 text-left group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{subject.icon}</span>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {subject.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{subject.code}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{subject.description}</p>
              <div className="flex items-center gap-2 text-indigo-500 text-sm font-medium">
                <MessageSquare className="w-4 h-4" />
                <span>Start Chat</span>
              </div>
            </button>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-800/30">
            <Sparkles className="w-6 h-6 text-indigo-500 mb-2" />
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Smart Responses</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Get detailed explanations with code examples and diagrams</p>
          </div>
          <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/30">
            <Bot className="w-6 h-6 text-purple-500 mb-2" />
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Subject Expert</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Each tutor specializes in its subject for accurate answers</p>
          </div>
          <div className="p-4 rounded-xl bg-pink-50 dark:bg-pink-950/30 border border-pink-100 dark:border-pink-800/30">
            <MessageSquare className="w-6 h-6 text-pink-500 mb-2" />
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Interactive Chat</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Natural conversation with markdown and code support</p>
          </div>
        </div>
      </div>
    );
  }

  // Chat Interface
  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="px-4 lg:px-6 py-4 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setSelectedSubject(null); setMessages([]); }}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{selectedSubject.icon}</span>
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white">{selectedSubject.name}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">AI Tutor • {selectedSubject.code}</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} isUser={msg.isUser} />
        ))}
        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl rounded-bl-md">
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length <= 1 && (
        <div className="px-4 lg:px-6 pb-2">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {selectedSubject.suggestedQuestions.slice(0, 3).map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="px-3 py-1.5 text-xs bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-200 dark:border-indigo-800/30 hover:bg-indigo-100 dark:hover:bg-indigo-950/50 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 lg:px-6 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 focus-within:border-indigo-300 dark:focus-within:border-indigo-700 transition-colors">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask about ${selectedSubject.name}...`}
              className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 outline-none"
            />
          </div>
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="p-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 dark:disabled:bg-slate-700 text-white rounded-xl transition-colors disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
