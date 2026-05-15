import { useState, useEffect } from 'react';
import { HiOutlineBell, HiOutlinePaperAirplane } from 'react-icons/hi';
import { adminAPI } from '../../services/adminApi';

export default function AdminNotifications() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ userId: '', title: '', message: '', type: 'info' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    adminAPI.getUsers()
      .then(res => setUsers(res.users?.filter(u => u.role === 'student') || []))
      .catch(console.error);
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    setSent(false);
    try {
      await adminAPI.sendNotification({
        userId: form.userId ? parseInt(form.userId) : undefined,
        title: form.title,
        message: form.message,
        type: form.type,
      });
      setSent(true);
      setForm({ userId: '', title: '', message: '', type: 'info' });
      setTimeout(() => setSent(false), 3000);
    } catch (err) { alert(err.message); }
    finally { setSending(false); }
  };

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2.5">
          <HiOutlineBell className="w-6 h-6 text-indigo-600" />
          Send Notifications
        </h1>
        <p className="text-slate-500 text-sm mt-1">Send notifications to students</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-w-lg">
        {sent && (
          <div className="mb-4 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-[13px] text-emerald-700 font-medium">
            Notification sent successfully!
          </div>
        )}

        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Send To</label>
            <select value={form.userId} onChange={e => setForm(p => ({...p, userId: e.target.value}))} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-indigo-300">
              <option value="">All Students</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Title *</label>
            <input type="text" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} placeholder="Notification title" required className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-indigo-300" />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Message *</label>
            <textarea value={form.message} onChange={e => setForm(p => ({...p, message: e.target.value}))} placeholder="Notification message" required rows={3} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-indigo-300 resize-none" />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Type</label>
            <select value={form.type} onChange={e => setForm(p => ({...p, type: e.target.value}))} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-indigo-300">
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="success">Success</option>
              <option value="danger">Danger</option>
            </select>
          </div>

          <button type="submit" disabled={sending} className="flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-[13px] font-medium rounded-lg transition-colors">
            <HiOutlinePaperAirplane className="w-4 h-4" />
            {sending ? 'Sending...' : 'Send Notification'}
          </button>
        </form>
      </div>
    </div>
  );
}
