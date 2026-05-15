import { 
  User, Mail, Phone, MapPin, GraduationCap, Award, 
  Flame, Target, BookOpen, Calendar, TrendingUp, Star
} from 'lucide-react';
import { studentProfile, subjects } from '../data/timetable';
import CircularProgress from '../components/Dashboard/CircularProgress';

export default function Profile() {
  const overallAttendance = Math.round(subjects.reduce((acc, s) => acc + s.attendance, 0) / subjects.length);

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <User className="w-7 h-7 text-indigo-500" />
          Student Profile
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Your academic profile and achievements</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
              {studentProfile.name[0]}
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{studentProfile.fullName}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{studentProfile.rollNo}</p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <GraduationCap className="w-4 h-4" />
                <span>{studentProfile.branch}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{studentProfile.semester}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{studentProfile.college}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
              <div>
                <p className="text-lg font-bold text-indigo-500">{studentProfile.cgpa}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">CGPA</p>
              </div>
              <div>
                <p className="text-lg font-bold text-green-500">{overallAttendance}%</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Attendance</p>
              </div>
              <div>
                <p className="text-lg font-bold text-orange-500">{studentProfile.streak}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Streak</p>
              </div>
            </div>
          </div>

          {/* Study Streak */}
          <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-6 h-6" />
              <h3 className="font-bold">Study Streak</h3>
            </div>
            <p className="text-3xl font-bold">{studentProfile.streak} Days</p>
            <p className="text-sm opacity-80 mt-1">Keep it going! You're on fire 🔥</p>
            <div className="flex gap-1 mt-3">
              {Array.from({ length: 7 }, (_, i) => (
                <div 
                  key={i} 
                  className={`flex-1 h-2 rounded-full ${i < 5 ? 'bg-white' : 'bg-white/30'}`}
                />
              ))}
            </div>
            <p className="text-xs opacity-70 mt-2">5/7 days this week</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Daily Goals */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-green-500" />
                Daily Goals
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {studentProfile.goals.completed}/{studentProfile.goals.total} completed
              </span>
            </div>
            <div className="space-y-3">
              {[
                { text: 'Attend all classes today', done: true },
                { text: 'Review DBMS normalization notes', done: true },
                { text: 'Solve 3 DSA problems', done: true },
                { text: 'Read CN chapter on TCP/IP', done: false },
                { text: 'Complete SE assignment', done: false },
              ].map((goal, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-750 border border-gray-100 dark:border-slate-700">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    goal.done ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-slate-600'
                  }`}>
                    {goal.done && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className={`text-sm ${goal.done ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-300'}`}>
                    {goal.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-amber-500" />
              Achievements
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: '🔥', title: 'Streak Master', desc: '10+ day streak', unlocked: true },
                { icon: '📚', title: 'Bookworm', desc: '50+ AI queries', unlocked: true },
                { icon: '✅', title: 'Perfect Week', desc: '100% attendance', unlocked: false },
                { icon: '⭐', title: 'Top Scorer', desc: 'CGPA > 9.0', unlocked: false },
                { icon: '🎯', title: 'Goal Crusher', desc: '7-day goals', unlocked: true },
                { icon: '🧠', title: 'Quick Learner', desc: 'All subjects', unlocked: false },
                { icon: '💪', title: 'Consistent', desc: '30-day streak', unlocked: false },
                { icon: '🏆', title: 'Champion', desc: 'All achievements', unlocked: false },
              ].map((achievement, i) => (
                <div key={i} className={`p-3 rounded-xl text-center border ${
                  achievement.unlocked 
                    ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/30' 
                    : 'bg-gray-50 dark:bg-slate-750 border-gray-200 dark:border-slate-700 opacity-50'
                }`}>
                  <span className="text-2xl">{achievement.icon}</span>
                  <p className="text-xs font-medium text-gray-900 dark:text-white mt-1">{achievement.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{achievement.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Study Recommendations */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-indigo-500" />
              AI Study Recommendations
            </h3>
            <div className="space-y-3">
              {[
                { subject: 'Computer Networks', tip: 'Focus on TCP/IP protocols - your attendance is low. Use AI Tutor for quick revision.', priority: 'high' },
                { subject: 'Algorithms', tip: 'Practice more DP problems. Your understanding of greedy algorithms is strong.', priority: 'medium' },
                { subject: 'Theory of Computation', tip: 'Review automata theory before the upcoming test. Try converting NFA to DFA.', priority: 'medium' },
              ].map((rec, i) => (
                <div key={i} className={`p-4 rounded-xl border ${
                  rec.priority === 'high' 
                    ? 'border-red-200 dark:border-red-800/30 bg-red-50 dark:bg-red-950/10' 
                    : 'border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-750'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{rec.subject}</span>
                    {rec.priority === 'high' && (
                      <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">Priority</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{rec.tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
