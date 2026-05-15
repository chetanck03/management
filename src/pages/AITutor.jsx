import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { HiOutlineArrowLeft, HiOutlineChatAlt2 } from 'react-icons/hi';
import { RiRobot2Line, RiSendPlaneFill } from 'react-icons/ri';
import { BsLightningCharge, BsCpu, BsGlobe, BsGear, BsBraces } from 'react-icons/bs';
import { FiDatabase } from 'react-icons/fi';
import { subjectsAPI, aiAPI } from '../services/api';

const subjectIconMap = {
  'Data Structures': BsBraces,
  'Algorithms': BsLightningCharge,
  'Database Management Systems': FiDatabase,
  'Software Engineering': BsGear,
  'Computer Networks': BsGlobe,
  'Theory of Computation': BsCpu,
};

const suggestedQuestionsMap = {
  'Data Structures': ['Explain the difference between a stack and a queue', 'How does a binary search tree work?', 'What is hashing?'],
  'Algorithms': ['Explain dynamic programming with an example', 'What is the difference between BFS and DFS?', 'How does Dijkstra\'s algorithm work?'],
  'Database Management Systems': ['Explain the different normal forms', 'What is ACID property?', 'Explain joins with examples'],
  'Software Engineering': ['Explain the Agile methodology', 'What are SOLID principles?', 'What is test-driven development?'],
  'Computer Networks': ['Explain the OSI model layers', 'Difference between TCP and UDP', 'How does DNS resolution work?'],
  'Theory of Computation': ['Explain the difference between DFA and NFA', 'What is a context-free grammar?', 'What is the halting problem?'],
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
      <div className="max-w-[85%] lg:max-w-[70%]">
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
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef(null);

  useEffect(() => {
    loadSubjects();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const loadSubjects = async () => {
    try {
      const res = await subjectsAPI.getAll();
      setSubjects(res.subjects || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSubject = async (subject) => {
    setSelectedSubject(subject);
    
    // Load chat history
    try {
      const res = await aiAPI.getHistory(subject.id);
      if (res.messages && res.messages.length > 0) {
        setMessages(res.messages.map(m => ({
          id: m.id,
          content: m.message,
          isUser: m.role === 'user',
          time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        })));
      } else {
        setMessages([{
          id: 'welcome',
          content: `Hello! I'm your **${subject.name}** AI Tutor.\n\nI can help you understand concepts, solve doubts, and explain code. Ask me anything about ${subject.name}.`,
          isUser: false,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }]);
      }
    } catch (err) {
      setMessages([{
        id: 'welcome',
        content: `Hello! I'm your **${subject.name}** AI Tutor. Ask me anything.`,
        isUser: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    }
  };

  const handleSend = async (text = input) => {
    if (!text.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      content: text,
      isUser: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await aiAPI.chat({ subjectId: selectedSubject.id, message: text });
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        content: res.response,
        isUser: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        content: `Sorry, I couldn't process that request. ${err.message}`,
        isUser: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Subject Selection
  if (!selectedSubject) {
    if (loading) {
      return (
        <div className="p-6 flex items-center justify-center h-64">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

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
          {subjects.map((subject, index) => {
            const IconComp = subjectIconMap[subject.name] || BsLightningCharge;
            return (
              <button
                key={subject.id}
                onClick={() => handleSelectSubject(subject)}
                className="p-5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 text-left group card-hover animate-fade-in"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${subject.color}15` }}>
                    <IconComp className="w-5 h-5" style={{ color: subject.color }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {subject.name}
                    </h3>
                    <p className="text-[11px] text-slate-400">{subject.code}</p>
                  </div>
                </div>
                <p className="text-[12px] text-slate-500 mb-3">{subject.faculty}</p>
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
            <h4 className="font-semibold text-slate-800 text-[13px]">Powered by Gemini</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Advanced AI for detailed explanations with code examples</p>
          </div>
          <div className="p-4 rounded-xl bg-violet-50 border border-violet-100">
            <RiRobot2Line className="w-5 h-5 text-violet-600 mb-2" />
            <h4 className="font-semibold text-slate-800 text-[13px]">Subject Expert</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Context-aware tutor that remembers your conversation</p>
          </div>
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-100">
            <HiOutlineChatAlt2 className="w-5 h-5 text-rose-600 mb-2" />
            <h4 className="font-semibold text-slate-800 text-[13px]">Chat History</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Your conversations are saved for future reference</p>
          </div>
        </div>
      </div>
    );
  }

  // Chat Interface
  const SubjectIcon = subjectIconMap[selectedSubject.name] || BsLightningCharge;
  const suggested = suggestedQuestionsMap[selectedSubject.name] || [];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 lg:px-6 py-3.5 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setSelectedSubject(null); setMessages([]); }}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <HiOutlineArrowLeft className="w-4 h-4 text-slate-500" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${selectedSubject.color}15` }}>
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
      {messages.length <= 1 && suggested.length > 0 && (
        <div className="px-4 lg:px-6 pb-2 bg-white border-t border-slate-100 pt-3">
          <p className="text-[11px] text-slate-400 mb-2 font-medium">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggested.map((q, i) => (
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
              disabled={isTyping}
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
