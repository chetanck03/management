import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { HiOutlineArrowLeft, HiOutlineChatAlt2 } from 'react-icons/hi';
import { RiRobot2Line, RiSendPlaneFill } from 'react-icons/ri';
import { BsLightningCharge, BsCpu, BsHddNetwork, BsGlobe, BsGear, BsBraces } from 'react-icons/bs';
import { FiDatabase } from 'react-icons/fi';
import { aiSubjects, generateAIResponse } from '../data/aiTutorData';

const subjectIcons = {
  ds: BsBraces,
  algo: BsLightningCharge,
  dbms: FiDatabase,
  se: BsGear,
  cn: BsGlobe,
  toc: BsCpu,
};

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      <div className="typing-dot w-1.5 h-1.5 bg-indigo-400 rounded-full" />
      <div className="typing-dot w-1.5 h-1.5 bg-indigo-400 rounded-full" />
      <div className="typing-dot w-1.5 h-1.5 bg-indigo-400 rounded-full" />
    </div>
  );
}

function ChatMessage({ message, isUser }) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`max-w-[85%] lg:max-w-[70%]`}>
        {!isUser && (
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
              <RiRobot2Line className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <span className="text-[11px] text-slate-400 font-medium">AI Tutor</span>
          </div>
        )}
        <div className={`px-4 py-3 rounded-2xl ${
          isUser 
            ? 'bg-indigo-600 text-white rounded-br-sm' 
            : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm shadow-sm'
        }`}>
          {isUser ? (
            <p className="text-[13px] leading-relaxed">{message.content}</p>
          ) : (
            <div className="chat-message text-[13px] leading-relaxed">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>
        <p className={`text-[10px] text-slate-400 mt-1 ${isUser ? 'text-right' : ''}`}>
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSelectSubject = (subject) => {
    setSelectedSubject(subject);
    setMessages([{
      id: 1,
      content: `Hello! I'm your **${subject.name}** AI Tutor.\n\nI can help you with topics like ${subject.description}.\n\nFeel free to ask me anything, or pick one of the suggested questions below to get started.`,
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

    await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));

    const response = generateAIResponse(selectedSubject.id, text);

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
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2.5">
            <RiRobot2Line className="w-6 h-6 text-indigo-600" />
            AI Tutor
          </h1>
          <p className="text-slate-500 text-sm mt-1">Choose a subject to start learning with your AI assistant</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {aiSubjects.map((subject, index) => {
            const IconComp = subjectIcons[subject.id];
            return (
              <button
                key={subject.id}
                onClick={() => handleSelectSubject(subject)}
                className="p-5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 text-left group card-hover animate-fade-in"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${subject.color}12` }}>
                    <IconComp className="w-5 h-5" style={{ color: subject.color }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {subject.name}
                    </h3>
                    <p className="text-[11px] text-slate-400">{subject.code}</p>
                  </div>
                </div>
                <p className="text-[12px] text-slate-500 mb-3 leading-relaxed">{subject.description}</p>
                <div className="flex items-center gap-1.5 text-indigo-500 text-[12px] font-medium">
                  <HiOutlineChatAlt2 className="w-3.5 h-3.5" />
                  <span>Start Chat</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
            <BsLightningCharge className="w-5 h-5 text-indigo-600 mb-2" />
            <h4 className="font-semibold text-slate-800 text-[13px]">Smart Responses</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Detailed explanations with code examples and tables</p>
          </div>
          <div className="p-4 rounded-xl bg-violet-50 border border-violet-100">
            <RiRobot2Line className="w-5 h-5 text-violet-600 mb-2" />
            <h4 className="font-semibold text-slate-800 text-[13px]">Subject Expert</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Each tutor specializes in its subject for accurate answers</p>
          </div>
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-100">
            <HiOutlineChatAlt2 className="w-5 h-5 text-rose-600 mb-2" />
            <h4 className="font-semibold text-slate-800 text-[13px]">Interactive Chat</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Natural conversation with markdown and code support</p>
          </div>
        </div>
      </div>
    );
  }

  // Chat Interface
  const SubjectIcon = subjectIcons[selectedSubject.id];

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="px-4 lg:px-6 py-3.5 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setSelectedSubject(null); setMessages([]); }}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <HiOutlineArrowLeft className="w-4 h-4 text-slate-500" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${selectedSubject.color}12` }}>
              <SubjectIcon className="w-4 h-4" style={{ color: selectedSubject.color }} />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-800">{selectedSubject.name}</h2>
              <p className="text-[11px] text-slate-400">AI Tutor</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-2 h-2 bg-emerald-500 rounded-full" />
            <span className="text-[11px] text-emerald-600 font-medium">Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 bg-slate-50/50">
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} isUser={msg.isUser} />
        ))}
        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
              <RiRobot2Line className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm shadow-sm">
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length <= 1 && (
        <div className="px-4 lg:px-6 pb-2 bg-white border-t border-slate-100 pt-3">
          <p className="text-[11px] text-slate-400 mb-2 font-medium">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {selectedSubject.suggestedQuestions.slice(0, 3).map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="px-3 py-1.5 text-[11px] bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors font-medium"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 lg:px-6 border-t border-slate-100 bg-white">
        <div className="flex items-center gap-2.5">
          <div className="flex-1 flex items-center px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-indigo-300 focus-within:bg-white transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask about ${selectedSubject.name}...`}
              className="flex-1 bg-transparent text-[13px] text-slate-700 placeholder-slate-400 outline-none"
            />
          </div>
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-xl transition-colors disabled:cursor-not-allowed"
          >
            <RiSendPlaneFill className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
