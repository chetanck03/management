import { useState } from 'react';
import { Menu, Search, Bell, Moon, Sun, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { notifications } from '../../data/timetable';

export default function Header({ onMenuClick }) {
  const { darkMode, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-slate-700">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-800 rounded-xl w-80">
            <Search className="w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search subjects, notes, classes..."
              className="bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 outline-none w-full"
            />
            <kbd className="hidden lg:inline text-xs text-gray-400 bg-gray-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">⌘K</kbd>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Mobile search */}
          <button 
            onClick={() => setShowSearch(!showSearch)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Theme toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden animate-fade-in">
                <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  <button onClick={() => setShowNotifications(false)}>
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map(notif => (
                    <div key={notif.id} className={`p-4 border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-750 transition-colors ${!notif.read ? 'bg-indigo-50/50 dark:bg-indigo-950/20' : ''}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notif.type === 'warning' ? 'bg-yellow-500' :
                          notif.type === 'danger' ? 'bg-red-500' :
                          notif.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{notif.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{notif.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      {showSearch && (
        <div className="md:hidden px-4 pb-3 animate-fade-in">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-800 rounded-xl">
            <Search className="w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search..."
              className="bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 outline-none w-full"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
}
