import { useState, useEffect } from 'react';
import { HiOutlineChartBar } from 'react-icons/hi';
import { FiTrendingUp, FiTrendingDown, FiAlertTriangle } from 'react-icons/fi';
import CircularProgress from '../components/Dashboard/CircularProgress';
import { attendanceAPI } from '../services/api';

export default function Attendance() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      const res = await attendanceAPI.getSummary();
      setSubjects(res.subjects || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const overallAttendance = subjects.length > 0
    ? Math.round(subjects.reduce((acc, s) => acc + s.percentage, 0) / subjects.length)
    : 0;
  const lowAttendance = subjects.filter(s => s.percentage < 75 && s.total_classes > 0);
  const highAttendance = subjects.filter(s => s.percentage >= 85 && s.total_classes > 0);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2.5">
          <HiOutlineChartBar className="w-6 h-6 text-indigo-600" />
          Attendance Analytics
        </h1>
        <p className="text-slate-500 text-sm mt-1">Track your attendance across all subjects</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <CircularProgress percentage={overallAttendance} size={72} strokeWidth={6} color="#4f46e5" />
          <div>
            <p className="text-[12px] text-slate-500">Overall Attendance</p>
            <p className="text-2xl font-bold text-slate-800">{overallAttendance}%</p>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <FiTrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-[12px] text-slate-500">Best Performing</span>
          </div>
          <p className="text-base font-bold text-slate-800">
            {highAttendance.length > 0 ? highAttendance[0].name : 'N/A'}
          </p>
          <p className="text-sm text-emerald-500 font-medium">
            {highAttendance.length > 0 ? `${highAttendance[0].percentage}%` : 'Mark attendance to see'}
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <FiAlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="text-[12px] text-slate-500">Needs Attention</span>
          </div>
          <p className="text-base font-bold text-slate-800">
            {lowAttendance.length > 0 ? lowAttendance[0].name : 'All Good!'}
          </p>
          <p className="text-sm text-amber-500 font-medium">
            {lowAttendance.length > 0 ? `${lowAttendance[0].percentage}%` : ''}
          </p>
        </div>
      </div>

      {/* Subject-wise Attendance */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
        <h3 className="font-semibold text-slate-800 text-[15px] mb-5">Subject-wise Attendance</h3>
        {subjects.length > 0 ? (
          <div className="space-y-4">
            {subjects.map(subject => (
              <div key={subject.subject_id} className="flex items-center gap-4">
                <div className="w-36 lg:w-52 flex-shrink-0">
                  <p className="text-[13px] font-medium text-slate-800 truncate">{subject.name}</p>
                  <p className="text-[11px] text-slate-400">{subject.code} — {subject.total_classes} classes</p>
                </div>
                <div className="flex-1">
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${subject.percentage}%`, backgroundColor: subject.color }}
                    />
                  </div>
                </div>
                <div className="w-14 text-right">
                  <span className={`text-[13px] font-bold ${
                    subject.percentage >= 85 ? 'text-emerald-500' :
                    subject.percentage >= 75 ? 'text-amber-500' : 'text-red-500'
                  }`}>
                    {subject.percentage}%
                  </span>
                </div>
                <div className="w-5">
                  {subject.percentage >= 85 ? (
                    <FiTrendingUp className="w-4 h-4 text-emerald-500" />
                  ) : subject.percentage < 75 && subject.total_classes > 0 ? (
                    <FiTrendingDown className="w-4 h-4 text-red-500" />
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[13px] text-slate-400 text-center py-6">No attendance data yet. Mark attendance to see analytics.</p>
        )}
      </div>

      {/* Circular Grid */}
      {subjects.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {subjects.map(subject => (
            <div key={subject.subject_id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col items-center">
              <CircularProgress 
                percentage={subject.percentage} 
                size={64} 
                strokeWidth={5} 
                color={subject.color}
              />
              <p className="text-[11px] font-medium text-slate-700 mt-2.5 text-center">{subject.name}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{subject.code}</p>
            </div>
          ))}
        </div>
      )}

      {/* Alerts */}
      {lowAttendance.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
          <div className="flex items-center gap-2 mb-3">
            <FiAlertTriangle className="w-4 h-4 text-amber-600" />
            <h3 className="font-semibold text-amber-800 text-[14px]">Attendance Alerts</h3>
          </div>
          <div className="space-y-2">
            {lowAttendance.map(subject => (
              <div key={subject.subject_id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-100">
                <div>
                  <p className="text-[13px] font-medium text-slate-800">{subject.name}</p>
                  <p className="text-[11px] text-slate-500">Current: {subject.percentage}% — Required: 75%</p>
                </div>
                <span className="text-[11px] font-medium text-amber-600 bg-amber-100 px-2 py-1 rounded">
                  Low Attendance
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
