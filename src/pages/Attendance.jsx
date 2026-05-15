import { BarChart3, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import CircularProgress from '../components/Dashboard/CircularProgress';
import { subjects } from '../data/timetable';

export default function Attendance() {
  const overallAttendance = Math.round(subjects.reduce((acc, s) => acc + s.attendance, 0) / subjects.length);
  const lowAttendance = subjects.filter(s => s.attendance < 75);
  const highAttendance = subjects.filter(s => s.attendance >= 85);

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <BarChart3 className="w-7 h-7 text-indigo-500" />
          Attendance Analytics
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Track your attendance across all subjects</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center gap-4">
          <CircularProgress percentage={overallAttendance} size={80} strokeWidth={7} color="#6366f1" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Overall Attendance</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{overallAttendance}%</p>
            <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +2% from last week
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Best Performing</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {highAttendance.length > 0 ? highAttendance[0].name : 'N/A'}
          </p>
          <p className="text-sm text-green-500 font-medium">
            {highAttendance.length > 0 ? `${highAttendance[0].attendance}%` : ''}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Needs Attention</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {lowAttendance.length > 0 ? lowAttendance[0].name : 'All Good!'}
          </p>
          <p className="text-sm text-amber-500 font-medium">
            {lowAttendance.length > 0 ? `${lowAttendance[0].attendance}%` : ''}
          </p>
        </div>
      </div>

      {/* Subject-wise Attendance */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-6">Subject-wise Attendance</h3>
        <div className="space-y-4">
          {subjects.map(subject => (
            <div key={subject.id} className="flex items-center gap-4">
              <div className="w-40 lg:w-56 flex-shrink-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{subject.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{subject.code} • {subject.faculty}</p>
              </div>
              <div className="flex-1">
                <div className="w-full h-3 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${subject.attendance}%`,
                      backgroundColor: subject.color,
                    }}
                  />
                </div>
              </div>
              <div className="w-16 text-right">
                <span className={`text-sm font-bold ${
                  subject.attendance >= 85 ? 'text-green-500' :
                  subject.attendance >= 75 ? 'text-amber-500' : 'text-red-500'
                }`}>
                  {subject.attendance}%
                </span>
              </div>
              <div className="w-6">
                {subject.attendance >= 85 ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : subject.attendance < 75 ? (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {subjects.map(subject => (
          <div key={subject.id} className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex flex-col items-center">
            <CircularProgress 
              percentage={subject.attendance} 
              size={70} 
              strokeWidth={6} 
              color={subject.color}
            />
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-3 text-center">{subject.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{subject.code}</p>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      {lowAttendance.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="font-semibold text-amber-800 dark:text-amber-300">Attendance Alerts</h3>
          </div>
          <div className="space-y-2">
            {lowAttendance.map(subject => (
              <div key={subject.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{subject.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Current: {subject.attendance}% • Required: 75%</p>
                </div>
                <span className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-full">
                  Attend next {Math.ceil((75 - subject.attendance) / 5)} classes
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
