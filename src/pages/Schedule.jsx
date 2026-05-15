import { useState } from 'react';
import { HiOutlineCalendar, HiOutlineClock } from 'react-icons/hi';
import ClassCard from '../components/Dashboard/ClassCard';
import { timetableData } from '../data/timetable';
import { getCurrentDay } from '../utils/timeUtils';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Schedule() {
  const [selectedDay, setSelectedDay] = useState(getCurrentDay() === 'Sunday' ? 'Monday' : getCurrentDay());

  const classes = timetableData[selectedDay] || [];

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2.5">
          <HiOutlineCalendar className="w-6 h-6 text-indigo-600" />
          Weekly Schedule
        </h1>
        <p className="text-slate-500 text-sm mt-1">View and manage your class timetable</p>
      </div>

      {/* Day Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {days.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-lg text-[13px] font-medium whitespace-nowrap transition-all duration-150 ${
              selectedDay === day
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-500 border border-slate-200 hover:border-indigo-200 hover:text-slate-700'
            }`}
          >
            {day}
            {day === getCurrentDay() && selectedDay !== day && (
              <span className="ml-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full inline-block" />
            )}
          </button>
        ))}
      </div>

      {/* Classes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-slate-800">
            {selectedDay}'s Classes
          </h2>
          <span className="text-[12px] text-slate-400 flex items-center gap-1 font-medium">
            <HiOutlineClock className="w-3.5 h-3.5" />
            {classes.length} classes
          </span>
        </div>

        {classes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {classes.map((cls, index) => (
              <div key={cls.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.08}s` }}>
                <ClassCard classItem={cls} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <HiOutlineCalendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-base">No classes on {selectedDay}</p>
            <p className="text-sm text-slate-400 mt-1">Enjoy your day off!</p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 p-4 bg-white rounded-xl border border-slate-200">
        <span className="text-[12px] font-semibold text-slate-600">Class Types:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span className="text-[12px] text-slate-500">Lecture</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-[12px] text-slate-500">Lab</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
          <span className="text-[12px] text-slate-500">Tutorial</span>
        </div>
        <span className="text-[12px] text-slate-400 ml-auto">
          Status: <span className="text-slate-500">Done</span> · <span className="text-indigo-500">Live</span> · <span className="text-amber-500">Upcoming</span>
        </span>
      </div>
    </div>
  );
}
