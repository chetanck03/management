import { Link } from 'react-router-dom';
import { 
  HiOutlineCalendar, HiOutlineChartBar, HiOutlineClock, 
  HiOutlineArrowRight, HiOutlineBookOpen
} from 'react-icons/hi';
import { RiRobot2Line, RiFireLine } from 'react-icons/ri';
import { TbTargetArrow } from 'react-icons/tb';
import { BsLightningCharge, BsStars, BsBarChart } from 'react-icons/bs';
import { FiTrendingUp, FiCheckCircle } from 'react-icons/fi';
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

  const activityIcons = {
    attendance: FiCheckCircle,
    ai: RiRobot2Line,
    streak: RiFireLine,
    goal: TbTargetArrow,
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      {/* Greeting Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-[26px] font-bold text-slate-800">
            {getGreeting()}, {studentProfile.name}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Here's your academic overview for today, {today}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-lg">
            <RiFireLine className="w-4 h-4 text-orange-500" />
            <span className="text-[12px] font-semibold text-orange-700">{studentProfile.streak} Day Streak</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
            <TbTargetArrow className="w-4 h-4 text-emerald-600" />
            <span className="text-[12px] font-semibold text-emerald-700">{studentProfile.goals.completed}/{studentProfile.goals.total} Goals</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-sm">
          <HiOutlineCalendar className="w-5 h-5 mb-2 opacity-80" />
          <p className="text-xl font-bold">{todayClasses.length}</p>
          <p className="text-[12px] opacity-80">Today's Classes</p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-sm">
          <BsBarChart className="w-5 h-5 mb-2 opacity-80" />
          <p className="text-xl font-bold">{overallAttendance}%</p>
          <p className="text-[12px] opacity-80">Attendance</p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 text-white shadow-sm">
          <HiOutlineBookOpen className="w-5 h-5 mb-2 opacity-80" />
          <p className="text-xl font-bold">{doneClasses.length}/{todayClasses.length}</p>
          <p className="text-[12px] opacity-80">Completed</p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-sm">
          <FiTrendingUp className="w-5 h-5 mb-2 opacity-80" />
          <p className="text-xl font-bold">{studentProfile.cgpa}</p>
          <p className="text-[12px] opacity-80">CGPA</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Current / Next Class */}
        <div className="lg:col-span-2 space-y-4">
          {/* Current Class */}
          {currentClass ? (
            <div>
              <h2 className="text-[15px] font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <BsLightningCharge className="w-4 h-4 text-indigo-600" />
                Currently Running
              </h2>
              <ClassCard classItem={currentClass} />
            </div>
          ) : (
            <div className="p-6 rounded-xl border border-slate-200 bg-white text-center shadow-sm">
              <HiOutlineClock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">No class running right now</p>
              {upcomingClasses.length > 0 && (
                <p className="text-[12px] text-indigo-500 mt-1 font-medium">Next: {upcomingClasses[0].subject} at {upcomingClasses[0].start}</p>
              )}
            </div>
          )}

          {/* Upcoming Classes */}
          {upcomingClasses.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[15px] font-semibold text-slate-800 flex items-center gap-2">
                  <HiOutlineClock className="w-4 h-4 text-amber-500" />
                  Upcoming Today
                </h2>
                <Link to="/schedule" className="text-[12px] text-indigo-500 hover:text-indigo-600 font-medium flex items-center gap-1">
                  View All <HiOutlineArrowRight className="w-3.5 h-3.5" />
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
            <h2 className="text-[15px] font-semibold text-slate-800 mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              <Link to="/schedule" className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-sm transition-all text-center group card-hover">
                <HiOutlineCalendar className="w-5 h-5 text-indigo-500 mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-[12px] font-medium text-slate-600">Schedule</span>
              </Link>
              <Link to="/ai-tutor" className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-violet-200 hover:shadow-sm transition-all text-center group card-hover">
                <RiRobot2Line className="w-5 h-5 text-violet-500 mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-[12px] font-medium text-slate-600">AI Tutor</span>
              </Link>
              <Link to="/attendance" className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-200 hover:shadow-sm transition-all text-center group card-hover">
                <HiOutlineChartBar className="w-5 h-5 text-emerald-500 mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-[12px] font-medium text-slate-600">Attendance</span>
              </Link>
              <Link to="/profile" className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-amber-200 hover:shadow-sm transition-all text-center group card-hover">
                <BsStars className="w-5 h-5 text-amber-500 mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-[12px] font-medium text-slate-600">Insights</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Attendance Overview */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-800 text-[14px] mb-4">Attendance Overview</h3>
            <div className="grid grid-cols-3 gap-3">
              {subjects.slice(0, 6).map(subject => (
                <CircularProgress 
                  key={subject.id}
                  percentage={subject.attendance}
                  size={56}
                  strokeWidth={5}
                  color={subject.color}
                  label={subject.code}
                />
              ))}
            </div>
            <Link to="/attendance" className="block mt-4 text-center text-[12px] text-indigo-500 hover:text-indigo-600 font-medium">
              View Details
            </Link>
          </div>

          {/* AI Tutor Promo */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 text-white relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <RiRobot2Line className="w-7 h-7 mb-2.5 opacity-90" />
              <h3 className="font-bold text-[15px] mb-1">AI Study Assistant</h3>
              <p className="text-[12px] opacity-80 leading-relaxed mb-3">Get instant help with any subject. Ask questions, solve doubts, understand concepts.</p>
              <Link to="/ai-tutor" className="inline-block px-3.5 py-2 bg-white/15 hover:bg-white/25 rounded-lg text-[12px] font-medium transition-colors">
                Start Learning
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-800 text-[14px] mb-3">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.slice(0, 4).map(activity => {
                const ActivityIcon = activityIcons[activity.type] || FiCheckCircle;
                return (
                  <div key={activity.id} className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ActivityIcon className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] text-slate-600 leading-relaxed">{activity.message}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
