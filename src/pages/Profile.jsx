import { useState, useEffect } from 'react';
import { 
  HiOutlineUser, HiOutlineLocationMarker, HiOutlineAcademicCap, 
  HiOutlineCalendar, HiOutlineBookOpen, HiOutlineCheck, HiOutlineLogout
} from 'react-icons/hi';
import { BsLightningCharge, BsTrophy, BsStars } from 'react-icons/bs';
import { RiFireLine, RiBookMarkedLine } from 'react-icons/ri';
import { TbTargetArrow } from 'react-icons/tb';
import { FiAward, FiTrendingUp, FiZap } from 'react-icons/fi';
import CircularProgress from '../components/Dashboard/CircularProgress';
import { useAuth } from '../context/AuthContext';
import { attendanceAPI, goalsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [attendanceData, setAttendanceData] = useState([]);
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [attRes, goalRes] = await Promise.all([
        attendanceAPI.getSummary(),
        goalsAPI.getAll(),
      ]);
      setAttendanceData(attRes.subjects || []);
      setGoals(goalRes.goals || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!newGoal.trim()) return;
    try {
      const res = await goalsAPI.create({ text: newGoal });
      setGoals(prev => [...prev, res.goal]);
      setNewGoal('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleGoal = async (id) => {
    try {
      const res = await goalsAPI.toggle(id);
      setGoals(prev => prev.map(g => g.id === id ? res.goal : g));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const overallAttendance = attendanceData.length > 0
    ? Math.round(attendanceData.reduce((acc, s) => acc + s.percentage, 0) / attendanceData.length)
    : 0;

  const completedGoals = goals.filter(g => g.completed).length;

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2.5">
            <HiOutlineUser className="w-6 h-6 text-indigo-600" />
            Student Profile
          </h1>
          <p className="text-slate-500 text-sm mt-1">Your academic profile and goals</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium"
        >
          <HiOutlineLogout className="w-4 h-4" />
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-6 rounded-xl bg-white border border-slate-200 text-center shadow-sm">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              {user?.full_name?.[0] || 'U'}
            </div>
            <h2 className="text-lg font-bold text-slate-800">{user?.full_name}</h2>
            <p className="text-[13px] text-slate-400 mt-0.5">{user?.roll_no || 'No roll number'}</p>
            
            <div className="mt-4 space-y-2">
              {user?.branch && (
                <div className="flex items-center justify-center gap-2 text-[13px] text-slate-500">
                  <HiOutlineAcademicCap className="w-4 h-4 text-slate-400" />
                  <span>{user.branch}</span>
                </div>
              )}
              {user?.semester && (
                <div className="flex items-center justify-center gap-2 text-[13px] text-slate-500">
                  <HiOutlineCalendar className="w-4 h-4 text-slate-400" />
                  <span>{user.semester}</span>
                </div>
              )}
              {user?.college && (
                <div className="flex items-center justify-center gap-2 text-[13px] text-slate-500">
                  <HiOutlineLocationMarker className="w-4 h-4 text-slate-400" />
                  <span>{user.college}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-100">
              <div>
                <p className="text-lg font-bold text-indigo-600">{user?.cgpa || '0.0'}</p>
                <p className="text-[11px] text-slate-400">CGPA</p>
              </div>
              <div>
                <p className="text-lg font-bold text-emerald-600">{overallAttendance}%</p>
                <p className="text-[11px] text-slate-400">Attendance</p>
              </div>
              <div>
                <p className="text-lg font-bold text-orange-500">{user?.streak || 0}</p>
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
            <p className="text-3xl font-bold">{user?.streak || 0} Days</p>
            <p className="text-[12px] opacity-80 mt-1">Keep it going! You're doing great.</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Daily Goals */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-[15px]">
                <TbTargetArrow className="w-5 h-5 text-emerald-600" />
                Daily Goals
              </h3>
              <span className="text-[12px] text-slate-400 font-medium">
                {completedGoals}/{goals.length} completed
              </span>
            </div>

            {/* Add Goal */}
            <form onSubmit={handleAddGoal} className="flex gap-2 mb-3">
              <input
                type="text"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="Add a new goal..."
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-300"
              />
              <button
                type="submit"
                disabled={!newGoal.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white disabled:text-slate-400 text-[13px] font-medium rounded-lg transition-colors"
              >
                Add
              </button>
            </form>

            <div className="space-y-2">
              {goals.map(goal => (
                <div key={goal.id} className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <button
                    onClick={() => handleToggleGoal(goal.id)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      goal.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 hover:border-indigo-400'
                    }`}
                  >
                    {goal.completed && <HiOutlineCheck className="w-3 h-3 text-white" />}
                  </button>
                  <span className={`text-[13px] ${goal.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                    {goal.text}
                  </span>
                </div>
              ))}
              {goals.length === 0 && (
                <p className="text-[13px] text-slate-400 text-center py-4">No goals for today. Add one above!</p>
              )}
            </div>
          </div>

          {/* Achievements */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-[15px] mb-4">
              <FiAward className="w-5 h-5 text-amber-500" />
              Achievements
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: RiFireLine, title: 'Streak Master', desc: '10+ day streak', unlocked: (user?.streak || 0) >= 10, color: 'text-orange-500' },
                { icon: RiBookMarkedLine, title: 'Bookworm', desc: '50+ AI queries', unlocked: false, color: 'text-indigo-500' },
                { icon: HiOutlineCheck, title: 'Perfect Week', desc: '100% attendance', unlocked: false, color: 'text-emerald-500' },
                { icon: BsStars, title: 'Top Scorer', desc: 'CGPA > 9.0', unlocked: parseFloat(user?.cgpa || 0) > 9, color: 'text-amber-500' },
                { icon: TbTargetArrow, title: 'Goal Crusher', desc: '7-day goals', unlocked: false, color: 'text-rose-500' },
                { icon: FiZap, title: 'Quick Learner', desc: 'All subjects', unlocked: false, color: 'text-violet-500' },
                { icon: FiTrendingUp, title: 'Consistent', desc: '30-day streak', unlocked: (user?.streak || 0) >= 30, color: 'text-cyan-500' },
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
        </div>
      </div>
    </div>
  );
}
