import { useState, useEffect } from 'react';
import { HiOutlineChartBar } from 'react-icons/hi';
import { adminAPI } from '../../services/adminApi';

export default function AdminAttendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getAttendance()
      .then(res => setRecords(res.records || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6 flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2.5">
          <HiOutlineChartBar className="w-6 h-6 text-indigo-600" />
          Attendance Overview
        </h1>
        <p className="text-slate-500 text-sm mt-1">All students attendance records</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Student</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Roll No</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Subject</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Total</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Present</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec, i) => {
                const pct = rec.total > 0 ? Math.round((parseInt(rec.present) / parseInt(rec.total)) * 100) : 0;
                return (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{rec.full_name}</td>
                    <td className="px-4 py-3 text-slate-500">{rec.roll_no || '—'}</td>
                    <td className="px-4 py-3 text-slate-500">{rec.subject_name} ({rec.subject_code})</td>
                    <td className="px-4 py-3 text-slate-500">{rec.total}</td>
                    <td className="px-4 py-3 text-slate-500">{rec.present}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${pct >= 75 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className={`text-[12px] font-semibold ${pct >= 75 ? 'text-emerald-600' : pct >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                          {pct}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {records.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">No attendance records yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
