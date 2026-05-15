import { HiOutlineClock, HiOutlineLocationMarker, HiOutlineUser, HiOutlineBookOpen } from 'react-icons/hi';
import { formatTime, getClassStatus, getTimeProgress } from '../../utils/timeUtils';

export default function ClassCard({ classItem, compact = false }) {
  const status = getClassStatus(classItem.start, classItem.end);
  const progress = getTimeProgress(classItem.start, classItem.end);

  const statusConfig = {
    done: { label: 'Done', bg: 'bg-slate-50 border-slate-200', badge: 'bg-slate-100 text-slate-500' },
    now: { label: 'Live', bg: 'bg-white border-indigo-200 shadow-md shadow-indigo-50', badge: 'bg-indigo-100 text-indigo-600' },
    upcoming: { label: 'Upcoming', bg: 'bg-white border-slate-200', badge: 'bg-amber-50 text-amber-600' },
  };

  const config = statusConfig[status];

  const typeColors = {
    Lecture: 'bg-blue-50 text-blue-600',
    Lab: 'bg-emerald-50 text-emerald-600',
    Tutorial: 'bg-violet-50 text-violet-600',
  };

  if (compact) {
    return (
      <div className={`px-4 py-3 rounded-xl border ${config.bg} transition-all card-hover`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${config.badge}`}>{config.label}</span>
            <span className="text-[13px] font-semibold text-slate-800">{classItem.subject}</span>
          </div>
          <span className="text-[12px] text-slate-400 font-medium">{formatTime(classItem.start)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-xl border ${config.bg} transition-all duration-200 card-hover`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${config.badge}`}>{config.label}</span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${typeColors[classItem.type]}`}>{classItem.type}</span>
          </div>
          <h3 className="text-base font-bold text-slate-800">{classItem.subject}</h3>
          <p className="text-[12px] text-slate-400 mt-0.5">{classItem.code}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-[12px]">
        <div className="flex items-center gap-1.5 text-slate-500">
          <HiOutlineClock className="w-3.5 h-3.5" />
          <span>{formatTime(classItem.start)} - {formatTime(classItem.end)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500">
          <HiOutlineLocationMarker className="w-3.5 h-3.5" />
          <span>{classItem.room}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500">
          <HiOutlineUser className="w-3.5 h-3.5" />
          <span>{classItem.faculty}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500">
          <HiOutlineBookOpen className="w-3.5 h-3.5" />
          <span>{classItem.type}</span>
        </div>
      </div>

      {status === 'now' && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
            <span>Class Progress</span>
            <span className="font-semibold text-indigo-600">{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
