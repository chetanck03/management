import { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
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
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Calendar className="w-7 h-7 text-indigo-500" />
          Weekly Schedule
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">View and manage your class timetable</p>
      </div>

      {/* Day Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {days.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              selectedDay === day
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-950/50'
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'
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
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {selectedDay}'s Classes
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {classes.length} classes
          </span>
        </div>

        {classes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classes.map((cls, index) => (
              <div key={cls.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <ClassCard classItem={cls} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700">
            <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">No classes on {selectedDay}</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Enjoy your day off! 🎉</p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Class Types:</span>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Lecture</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Lab</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-purple-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Tutorial</span>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
          Status: <span className="text-gray-600 dark:text-gray-300">Done</span> · <span className="text-indigo-500">Now</span> · <span className="text-amber-500">Upcoming</span>
        </span>
      </div>
    </div>
  );
}
