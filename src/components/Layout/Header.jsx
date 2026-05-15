import { useState } from 'react';
import { HiOutlineMenuAlt2, HiOutlineSearch, HiOutlineBell, HiOutlineX } from 'react-icons/hi';
import { notifications } from '../../data/timetable';

export default function Header({ onMenuClick }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="flex items-center justify-between px-4 lg:px-6 h-[60px]">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <HiOutlineMenuAlt2 className="w-5 h-5 text-slate-600" />
          </button>

          <div className="hidden md:flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg w-72">
            <HiOutlineSearch className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search subjects, notes..."
              className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => setShowSearch(!showSearch)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <HiOutlineSearch className="w-5 h-5 text-slate-500" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors relative"
            >
              <HiOutlineBell className="w-5 h-5 text-slate-500" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-scale-in">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-slate-800">Notifications</h3>
                  <button onClick={() => setShowNotifications(false)}>
                    <HiOutlineX className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map(notif => (
                    <div key={notif.id} className={`px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!notif.read ? 'bg-indigo-50/40' : ''}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                          notif.type === 'warning' ? 'bg-amber-500' :
                          notif.type === 'danger' ? 'bg-red-500' :
                          notif.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                        }`} />
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-slate-700">{notif.title}</p>
                          <p className="text-[12px] text-slate-500 mt-0.5">{notif.message}</p>
                          <p className="text-[11px] text-slate-400 mt-1">{notif.time}</p>
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

      {showSearch && (
        <div className="md:hidden px-4 pb-3 animate-fade-in">
          <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg">
            <HiOutlineSearch className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search..."
              className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
}
