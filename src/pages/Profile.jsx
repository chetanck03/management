import { 
  HiOutlineUser, HiOutlineLocationMarker, HiOutlineAcademicCap, 
  HiOutlineCalendar, HiOutlineBookOpen, HiOutlineCheck
} from 'react-icons/hi';
import { BsLightningCharge, BsTrophy, BsStars, BsBarChart } from 'react-icons/bs';
import { RiFireLine, RiBookMarkedLine } from 'react-icons/ri';
import { TbTargetArrow } from 'react-icons/tb';
import { FiAward, FiTarget, FiTrendingUp, FiZap } from 'react-icons/fi';
import { studentProfile, subjects } from '../data/timetable';
import CircularProgress from '../components/Dashboard/CircularProgress';

export default function Profile() {
  const overallAttendance = Math.round(subjects.reduce((acc, s) => acc + s.attendance, 0) / subjects.length);

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2.5">
          <HiOutlineUser className="w-6 h-6 text-indigo-600" />
          Student Profile
        </h1>
        <p className="text-slate-500 text-sm mt-1">Your academic profile and achievements</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-6 rounded-xl bg-white border border-slate-200 text-center shadow-sm">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              {studentProfile.name[0]}
            </div>
            <h2 className="text-lg font-bold text-slate-800">{studentProfile.fullName}</h2>
            <p className="text-[13px] text-slate-400 mt-0.5">{studentProfile.rollNo}</p>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-center gap-2 text-[13px] text-slate-500">
                <HiOutlineAcademicCap className="w-4 h-4 text-slate-400" />
                <span>{studentProfile.branch}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-[13px] text-slate-500">
                <HiOutlineCalendar className="w-4 h-4 text-slate-400" />
                <span>{studentProfile.semester}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-[13px] text-slate-500">
                <HiOutlineLocationMarker className="w-4 h-4 text-slate-400" />
                <span>{studentProfile.college}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-100">
              <div>
                <p className="text-lg font-bold text-indigo-600">{studentProfile.cgpa}</p>
                <p className="text-[11px] text-slate-400">CGPA</p>
              </div>
              <div>
                <p className="text-lg font-bold text-emerald-600">{overallAttendance}%</p>
                <p className="text-[11px] text-slate-400">Attendance</p>
              </div>
              <div>
                <p className="text-lg font-bold text-orange-500">{studentProfile.streak}</p>
                <p className="text-[11px] text-slate-400">Streak</p>
              </div>
            </div>
          </div>

          {/* Study Streak */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <RiFireLine className="w-5 h-5" />
              <h3 className="font-bold text-[14px]">Study Streak</h3>
            </div>
            <p className="text-3xl font-bold">{studentProfile.streak} Days</p>
            <p className="text-[12px] opacity-80 mt-1">Keep it going! You're doing great.</p>
            <div className="flex gap-1 mt-3">
              {Array.from({ length: 7 }, (_, i) => (
                <div 
                  key={i} 
                  className={`flex-1 h-2 rounded-full ${i < 5 ? 'bg-white' : 'bg-white/30'}`}
                />
              ))}
            </div>
            <p className="text-[11px] opacity-70 mt-2">5/7 days this week</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Daily Goals */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-[15px]">
                <FiTarget className="w-4.5 h-4.5 text-emerald-600" />
                Daily Goals
              </h3>
              <span className="text-[12px] text-slate-400 font-medium">
                {studentProfile.goals.completed}/{studentProfile.goals.total} completed
              </span>
            </div>
            <div className="space-y-2">
              {[
                { text: 'Attend all classes today', done: true },
                { text: 'Review DBMS normalization notes', done: true },
                { text: 'Solve 3 DSA problems', done: true },
                { text: 'Read CN chapter on TCP/IP', done: false },
                { text: 'Complete SE assignment', done: false },
              ].map((goal, i) => (
                <div key={i} className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    goal.done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'
                  }`}>
                    {goal.done && <HiOutlineCheck className="w-3 h-3 text-white" />}
                  </div>
                  <span className={`text-[13px] ${goal.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                    {goal.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-[15px] mb-4">
              <FiAward className="w-4.5 h-4.5 text-amber-500" />
              Achievements
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: RiFireLine, title: 'Streak Master', desc: '10+ day streak', unlocked: true, color: 'text-orange-500' },
                { icon: RiBookMarkedLine, title: 'Bookworm', desc: '50+ AI queries', unlocked: true, color: 'text-indigo-500' },
                { icon: HiOutlineCheck, title: 'Perfect Week', desc: '100% attendance', unlocked: false, color: 'text-emerald-500' },
                { icon: BsStars, title: 'Top Scorer', desc: 'CGPA > 9.0', unlocked: false, color: 'text-amber-500' },
                { icon: TbTargetArrow, title: 'Goal Crusher', desc: '7-day goals', unlocked: true, color: 'text-rose-500' },
                { icon: FiZap, title: 'Quick Learner', desc: 'All subjects', unlocked: false, color: 'text-violet-500' },
                { icon: FiTrendingUp, title: 'Consistent', desc: '30-day streak', unlocked: false, color: 'text-cyan-500' },
                { icon: BsTrophy, title: 'Champion', desc: 'All achievements', unlocked: false, color: 'text-yellow-600' },
              ].map((achievement, i) => {
                const AchIcon = achievement.icon;
                return (
                  <div key={i} className={`p-3 rounded-xl text-center border transition-all ${
                    achievement.unlocked 
                      ? 'bg-amber-50/60 border-amber-200' 
                      : 'bg-slate-50 border-slate-100 opacity-50'
                  }`}>
                    <AchIcon className={`w-5 h-5 mx-auto mb-1 ${achievement.color}`} />
                    <p className="text-[12px] font-semibold text-slate-700">{achievement.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{achievement.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Study Recommendations */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-[15px] mb-4">
              <BsStars className="w-4.5 h-4.5 text-indigo-500" />
              AI Study Recommendations
            </h3>
            <div className="space-y-3">
              {[
                { subject: 'Computer Networks', tip: 'Focus on TCP/IP protocols - your attendance is low. Use AI Tutor for quick revision.', priority: 'high' },
                { subject: 'Algorithms', tip: 'Practice more DP problems. Your understanding of greedy algorithms is strong.', priority: 'medium' },
                { subject: 'Theory of Computation', tip: 'Review automata theory before the upcoming test. Try converting NFA to DFA.', priority: 'medium' },
              ].map((rec, i) => (
                <div key={i} className={`p-3.5 rounded-xl border ${
                  rec.priority === 'high' 
                    ? 'border-red-200 bg-red-50/50' 
                    : 'border-slate-100 bg-slate-50'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <HiOutlineBookOpen className="w-4 h-4 text-indigo-500" />
                    <span className="text-[13px] font-semibold text-slate-700">{rec.subject}</span>
                    {rec.priority === 'high' && (
                      <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-semibold">Priority</span>
                    )}
                  </div>
                  <p className="text-[12px] text-slate-500 leading-relaxed">{rec.tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
