import { useState, useEffect } from 'react';
import { HiOutlineUsers, HiOutlineTrash, HiOutlinePencil, HiOutlinePlus, HiOutlineX } from 'react-icons/hi';
import { adminAPI } from '../../services/adminApi';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'student', rollNo: '', semester: '', branch: '', college: '' });

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const res = await adminAPI.getUsers();
      setUsers(res.users || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createUser(form);
      setShowCreate(false);
      setForm({ fullName: '', email: '', password: '', role: 'student', rollNo: '', semester: '', branch: '', college: '' });
      loadUsers();
    } catch (err) { alert(err.message); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.updateUser(editUser.id, form);
      setEditUser(null);
      loadUsers();
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminAPI.deleteUser(id);
      loadUsers();
    } catch (err) { alert(err.message); }
  };

  const openEdit = (user) => {
    setEditUser(user);
    setForm({
      fullName: user.full_name,
      email: user.email,
      role: user.role,
      rollNo: user.roll_no || '',
      semester: user.semester || '',
      branch: user.branch || '',
      college: user.college || '',
    });
  };

  if (loading) {
    return <div className="p-6 flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2.5">
            <HiOutlineUsers className="w-6 h-6 text-indigo-600" />
            User Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">{users.length} users registered</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-medium rounded-lg transition-colors">
          <HiOutlinePlus className="w-4 h-4" /> Add User
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Role</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Roll No</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Semester</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{user.full_name}</td>
                  <td className="px-4 py-3 text-slate-500">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${user.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{user.roll_no || '—'}</td>
                  <td className="px-4 py-3 text-slate-500">{user.semester || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(user)} className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-indigo-600">
                        <HiOutlinePencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(user.id)} className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-red-600">
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreate || editUser) && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">{editUser ? 'Edit User' : 'Create User'}</h3>
              <button onClick={() => { setShowCreate(false); setEditUser(null); }} className="p-1 rounded hover:bg-slate-100">
                <HiOutlineX className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={editUser ? handleUpdate : handleCreate} className="space-y-3">
              <input type="text" placeholder="Full Name *" value={form.fullName} onChange={e => setForm(p => ({...p, fullName: e.target.value}))} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-indigo-300" />
              <input type="email" placeholder="Email *" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-indigo-300" />
              {!editUser && <input type="password" placeholder="Password *" value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} required minLength={6} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-indigo-300" />}
              <select value={form.role} onChange={e => setForm(p => ({...p, role: e.target.value}))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-indigo-300">
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="Roll No" value={form.rollNo} onChange={e => setForm(p => ({...p, rollNo: e.target.value}))} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-indigo-300" />
                <input type="text" placeholder="Semester" value={form.semester} onChange={e => setForm(p => ({...p, semester: e.target.value}))} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-indigo-300" />
              </div>
              <input type="text" placeholder="Branch" value={form.branch} onChange={e => setForm(p => ({...p, branch: e.target.value}))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-indigo-300" />
              <input type="text" placeholder="College" value={form.college} onChange={e => setForm(p => ({...p, college: e.target.value}))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-indigo-300" />
              <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-medium rounded-lg transition-colors">
                {editUser ? 'Update User' : 'Create User'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
