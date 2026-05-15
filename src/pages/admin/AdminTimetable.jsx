import { useState, useEffect } from 'react';
import { HiOutlineCalendar, HiOutlineTrash, HiOutlinePlus, HiOutlineX } from 'react-icons/hi';
import { adminAPI } from '../../services/adminApi';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function AdminTimetable() {
  const [entries, setEntries] = useState([]);
  const [users, setUsers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [filterUser, setFilterUser] = useState('');
  const [form, setForm] = useState({ userId: '', subjectId: '', day: 'Monday', startTime: '09:00', endTime: '10:00', room: '', type: 'Lecture' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [ttRes, userRes, subRes] = await Promise.all([
        adminAPI.getTimetable(filterUser || undefined),
        adminAPI.getUsers(),
        adminAPI.getSubjects(),
      ]);
      setEntries(ttRes.timetable || []);
      setUsers(userRes.users?.filter(u => u.role === 'student') || []);
      setSubjects(subRes.subjects || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!loading) {
      adminAPI.getTimetable(filterUser || undefined)
        .then(res => setEntries(res.timetable || []))
        .catch(console.error);
    }
  }, [filterUser]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createTimetable(form);
      setShowCreate(false);
      setForm({ userId: '', subjectId: '', day: 'Monday', startTime: '09:00', endTime: '10:00', room: '', type: 'Lecture' });
      loadData();
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this timetable entry?')) return;
    try { await adminAPI.deleteTimetable(id); loadData(); }
    catch (err) { alert(err.message); }
  };

  // Filter subjects by selected user in form
  const userSubjects = form.userId ? subjects.filter(s => s.user_id === parseInt(form.userId)) : [];

  if (loading) {
    return <div className="p-6 flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2.5">
            <HiOutlineCalendar className="w-6 h-6 text-indigo-600" />
            Timetable Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">{entries.length} entries</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={filterUser} onChange={e => setFilterUser(e.target.value)} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] outline-none">
            <option value="">All Students</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.full_name}</option>)}
          </select>
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-medium rounded-lg transition-colors">
            <HiOutlinePlus className="w-4 h-4" /> Add Entry
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Student</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Subject</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Day</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Time</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Room</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(entry => (
                <tr key={entry.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-800 font-medium">{entry.user_name}</td>
                  <td className="px-4 py-3 text-slate-500">{entry.subject_name} ({entry.subject_code})</td>
                  <td className="px-4 py-3 text-slate-500">{entry.day}</td>
                  <td className="px-4 py-3 text-slate-500">{entry.start_time?.slice(0,5)} - {entry.end_time?.slice(0,5)}</td>
                  <td className="px-4 py-3 text-slate-500">{entry.room || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                      entry.type === 'Lab' ? 'bg-emerald-100 text-emerald-600' :
                      entry.type === 'Tutorial' ? 'bg-violet-100 text-violet-600' : 'bg-blue-100 text-blue-600'
                    }`}>{entry.type}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(entry.id)} className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-red-600">
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">No timetable entries</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Add Timetable Entry</h3>
              <button onClick={() => setShowCreate(false)} className="p-1 rounded hover:bg-slate-100">
                <HiOutlineX className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <select value={form.userId} onChange={e => setForm(p => ({...p, userId: e.target.value, subjectId: ''}))} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-indigo-300">
                <option value="">Select Student *</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.full_name}</option>)}
              </select>
              <select value={form.subjectId} onChange={e => setForm(p => ({...p, subjectId: e.target.value}))} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-indigo-300">
                <option value="">Select Subject *</option>
                {userSubjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
              </select>
              <select value={form.day} onChange={e => setForm(p => ({...p, day: e.target.value}))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-indigo-300">
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-500 mb-1 block">Start Time *</label>
                  <input type="time" value={form.startTime} onChange={e => setForm(p => ({...p, startTime: e.target.value}))} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-indigo-300" />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 mb-1 block">End Time *</label>
                  <input type="time" value={form.endTime} onChange={e => setForm(p => ({...p, endTime: e.target.value}))} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-indigo-300" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="Room" value={form.room} onChange={e => setForm(p => ({...p, room: e.target.value}))} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-indigo-300" />
                <select value={form.type} onChange={e => setForm(p => ({...p, type: e.target.value}))} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-indigo-300">
                  <option value="Lecture">Lecture</option>
                  <option value="Lab">Lab</option>
                  <option value="Tutorial">Tutorial</option>
                </select>
              </div>
              <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-medium rounded-lg transition-colors">
                Add Entry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
