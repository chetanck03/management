import { useState, useEffect } from 'react';
import { HiOutlineBookOpen, HiOutlineTrash, HiOutlinePlus, HiOutlineX } from 'react-icons/hi';
import { adminAPI } from '../../services/adminApi';

export default function AdminSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssign, setShowAssign] = useState(false);
  const [assignForm, setAssignForm] = useState({ userId: '', name: '', code: '', faculty: '', color: '#4f46e5' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [subRes, userRes] = await Promise.all([adminAPI.getSubjects(), adminAPI.getUsers()]);
      setSubjects(subRes.subjects || []);
      setUsers(userRes.users?.filter(u => u.role === 'student') || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.assignSubjects({
        userId: parseInt(assignForm.userId),
        subjects: [{ name: assignForm.name, code: assignForm.code, faculty: assignForm.faculty, color: assignForm.color }]
      });
      setShowAssign(false);
      setAssignForm({ userId: '', name: '', code: '', faculty: '', color: '#4f46e5' });
      loadData();
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this subject?')) return;
    try { await adminAPI.deleteSubject(id); loadData(); }
    catch (err) { alert(err.message); }
  };

  if (loading) {
    return <div className="p-6 flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2.5">
            <HiOutlineBookOpen className="w-6 h-6 text-indigo-600" />
            Subject Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">{subjects.length} subjects assigned</p>
        </div>
        <button onClick={() => setShowAssign(true)} className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-medium rounded-lg transition-colors">
          <HiOutlinePlus className="w-4 h-4" /> Assign Subject
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Subject</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Code</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Faculty</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Assigned To</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(sub => (
                <tr key={sub.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sub.color }} />
                      <span className="font-medium text-slate-800">{sub.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{sub.code}</td>
                  <td className="px-4 py-3 text-slate-500">{sub.faculty || '—'}</td>
                  <td className="px-4 py-3 text-slate-500">{sub.user_name || '—'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(sub.id)} className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-red-600">
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Modal */}
      {showAssign && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Assign Subject to Student</h3>
              <button onClick={() => setShowAssign(false)} className="p-1 rounded hover:bg-slate-100">
                <HiOutlineX className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleAssign} className="space-y-3">
              <select value={assignForm.userId} onChange={e => setAssignForm(p => ({...p, userId: e.target.value}))} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-indigo-300">
                <option value="">Select Student *</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>)}
              </select>
              <input type="text" placeholder="Subject Name *" value={assignForm.name} onChange={e => setAssignForm(p => ({...p, name: e.target.value}))} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-indigo-300" />
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="Code *" value={assignForm.code} onChange={e => setAssignForm(p => ({...p, code: e.target.value}))} required className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-indigo-300" />
                <input type="text" placeholder="Faculty" value={assignForm.faculty} onChange={e => setAssignForm(p => ({...p, faculty: e.target.value}))} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-indigo-300" />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-[13px] text-slate-600">Color:</label>
                <input type="color" value={assignForm.color} onChange={e => setAssignForm(p => ({...p, color: e.target.value}))} className="w-8 h-8 rounded border border-slate-200 cursor-pointer" />
              </div>
              <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-medium rounded-lg transition-colors">
                Assign Subject
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
