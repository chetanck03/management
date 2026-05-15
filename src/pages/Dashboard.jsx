import { Link } from 'react-router-dom';
import { 
  Calendar, Bot, BarChart3, BookOpen, Flame, Target, 
  TrendingUp, Clock, ArrowRight, Sparkles, Zap
} from 'lucide-react';
import CircularProgress from '../components/Dashboard/CircularProgress';
import ClassCard from '../components/Dashboard/ClassCard';
import { timetableData, subjects, studentProfile, recentActivity } from '../data/timetable';
import { getCurrentDay, getGreeting, getClassStatus } from '../utils/timeUtils';

export default function Dashboard() {
  const today = getCurrentDay();
  const todayClasses = timetableData[today] || [];
  const currentClass = todayClasses.find(c => getClassStatus(c.start, c.end) === 'now');
  const upcomingClasses = todayClasses.filter(c => getClassStatus(c.start, c.end) === 'upcoming');
  const doneClasses = todayClasses.filter(c => getClassStatus(c.start, c.end) === 'done');
  const overallAttendance = Math.round(subjects.reduce((acc, s) => acc + s.attendance, 0) / subjects.length);

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      {/* Greeting Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            {getGreeting()}, {studentProfile.name}! 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Here's your academic overview for today, {today}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/30 rounded-xl">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">{studentProfile.streak} Day Streak</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/30 rounded-xl">
            <Target className="w-5 h-5 text-green-500" />
            <span className="text-sm font-semibold text-green-700 dark:text-green-300">{studentProfile.goals.completed}/{studentProfile.goals.total} Goals</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-950/50">
          <Calendar className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-2xl font-bold">{todayClasses.length}</p>
          <p className="text-sm opacity-80">Today's Classes</p>
        </div>
        <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-200 dark:shadow-green-950/50">
          <BarChart3 className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-2xl font-bold">{overallAttendance}%</p>
          <p className="text-sm opacity-80">Attendance</p>
        </div>
        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-lg shadow-purple-200 dark:shadow-purple-950/50">
          <BookOpen className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-2xl font-bold">{doneClasses.length}/{todayClasses.length}</p>
          <p className="text-sm opacity-80">Completed</p>
        </div>
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-200 dark:shadow-amber-950/50">
          <TrendingUp className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-2xl font-bold">{studentProfile.cgpa}</p>
          <p className="text-sm opacity-80">CGPA</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current / Next Class */}
        <div className="lg:col-span-2 space-y-4">
          {/* Current Class */}
          {currentClass ? (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-500" />
                Currently Running
              </h2>
              <ClassCard classItem={currentClass} />
            </div>
          ) : (
            <div className="p-6 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center">
              <Clock className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">No class running right now</p>
              {upcomingClasses.length > 0 && (
                <p className="text-sm text-indigo-500 mt-1">Next: {upcomingClasses[0].subject} at {upcomingClasses[0].start}</p>
              )}
            </div>
          )}

          {/* Upcoming Classes */}
          {upcomingClasses.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  Upcoming Today
                </h2>
                <Link to="/schedule" className="text-sm text-indigo-500 hover:text-indigo-600 font-medium flex items-center gap-1">
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-2">
                {upcomingClasses.slice(0, 3).map(cls => (
                  <ClassCard key={cls.id} classItem={cls} compact />
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Link to="/schedule" className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all text-center group">
                <Calendar className="w-6 h-6 text-indigo-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Schedule</span>
              </Link>
              <Link to="/ai-tutor" className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md transition-all text-center group">
                <Bot className="w-6 h-6 text-purple-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">AI Tutor</span>
              </Link>
              <Link to="/attendance" className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-700 hover:shadow-md transition-all text-center group">
                <BarChart3 className="w-6 h-6 text-green-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Attendance</span>
              </Link>
              <Link to="/profile" className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-md transition-all text-center group">
                <Sparkles className="w-6 h-6 text-amber-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Insights</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Attendance Overview */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Attendance Overview</h3>
            <div className="grid grid-cols-3 gap-2">
              {subjects.slice(0, 6).map(subject => (
                <CircularProgress 
                  key={subject.id}
                  percentage={subject.attendance}
                  size={60}
                  strokeWidth={5}
                  color={subject.color}
                  label={subject.code}
                />
              ))}
            </div>
            <Link to="/attendance" className="block mt-4 text-center text-sm text-indigo-500 hover:text-indigo-600 font-medium">
              View Details →
            </Link>
          </div>

          {/* AI Tutor Promo */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <Bot className="w-8 h-8 mb-3" />
              <h3 className="font-bold text-lg mb-1">AI Study Assistant</h3>
              <p className="text-sm opacity-90 mb-4">Get instant help with any subject. Ask questions, solve doubts, understand concepts.</p>
              <Link to="/ai-tutor" className="inline-block px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors">
                Start Learning →
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.slice(0, 4).map(activity => (
                <div key={activity.id} className="flex items-start gap-3">
                  <span className="text-lg">{activity.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{activity.message}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
