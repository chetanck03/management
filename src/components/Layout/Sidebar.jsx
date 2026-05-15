import { NavLink } from 'react-router-dom';
import { 
  HiOutlineViewGrid, 
  HiOutlineCalendar, 
  HiOutlineChartBar, 
  HiOutlineUser,
  HiOutlineX,
  HiOutlineAcademicCap
} from 'react-icons/hi';
import { RiRobot2Line } from 'react-icons/ri';
import { BsLightningCharge } from 'react-icons/bs';
import { studentProfile } from '../../data/timetable';

const navItems = [
  { path: '/', icon: HiOutlineViewGrid, label: 'Dashboard' },
  { path: '/schedule', icon: HiOutlineCalendar, label: 'Schedule' },
  { path: '/ai-tutor', icon: RiRobot2Line, label: 'AI Tutor' },
  { path: '/attendance', icon: HiOutlineChartBar, label: 'Attendance' },
  { path: '/profile', icon: HiOutlineUser, label: 'Profile' },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-[260px] z-50
        bg-white border-r border-slate-200
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
        flex flex-col shadow-sm
      `}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
                <HiOutlineAcademicCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">InfoMate</h1>
                <p className="text-[11px] text-slate-400 font-medium -mt-0.5">Smart Student Hub</p>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden p-1.5 rounded-md hover:bg-slate-100 transition-colors">
              <HiOutlineX className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Student Info */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">
              {studentProfile.name[0]}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-slate-800 truncate">{studentProfile.fullName}</p>
              <p className="text-[11px] text-slate-400">{studentProfile.semester}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 space-y-0.5">
          <p className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Menu</p>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150
                ${isActive 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }
              `}
            >
              <item.icon className="w-[18px] h-[18px]" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom CTA */}
        <div className="p-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
            <div className="flex items-center gap-2 mb-1.5">
              <BsLightningCharge className="w-4 h-4" />
              <span className="font-semibold text-[13px]">AI Study Buddy</span>
            </div>
            <p className="text-[11px] opacity-80 leading-relaxed mb-3">Get instant help with any subject topic</p>
            <NavLink 
              to="/ai-tutor" 
              onClick={onClose}
              className="block text-center py-2 bg-white/15 hover:bg-white/25 rounded-lg text-[12px] font-medium transition-colors"
            >
              Start Learning
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
}
