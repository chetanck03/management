import { Clock, MapPin, User, BookOpen } from 'lucide-react';
import { formatTime, getClassStatus, getTimeProgress } from '../../utils/timeUtils';

export default function ClassCard({ classItem, compact = false }) {
  const status = getClassStatus(classItem.start, classItem.end);
  const progress = getTimeProgress(classItem.start, classItem.end);

  const statusConfig = {
    done: { label: 'Done', bg: 'bg-gray-100 dark:bg-slate-800', text: 'text-gray-500', badge: 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-400' },
    now: { label: 'Now', bg: 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800', text: 'text-indigo-700 dark:text-indigo-300', badge: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300' },
    upcoming: { label: 'Upcoming', bg: 'bg-white dark:bg-slate-800', text: 'text-gray-700 dark:text-gray-300', badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' },
  };

  const config = statusConfig[status];

  const typeColors = {
    Lecture: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    Lab: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    Tutorial: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  };

  if (compact) {
    return (
      <div className={`p-3 rounded-xl border ${config.bg} ${status === 'now' ? 'border-indigo-200 dark:border-indigo-700 animate-pulse-glow' : 'border-gray-200 dark:border-slate-700'} transition-all`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.badge}`}>{config.label}</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{classItem.subject}</span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">{formatTime(classItem.start)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-2xl border ${config.bg} ${status === 'now' ? 'border-indigo-200 dark:border-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-indigo-950/50' : 'border-gray-200 dark:border-slate-700'} transition-all duration-300 hover:shadow-md`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${config.badge}`}>{config.label}</span>
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${typeColors[classItem.type]}`}>{classItem.type}</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{classItem.subject}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{classItem.code}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Clock className="w-4 h-4" />
          <span>{formatTime(classItem.start)} - {formatTime(classItem.end)}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <MapPin className="w-4 h-4" />
          <span>{classItem.room}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <User className="w-4 h-4" />
          <span>{classItem.faculty}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <BookOpen className="w-4 h-4" />
          <span>{classItem.type}</span>
        </div>
      </div>

      {/* Progress bar for current class */}
      {status === 'now' && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
