import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  HiOutlineViewGrid, HiOutlineUsers, HiOutlineCalendar, 
  HiOutlineBookOpen, HiOutlineBell, HiOutlineChartBar,
  HiOutlineMenuAlt2, HiOutlineX, HiOutlineLogout, HiOutlineArrowLeft
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

const adminNav = [
  { path: '/admin', icon: HiOutlineViewGrid, label: 'Dashboard', end: true },
  { path: '/admin/users', icon: HiOutlineUsers, label: 'Users' },
  { path: '/admin/subjects', icon: HiOutlineBookOpen, label: 'Subjects' },
  { path: '/admin/timetable', icon: HiOutlineCalendar, label: 'Timetable' },
  { path: '/admin/attendance', icon: HiOutlineChartBar, label: 'Attendance' },
  { path: '/admin/notifications', icon: HiOutlineBell, label: 'Notifications' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`
        fixed top-0 left-0 h-full w-[250px] z-50 bg-white border-r border-slate-200
        transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto flex flex-col shadow-sm
      `}>
        <div className="px-5 py-5 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-slate-900">InfoMate</h1>
              <p className="text-[11px] text-red-500 font-semibold">Admin Panel</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-md hover:bg-slate-100">
              <HiOutlineX className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {adminNav.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all
                ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}
              `}
            >
              <item.icon className="w-[18px] h-[18px]" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-100 space-y-1">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700"
          >
            <HiOutlineArrowLeft className="w-[18px] h-[18px]" />
            Back to App
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-red-500 hover:bg-red-50"
          >
            <HiOutlineLogout className="w-[18px] h-[18px]" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 lg:px-6 h-[60px] flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100">
            <HiOutlineMenuAlt2 className="w-5 h-5 text-slate-600" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-slate-500">{user?.full_name}</span>
            <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-semibold">Admin</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
