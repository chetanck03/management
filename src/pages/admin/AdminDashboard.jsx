import { useState, useEffect } from 'react';
import { HiOutlineUsers, HiOutlineBookOpen, HiOutlineCalendar, HiOutlineChartBar } from 'react-icons/hi';
import { RiRobot2Line } from 'react-icons/ri';
import { TbTargetArrow } from 'react-icons/tb';
import { adminAPI } from '../../services/adminApi';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats()
      .then(res => setStats(res.stats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const cards = [
    { label: 'Total Students', value: stats?.totalStudents || 0, icon: HiOutlineUsers, color: 'from-indigo-500 to-indigo-600' },
    { label: 'Subjects', value: stats?.totalSubjects || 0, icon: HiOutlineBookOpen, color: 'from-violet-500 to-violet-600' },
    { label: 'Timetable Entries', value: stats?.totalTimetableEntries || 0, icon: HiOutlineCalendar, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Attendance Records', value: stats?.totalAttendanceRecords || 0, icon: HiOutlineChartBar, color: 'from-amber-500 to-orange-500' },
    { label: 'AI Chat Messages', value: stats?.totalChatMessages || 0, icon: RiRobot2Line, color: 'from-pink-500 to-rose-500' },
    { label: 'Goals Created', value: stats?.totalGoals || 0, icon: TbTargetArrow, color: 'from-cyan-500 to-teal-500' },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Overview of the InfoMate platform</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, i) => (
          <div key={i} className={`p-5 rounded-xl bg-gradient-to-br ${card.color} text-white shadow-sm`}>
            <card.icon className="w-6 h-6 mb-3 opacity-80" />
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-[13px] opacity-80">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
