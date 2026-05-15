import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Calendar, Bot, BarChart3, User, 
  Settings, BookOpen, Bell, Search, X, Flame
} from 'lucide-react';
import { studentProfile } from '../../data/timetable';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/schedule', icon: Calendar, label: 'Schedule' },
  { path: '/ai-tutor', icon: Bot, label: 'AI Tutor' },
  { path: '/attendance', icon: BarChart3, label: 'Attendance' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-72 z-50
        bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
        flex flex-col
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">InfoMate</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Smart Student Hub</p>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Student Quick Info */}
        <div className="p-4 mx-4 mt-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-800/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
              {studentProfile.name[0]}
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900 dark:text-white">{studentProfile.fullName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{studentProfile.rollNo}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{studentProfile.streak} day streak</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-700">
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="w-5 h-5" />
              <span className="font-semibold text-sm">AI Study Buddy</span>
            </div>
            <p className="text-xs opacity-90 mb-3">Get instant help with any subject</p>
            <NavLink 
              to="/ai-tutor" 
              onClick={onClose}
              className="block text-center py-2 bg-white/20 rounded-lg text-xs font-medium hover:bg-white/30 transition-colors"
            >
              Start Learning →
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
}
